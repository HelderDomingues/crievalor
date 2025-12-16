import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/ui/floating-cta";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { blogService } from "@/services/blogService";
import { Post, PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

export default function BlogHome() {
    const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useScrollToTop();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [featured, recent] = await Promise.all([
                    blogService.getFeaturedPosts(),
                    blogService.getPosts(10), // Limit 10
                ]);

                setFeaturedPosts(featured);

                // Filter out featured posts from recent list to avoid duplicates (client side)
                const featuredIds = new Set(featured.map(p => p.id));
                setRecentPosts(recent.posts.filter(p => !featuredIds.has(p.id)));
            } catch (error) {
                console.error("Failed to load blog data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-20">
                <Helmet>
                    <title>Blog Crie Valor | Insights sobre Negócios e Gestão</title>
                    <meta name="description" content="Artigos, dicas e insights sobre gestão empresarial, liderança, marketing e vendas para impulsionar o seu negócio." />
                </Helmet>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-16 space-y-4 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                            Blog Crie Valor
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Conteúdo estratégico para quem quer construir empresas de valor.
                        </p>
                    </div>

                    {/* Featured Section */}
                    {loading ? (
                        <div className="grid gap-8 mb-16">
                            <Skeleton className="h-[400px] w-full rounded-xl" />
                        </div>
                    ) : featuredPosts.length > 0 && (
                        <section className="mb-16">
                            <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl group">
                                <div className="grid md:grid-cols-2 gap-0">
                                    <div className="h-full min-h-[300px] relative overflow-hidden">
                                        <img
                                            src={featuredPosts[0].cover_image_url || "/placeholder.svg"}
                                            alt={featuredPosts[0].title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="space-y-4">
                                            <div className="flex gap-2 text-sm text-primary font-medium">
                                                {featuredPosts[0].categories?.map(c => (
                                                    <span key={c.slug} className="uppercase tracking-wider">{c.name}</span>
                                                ))}
                                            </div>
                                            <Link to={`/blog/${featuredPosts[0].slug}`} className="block">
                                                <h2 className="text-3xl md:text-4xl font-bold leading-tight hover:text-primary transition-colors">
                                                    {featuredPosts[0].title}
                                                </h2>
                                            </Link>
                                            <p className="text-muted-foreground text-lg line-clamp-3">
                                                {featuredPosts[0].excerpt}
                                            </p>
                                            <div className="pt-4">
                                                <Button asChild size="lg" className="rounded-full px-8">
                                                    <Link to={`/blog/${featuredPosts[0].slug}`}>
                                                        Ler Artigo Completo
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Categories / Recents */}
                    <div className="space-y-12">
                        <div className="flex justify-between items-end border-b pb-4">
                            <h3 className="text-2xl font-bold">Últimos Artigos</h3>
                            {/* Can add category pills here later */}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <Skeleton key={i} className="h-[380px] w-full rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recentPosts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}

                        {!loading && recentPosts.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground border rounded-xl bg-muted/20">
                                <p>Nenhum artigo encontrado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <FloatingCTA />
            <Footer />
        </div>
    );
}
