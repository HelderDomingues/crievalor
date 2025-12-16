import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/ui/floating-cta";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { blogService, BlogCategory } from "@/services/blogService";
import { Post, PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";

export default function BlogHome() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categorySlug = searchParams.get("category");

    const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);

    useScrollToTop();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Always fetch categories and featured posts (only for home)
                const [cats, featured] = await Promise.all([
                    blogService.getCategories(),
                    !categorySlug ? blogService.getFeaturedPosts() : Promise.resolve([])
                ]);

                setCategories(cats);
                setFeaturedPosts(featured as Post[]);

                // Fetch Posts based on Filter
                if (categorySlug) {
                    const { posts, categoryName } = await blogService.getPostsByCategory(categorySlug);
                    setRecentPosts(posts);
                    setActiveCategoryName(categoryName);
                    console.log("Categorized Posts:", posts.map(p => ({ title: p.title, slug: p.slug })));
                } else {
                    const { posts } = await blogService.getPosts(10);
                    // Filter featured duplicates only if on home view
                    const featuredIds = new Set((featured as Post[]).map(p => p.id));
                    setRecentPosts(posts.filter(p => !featuredIds.has(p.id)));
                    setActiveCategoryName(null);
                    console.log("Featured:", (featured as Post[]).map(p => ({ title: p.title, slug: p.slug })));
                    console.log("Recent:", posts.map(p => ({ title: p.title, slug: p.slug })));
                }

            } catch (error) {
                console.error("Failed to load blog data", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [categorySlug]);

    const handleCategoryClick = (slug: string | null) => {
        setLoading(true); // Show local loading state
        if (slug) {
            setSearchParams({ category: slug });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-20">
                <Helmet>
                    <title>
                        {activeCategoryName ? `${activeCategoryName} | Blog Crie Valor` : "Blog Crie Valor | Insights sobre Negócios e Gestão"}
                    </title>
                    <meta name="description" content="Artigos, dicas e insights sobre gestão empresarial, liderança, marketing e vendas para impulsionar o seu negócio. Profissionalize sua empresa com a Crie Valor." />
                    <link rel="canonical" href={`https://crievalor.com.br/blog${categorySlug ? `?category=${categorySlug}` : ""}`} />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`https://crievalor.com.br/blog${categorySlug ? `?category=${categorySlug}` : ""}`} />
                    <meta property="og:title" content={activeCategoryName ? `${activeCategoryName} | Blog Crie Valor` : "Blog Crie Valor | Insights sobre Negócios e Gestão"} />
                    <meta property="og:description" content="Artigos, dicas e insights sobre gestão empresarial, liderança, marketing e vendas. Descubra como profissionalizar sua empresa." />
                    <meta property="og:image" content="https://crievalor.com.br/og-image.jpg" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content={`https://crievalor.com.br/blog${categorySlug ? `?category=${categorySlug}` : ""}`} />
                    <meta name="twitter:title" content={activeCategoryName ? `${activeCategoryName} | Blog Crie Valor` : "Blog Crie Valor | Insights sobre Negócios e Gestão"} />
                    <meta name="twitter:description" content="Artigos, dicas e insights sobre gestão empresarial, liderança, marketing e vendas." />
                    <meta name="twitter:image" content="https://crievalor.com.br/og-image.jpg" />

                    {/* Schema.org JSON-LD */}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            "name": "Blog Crie Valor",
                            "url": "https://crievalor.com.br/blog",
                            "description": "Insights sobre gestão empresarial, liderança, marketing e vendas.",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Crie Valor",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://crievalor.com.br/lovable-uploads/92af6ddc-b869-4957-8dde-af26a0a8e7d2.png"
                                }
                            }
                        })}
                    </script>
                </Helmet>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-12 space-y-4 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                            {activeCategoryName ? activeCategoryName : "Blog Crie Valor"}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            {activeCategoryName
                                ? `Artigos selecionados sobre ${activeCategoryName}.`
                                : "Conteúdo estratégico para quem quer construir empresas de valor."}
                        </p>
                    </div>

                    {/* Featured Section (Only show on Home) */}
                    {!categorySlug && featuredPosts.length > 0 && (
                        <section className="mb-16">
                            {/* ... Featured Post Code (Simplified for brevity or same as before) ... */}
                            {/* Re-using exact same featured block structure for visual consistency */}
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

                    {/* Category Filter Pills */}
                    <div className="mb-12 flex flex-wrap justify-center gap-2">
                        <Button
                            variant={!categorySlug ? "default" : "outline"}
                            onClick={() => handleCategoryClick(null)}
                            className="rounded-full"
                        >
                            Todos
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={categorySlug === cat.slug ? "default" : "outline"}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className="rounded-full"
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>

                    {/* Categories / Recents */}
                    <div className="space-y-12">
                        <div className="flex justify-between items-end border-b pb-4">
                            <h3 className="text-2xl font-bold">
                                {categorySlug ? "Artigos" : "Últimos Artigos"}
                            </h3>
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
                                <p>Nenhum artigo encontrado nesta categoria.</p>
                                <Button variant="link" onClick={() => handleCategoryClick(null)}>
                                    Ver todos os artigos
                                </Button>
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
