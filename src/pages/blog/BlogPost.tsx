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

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<FullPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useScrollToTop();

    useEffect(() => {
        if (!slug) return;

        const loadPost = async () => {
            setLoading(true);
            try {
                const data = await blogService.getPostBySlug(slug);
                if (data) {
                    setPost(data);
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

        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-24 pb-20">
                    <div className="container mx-auto px-4 max-w-4xl">
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
                <div className="container mx-auto px-4 max-w-3xl">
                    <div
                        className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                      prose-headings:font-bold prose-headings:text-foreground 
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:shadow-md"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </main>

            <FloatingCTA />
            <Footer />
        </div>
    );
}
