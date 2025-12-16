import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/components/blog/PostCard";

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface FullPost extends Post {
    content: string;
    author_id: string | null;
    author: {
        full_name: string;
        avatar_url: string | null;
        bio: string | null;
        role: string | null;
    } | null;
}

export const blogService = {
    async getPosts(limit = 10, offset = 0) {
        const { data, error, count } = await (supabase
            .from("posts" as any)
            .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        published_at,
        featured,
        created_at,
        post_categories(
          categories(id, name, slug)
        ),
        author:profiles(full_name)
      `, { count: "exact" }) as any)
            .eq("published", true)
            .order("published_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }

        // Transform data to match Post interface
        const posts: Post[] = data.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            cover_image_url: post.cover_image_url,
            published_at: post.published_at,
            author_name: post.author?.full_name,
            categories: post.post_categories?.map((pc: any) => pc.categories),
        }));

        return { posts, count };
    },

    async getFeaturedPosts() {
        const { data, error } = await (supabase
            .from("posts" as any)
            .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        published_at,
        author:profiles(full_name),
        post_categories(
          categories(id, name, slug)
        )
      `) as any)
            .eq("published", true)
            .eq("featured", true)
            .order("published_at", { ascending: false })
            .limit(3);

        if (error) {
            console.error("Error fetching featured posts:", error);
            throw error;
        }

        return data.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            cover_image_url: post.cover_image_url,
            published_at: post.published_at,
            author_name: post.author?.full_name,
            categories: post.post_categories?.map((pc: any) => pc.categories),
        })) as Post[];
    },

    async getPostBySlug(slug: string): Promise<FullPost | null> {
        const { data, error } = await (supabase
            .from("posts" as any)
            .select(`
        *,
        post_categories(
          categories(id, name, slug)
        ),
        author:profiles(full_name, avatar_url, role)
      `) as any)
            .eq("slug", slug)
            .eq("published", true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.error("Error fetching post by slug:", error);
            throw error;
        }

        return {
            ...data,
            author_name: data.author?.full_name,
            categories: data.post_categories?.map((pc: any) => pc.categories),
        } as FullPost;
    },

    async getCategories() {
        const { data, error } = await (supabase
            .from("categories" as any)
            .select("*")
            .order("name") as any);

        if (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }

        return data as BlogCategory[];
    },

    async getPostsByCategory(categorySlug: string) {
        // First get category ID
        const { data: category, error: catError } = await (supabase
            .from("categories" as any)
            .select("id, name")
            .eq("slug", categorySlug)
            .single() as any);

        if (catError || !category) return { posts: [], categoryName: null };

        const { data, error } = await (supabase
            .from("post_categories" as any)
            .select(`
        post:posts(
          id,
          title,
          slug,
          excerpt,
          cover_image_url,
          published_at,
          author:profiles(full_name)
        )
      `) as any)
            .eq("category_id", category.id)
            .eq("post.published", true); // We'd need to filter nested locally or use !inner if we want precise DB filtering

        if (error) {
            console.error("Error fetching category posts:", error);
            throw error;
        }

        // Filter out null posts (published=false check above might return null parent if failed)
        // Actually Supabase filtering on joined tables can be tricky.
        // Better strategy: Select posts where...

        // Let's refine the query
        const { data: postsData, error: postsError } = await (supabase
            .from("posts" as any)
            .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image_url,
          published_at,
          author:profiles(full_name),
          post_categories!inner(category_id)
      `) as any)
            .eq("published", true)
            .eq("post_categories.category_id", category.id)
            .order("published_at", { ascending: false });

        if (postsError) {
            console.error("Error fetching posts by category:", postsError);
            throw postsError;
        }

        const posts: Post[] = postsData.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            cover_image_url: post.cover_image_url,
            published_at: post.published_at,
            author_name: post.author?.full_name,
            categories: [{ name: category.name, slug: categorySlug }] // We know the category
        }));

        return { posts, categoryName: category.name };
    },

    async getRelatedPosts(currentPostId: string, categoryIds: string[], limit = 3) {
        // If no categories, just get recent posts excluding current
        if (!categoryIds.length) {
            const { data } = await supabase
                .from("posts" as any)
                .select(`
                    id, title, slug, excerpt, cover_image_url, published_at,
                    author:profiles(full_name),
                    post_categories(categories(id, name, slug))
                `)
                .eq("published", true)
                .neq("id", currentPostId)
                .order("published_at", { ascending: false })
                .limit(limit) as any;

            return (data || []).map((post: any) => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                cover_image_url: post.cover_image_url,
                published_at: post.published_at,
                author_name: post.author?.full_name,
                categories: post.post_categories?.map((pc: any) => pc.categories),
            })) as Post[];
        }

        // Get posts from similar categories
        // Note: This is a simplified approach. Ideally we use an RPC or more complex query for "any category match"
        // For now, we'll just fetch from the first category to ensure relevance
        const { data, error } = await supabase
            .from("post_categories" as any)
            .select(`
                post:posts(
                    id, title, slug, excerpt, cover_image_url, published_at,
                    author:profiles(full_name)
                )
            `)
            .in("category_id", categoryIds)
            .neq("post.id", currentPostId) // This neq on joined might not work perfectly without !inner, filtering in JS is safer for small sets
            .limit(limit + 5) as any; // Fetch a bit more to filter in JS

        if (error) {
            console.error("Error fetching related posts:", error);
            return [];
        }

        // Deduplicate and format
        const relatedPostsMap = new Map();
        data?.forEach((item: any) => {
            if (item.post && item.post.id !== currentPostId && item.post.published_at) { // Ensure published/valid
                relatedPostsMap.set(item.post.id, item.post);
            }
        });

        const distinctPosts = Array.from(relatedPostsMap.values()).slice(0, limit);

        return distinctPosts.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            cover_image_url: post.cover_image_url,
            published_at: post.published_at,
            author_name: post.author?.full_name,
            // We'd need to fetch categories for these related posts again to show them, 
            // but for "Related" cards we might skip chips or fetch them if needed. 
            // Let's skip simplified for now or fetch if critical.
        })) as Post[];
    },

    async getAdjacentPosts(currentPublishedAt: string) {
        // Next Post (Newer)
        const { data: next } = await supabase
            .from("posts" as any)
            .select("title, slug")
            .eq("published", true)
            .gt("published_at", currentPublishedAt)
            .order("published_at", { ascending: true }) // Oldest of the newer ones = immediate next
            .limit(1)
            .maybeSingle() as any;

        // Previous Post (Older)
        const { data: prev } = await supabase
            .from("posts" as any)
            .select("title, slug")
            .eq("published", true)
            .lt("published_at", currentPublishedAt)
            .order("published_at", { ascending: false }) // Newest of the older ones = immediate prev
            .limit(1)
            .maybeSingle() as any;

        return { next, prev };
    }
};
