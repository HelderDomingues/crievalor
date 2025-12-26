import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/components/blog/PostCard";

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface Author {
    id: string;
    name: string;
    role: string | null;
    bio: string | null;
    email: string | null;
    avatar_url: string | null;
    social_links: any;
    website: string | null;
}

export interface FullPost extends Post {
    content: string;
    author_id: string | null;
    display_author_id: string | null;
    author: Author | null;
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
        display_author_id,
        post_categories(
          categories(id, name, slug)
        ),
        profile_author:profiles(full_name, avatar_url),
        display_author:authors(id, name, avatar_url, role)
      `, { count: "exact" }) as any)
            .eq("published", true)
            .order("published_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }

        // Transform data to match Post interface
        const posts: Post[] = data.map((post: any) => {
            // Prefer display_author (custom), fallback to profile_author (system)
            const author = post.display_author || {
                name: post.profile_author?.full_name,
                avatar_url: post.profile_author?.avatar_url
            };

            return {
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                cover_image_url: post.cover_image_url,
                published_at: post.published_at,
                author_name: author.name,
                author_avatar: author.avatar_url,
                categories: post.post_categories?.map((pc: any) => pc.categories),
            };
        });

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
        display_author_id,
        profile_author:profiles(full_name, avatar_url),
        display_author:authors(id, name, avatar_url, role),
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

        return data.map((post: any) => {
            const author = post.display_author || {
                name: post.profile_author?.full_name,
                avatar_url: post.profile_author?.avatar_url
            };

            return {
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                cover_image_url: post.cover_image_url,
                published_at: post.published_at,
                author_name: author.name,
                categories: post.post_categories?.map((pc: any) => pc.categories),
            };
        }) as Post[];
    },

    async getPostBySlug(slug: string): Promise<FullPost | null> {
        const { data, error } = await (supabase
            .from("posts" as any)
            .select(`
        *,
        post_categories(
          categories(id, name, slug)
        ),
        profile_author:profiles(full_name, avatar_url, role),
        display_author:authors(id, name, bio, role, avatar_url, social_links, website)
      `) as any)
            .eq("slug", slug)
            .eq("published", true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.error("Error fetching post by slug:", error);
            throw error;
        }

        // Resolve author
        const rawAuthor = data.display_author || data.profile_author;
        const author: Author | null = rawAuthor ? {
            id: data.display_author?.id || data.author_id, // If profile, use user id
            name: rawAuthor.name || rawAuthor.full_name,
            role: rawAuthor.role,
            bio: rawAuthor.bio,
            avatar_url: rawAuthor.avatar_url,
            email: null, // Don't expose email publicly
            social_links: rawAuthor.social_links || {},
            website: rawAuthor.website
        } : null;

        return {
            ...data,
            author_name: author?.name,
            categories: data.post_categories?.map((pc: any) => pc.categories),
            author: author
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

    async getAuthorById(id: string): Promise<Author | null> {
        const { data, error } = await supabase
            .from("authors")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching author:", error);
            return null;
        }

        return data as Author;
    },

    async getPostsByAuthor(authorId: string) {
        const { data, error } = await (supabase
            .from("posts" as any)
            .select(`
                id, title, slug, excerpt, cover_image_url, published_at,
                post_categories(categories(id, name, slug))
            `) as any)
            .eq("published", true)
            .eq("display_author_id", authorId)
            .order("published_at", { ascending: false });

        if (error) {
            console.error("Error fetching author posts:", error);
            throw error;
        }

        return data.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            cover_image_url: post.cover_image_url,
            published_at: post.published_at,
            categories: post.post_categories?.map((pc: any) => pc.categories),
        })) as Post[];
    },

    async getPostsByCategory(categorySlug: string) {
        // First get category ID
        const { data: category, error: catError } = await (supabase
            .from("categories" as any)
            .select("id, name")
            .eq("slug", categorySlug)
            .single() as any);

        if (catError || !category) return { posts: [], categoryName: null };

        const { data: postsData, error: postsError } = await (supabase
            .from("posts" as any)
            .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image_url,
          published_at,
          profile_author:profiles(full_name),
          display_author:authors(name),
          post_categories!inner(category_id)
      `) as any)
            .eq("published", true)
            .eq("post_categories.category_id", category.id)
            .order("published_at", { ascending: false });

        if (postsError) {
            console.error("Error fetching posts by category:", postsError);
            throw postsError;
        }

        const posts: Post[] = postsData.map((post: any) => {
            const authorName = post.display_author?.name || post.profile_author?.full_name;
            return {
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                cover_image_url: post.cover_image_url,
                published_at: post.published_at,
                author_name: authorName,
                categories: [{ name: category.name, slug: categorySlug }]
            };
        });

        return { posts, categoryName: category.name };
    },

    async getRelatedPosts(currentPostId: string, categoryIds: string[], limit = 3) {
        if (!categoryIds.length) {
            const { data } = await supabase
                .from("posts" as any)
                .select(`
                    id, title, slug, excerpt, cover_image_url, published_at,
                    profile_author:profiles(full_name),
                    display_author:authors(name),
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
                author_name: post.display_author?.name || post.profile_author?.full_name,
                categories: post.post_categories?.map((pc: any) => pc.categories),
            })) as Post[];
        }

        const { data, error } = await supabase
            .from("post_categories" as any)
            .select(`
                post:posts(
                    id, title, slug, excerpt, cover_image_url, published_at,
                    profile_author:profiles(full_name),
                    display_author:authors(name)
                )
            `)
            .in("category_id", categoryIds)
            .neq("post.id", currentPostId)
            .limit(limit + 5) as any;

        if (error) {
            console.error("Error fetching related posts:", error);
            return [];
        }

        // Deduplicate and format
        const relatedPostsMap = new Map();
        data?.forEach((item: any) => {
            if (item.post && item.post.id !== currentPostId && item.post.published_at) {
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
            author_name: post.display_author?.name || post.profile_author?.full_name,
        })) as Post[];
    },

    async getAdjacentPosts(currentPublishedAt: string) {
        const { data: next } = await supabase
            .from("posts" as any)
            .select("title, slug")
            .eq("published", true)
            .gt("published_at", currentPublishedAt)
            .order("published_at", { ascending: true })
            .limit(1)
            .maybeSingle() as any;

        const { data: prev } = await supabase
            .from("posts" as any)
            .select("title, slug")
            .eq("published", true)
            .lt("published_at", currentPublishedAt)
            .order("published_at", { ascending: false })
            .limit(1)
            .maybeSingle() as any;

        return { next, prev };
    }
};
