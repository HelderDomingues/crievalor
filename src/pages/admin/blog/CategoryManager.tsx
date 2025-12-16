import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, Trash2, Save, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CategoryManager() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("categories" as any)
            .select("*")
            .order("name");

        if (error) {
            toast.error("Erro ao carregar categorias.");
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setName("");
        setSlug("");
        setEditingId(null);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        if (!editingId) {
            setSlug(newName.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
            );
        }
    };

    const handleEdit = (category: any) => {
        setEditingId(category.id);
        setName(category.name);
        setSlug(category.slug);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza? Isso pode afetar posts que usam esta categoria.")) return;

        // Check if used
        const { count } = await supabase.from("post_categories" as any).select("*", { count: "exact", head: true }).eq("category_id", id);
        if (count && count > 0) {
            if (!confirm(`Esta categoria é usada em ${count} posts. Deseja realmente excluir?`)) return;
        }

        const { error } = await supabase.from("categories" as any).delete().eq("id", id);
        if (error) {
            toast.error("Erro ao excluir.");
        } else {
            toast.success("Categoria excluída.");
            fetchCategories();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !slug) return;

        try {
            if (editingId) {
                const { error } = await supabase
                    .from("categories" as any)
                    .update({ name, slug })
                    .eq("id", editingId);
                if (error) throw error;
                toast.success("Categoria atualizada.");
            } else {
                const { error } = await supabase
                    .from("categories" as any)
                    .insert([{ name, slug }]);
                if (error) throw error;
                toast.success("Categoria criada.");
            }
            resetForm();
            fetchCategories();
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao salvar: " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>Gerenciar Categorias | Admin</title>
            </Helmet>
            <Header />
            <main className="flex-grow py-16 bg-muted/10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <AdminAuth onAuthenticated={() => { }} redirectPath="/admin-setup">
                        <div className="flex items-center gap-4 mb-8">
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/admin-blog">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold">Categorias do Blog</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Form */}
                            <Card className="md:col-span-1 h-fit">
                                <CardHeader>
                                    <CardTitle>{editingId ? "Editar Categoria" : "Nova Categoria"}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nome</Label>
                                            <Input id="name" value={name} onChange={handleNameChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="slug">Slug</Label>
                                            <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} required />
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button type="submit" className="w-full">
                                                <Save className="w-4 h-4 mr-2" />
                                                {editingId ? "Atualizar" : "Criar"}
                                            </Button>
                                            {editingId && (
                                                <Button type="button" variant="outline" size="icon" onClick={resetForm}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* List */}
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Lista de Categorias</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                                        Nenhuma categoria.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {categories.map(cat => (
                                                <TableRow key={cat.id}>
                                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </AdminAuth>
                </div>
            </main>
            <Footer />
        </div>
    );
}
