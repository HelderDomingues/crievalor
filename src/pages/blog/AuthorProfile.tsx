import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogService, Author } from "@/services/blogService";
import { Post, PostCard } from "@/components/blog/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft, Globe, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function AuthorProfile() {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState<Author | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadAuthor = async () => {
            setLoading(true);
            try {
                const authorData = await blogService.getAuthorById(id);
                setAuthor(authorData);

                if (authorData) {
                    const authorPosts = await blogService.getPostsByAuthor(id);
                    setPosts(authorPosts);
                }
            } catch (error) {
                console.error("Failed to load author profile", error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthor();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                    <Skeleton className="h-32 w-32 rounded-full mb-6 mx-auto" />
                    <Skeleton className="h-8 w-64 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full max-w-md mx-auto mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!author) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-3xl font-bold mb-4">Autor não encontrado</h1>
                    <p className="text-muted-foreground mb-8">Não conseguimos encontrar o perfil deste autor.</p>
                    <Button asChild>
                        <Link to="/blog">Voltar para o Blog</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>{author.name} | Autores Crie Valor</title>
                <meta name="description" content={`Conheça ${author.name}, ${author.role || "autor"} no blog da Crie Valor.`} />
            </Helmet>
            <Header />

            <main className="flex-grow pt-32 pb-20">
                {/* Author Header */}
                <div className="bg-muted/30 py-16 mb-12">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <div className="mb-8 relative inline-block">
                            {author.avatar_url ? (
                                <img
                                    src={author.avatar_url}
                                    alt={author.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-lg mx-auto">
                                    <User className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
                        {author.role && <p className="text-xl text-primary font-medium mb-6">{author.role}</p>}

                        {author.bio && (
                            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                                {author.bio}
                            </p>
                        )}

                        <div className="flex justify-center gap-4">
                            {author.website && (
                                <a href={author.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
                                    <Globe className="w-5 h-5" />
                                </a>
                            )}
                            {/* Check social links JSON loosely */}
                            {author.social_links?.linkedin && (
                                <a href={author.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {author.social_links?.instagram && (
                                <a href={author.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Author Posts */}
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-2xl font-bold">Artigos publicados por {author.name.split(' ')[0]}</h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
                            <p>Este autor ainda não publicou nenhum artigo.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
