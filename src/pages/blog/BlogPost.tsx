import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/ui/floating-cta";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { blogService, FullPost } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Post, PostCard } from "@/components/blog/PostCard";
import { marked } from "marked";

// Configure marked options if needed (optional)
// marked.use({ ... });

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<FullPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [adjacentPosts, setAdjacentPosts] = useState<{ next: any, prev: any } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useScrollToTop();

    useEffect(() => {
        if (!slug) return;

        const loadPostData = async () => {
            setLoading(true);
            try {
                const postData = await blogService.getPostBySlug(slug);
                if (postData) {
                    setPost(postData);

                    // valid post, load extras
                    const [related, adjacent] = await Promise.all([
                        blogService.getRelatedPosts(
                            postData.id,
                            postData.categories?.map(c => c.id) || []
                        ),
                        postData.published_at
                            ? blogService.getAdjacentPosts(postData.published_at)
                            : Promise.resolve(null)
                    ]);

                    setRelatedPosts(related);
                    setAdjacentPosts(adjacent);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to load post", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadPostData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-24 pb-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {/* Simplified Loading Skeleton */}
                        <Skeleton className="h-8 w-32 mb-8" />
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
                        <p className="text-muted-foreground mb-8">O artigo que você procura não existe ou foi removido.</p>
                        <Button asChild>
                            <Link to="/blog">Voltar para o Blog</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-20 bg-background">
                <Helmet>
                    <title>{post.title} | Blog Crie Valor</title>
                    <meta name="description" content={post.excerpt || post.title} />
                    {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
                </Helmet>

                {/* Header */}
                <div className="container mx-auto px-4 max-w-4xl mb-12">
                    <div className="mb-8">
                        <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para o Blog
                        </Link>
                    </div>

                    <div className="flex gap-2 mb-6 flex-wrap">
                        {post.categories?.map(cat => (
                            <Badge key={cat.slug} variant="secondary">
                                {cat.name}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-y py-6 mt-8">
                        <div className="flex items-center gap-6">
                            {post.author && (
                                <div className="flex items-center gap-3">
                                    {post.author.avatar_url ? (
                                        <img src={post.author.avatar_url} alt={post.author.full_name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-sm">{post.author.full_name}</p>
                                        <p className="text-xs text-muted-foreground">{post.author.role || "Autor"}</p>
                                    </div>
                                </div>
                            )}
                            {post.published_at && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(post.published_at).toLocaleDateString("pt-BR", {
                                            day: "numeric", month: "long", year: "numeric"
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Button variant="ghost" size="icon" title="Compartilhar">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Featured Image */}
                {post.cover_image_url && (
                    <div className="container mx-auto px-4 max-w-5xl mb-12">
                        <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg relative bg-muted">
                            <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="container mx-auto px-4 max-w-3xl mb-16">
                    {/* Hack to force override inline styles from legacy content */}
                    <style>{`
                        .blog-content * {
                            color: inherit !important;
                            background-color: transparent !important;
                            font-family: inherit !important;
                        }
                        .blog-content a {
                            color: hsl(var(--primary)) !important;
                        }
                        .blog-content strong {
                            font-weight: 700 !important;
                        }
                        .blog-content img {
                            margin: 2rem auto;
                            border-radius: 0.5rem;
                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                        }
                    `}</style>
                    <div
                        className="blog-content prose prose-lg dark:prose-invert max-w-none 
                        text-foreground/90
                        prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        marker:text-primary"
                        dangerouslySetInnerHTML={{
                            __html: (() => {
                                const content = post.content || "";
                                // Heuristic: If it looks like HTML, return as is. Otherwise parse as Markdown.
                                const isHtml = /<[a-z][\s\S]*>/i.test(content);
                                if (isHtml) return content;
                                return marked.parse(content) as string;
                            })()
                        }}
                    />
                </div>

                {/* Navigation (Prev/Next) */}
                {(adjacentPosts?.prev || adjacentPosts?.next) && (
                    <div className="container mx-auto px-4 max-w-4xl mb-16 border-t pt-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {adjacentPosts.prev ? (
                                <Link to={`/blog/${adjacentPosts.prev.slug}`} className="group flex flex-col items-start text-left">
                                    <span className="text-sm text-muted-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                                        <ArrowLeft className="w-4 h-4" /> Anterior
                                    </span>
                                    <span className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                                        {adjacentPosts.prev.title}
                                    </span>
                                </Link>
                            ) : <div />} {/* Spacer */}

                            {adjacentPosts.next ? (
                                <Link to={`/blog/${adjacentPosts.next.slug}`} className="group flex flex-col items-end text-right">
                                    <span className="text-sm text-muted-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                                        Próximo <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </span>
                                    <span className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                                        {adjacentPosts.next.title}
                                    </span>
                                </Link>
                            ) : <div />}
                        </div>
                    </div>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="bg-muted/30 py-16 border-t">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <h3 className="text-2xl font-bold mb-8">Você pode gostar também</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map(p => (
                                    <PostCard key={p.id} post={p} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>

            <FloatingCTA />
            <Footer />
        </div>
    );
}
