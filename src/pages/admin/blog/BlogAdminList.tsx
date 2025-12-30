import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Eye, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Post } from "@/components/blog/PostCard";

export default function BlogAdminList() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("posts" as any)
            .select(`
        id, title, slug, published, published_at,
        author:profiles(full_name),
        post_categories(categories(name))
      `)
            .order("published_at", { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
            toast.error("Erro ao carregar posts.");
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.")) return;

        const { error } = await supabase.from("posts" as any).delete().eq("id", id);
        if (error) {
            toast.error("Erro ao excluir post.");
        } else {
            toast.success("Post excluído com sucesso.");
            fetchPosts();
        }
    };

    const togglePublished = async (post: any) => {
        const newStatus = !post.published;
        const { error } = await supabase
            .from("posts" as any)
            .update({ published: newStatus } as any)
            .eq("id", post.id);

        if (error) {
            toast.error("Erro ao atualizar status.");
        } else {
            toast.success(newStatus ? "Post publicado!" : "Post despublicado.");
            fetchPosts();
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>Administrar Blog | Crie Valor</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Header />
            <main className="flex-grow py-16">
                <div className="container mx-auto px-4">
                    <AdminAuth onAuthenticated={() => { }} redirectPath="/admin-setup">
                        <div className="mb-4">
                            <Button variant="ghost" asChild size="sm">
                                <Link to="/admin-setup" className="flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
                                </Link>
                            </Button>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link to="/admin-blog/categories">Categorias</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/admin-blog/posts/new">
                                        <Plus className="w-4 h-4 mr-2" /> Novo Artigo
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Artigos ({posts.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">Carregando...</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Título</TableHead>
                                                <TableHead>Autor</TableHead>
                                                <TableHead>Categorias</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {posts.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        Nenhum artigo encontrado.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {posts.map((post) => (
                                                <TableRow key={post.id}>
                                                    <TableCell className="font-medium max-w-[300px] truncate" title={post.title}>
                                                        {post.title}
                                                        <div className="text-xs text-muted-foreground truncate">{post.slug}</div>
                                                    </TableCell>
                                                    <TableCell>{post.author?.full_name || "Desconhecido"}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {post.post_categories?.map((pc: any, i: number) => (
                                                                <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">{pc.categories.name}</Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => togglePublished(post)}
                                                            className={post.published ? "text-green-600 hover:text-green-700" : "text-yellow-600 hover:text-yellow-700"}
                                                        >
                                                            {post.published ? (
                                                                <><CheckCircle className="w-4 h-4 mr-1" /> Publicado</>
                                                            ) : (
                                                                <><XCircle className="w-4 h-4 mr-1" /> Rascunho</>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" asChild title="Ver no site">
                                                                <Link to={`/blog/${post.slug}`} target="_blank">
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" asChild title="Editar">
                                                                <Link to={`/admin-blog/posts/${post.id}`}>
                                                                    <Edit className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} title="Excluir">
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </AdminAuth>
                </div>
            </main>
            <Footer />
        </div>
    );
}
