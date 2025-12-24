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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Plus, ArrowLeft, User, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Author {
    id: string;
    name: string;
    role: string | null;
    bio: string | null;
    email: string;
    avatar_url: string | null;
    social_links: any;
    website: string | null;
}

export default function BioManager() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [formData, setFormData] = useState<Partial<Author>>({
        name: "",
        email: "",
        role: "",
        bio: "",
        avatar_url: "",
        website: "",
        social_links: {}
    });

    const fetchAuthors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("authors")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching authors:", error);
            toast.error("Erro ao carregar autores.");
        } else {
            setAuthors(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este autor?")) return;

        const { error } = await supabase.from("authors").delete().eq("id", id);
        if (error) {
            toast.error("Erro ao excluir autor.");
        } else {
            toast.success("Autor excluído com sucesso.");
            fetchAuthors();
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Nome e Email são obrigatórios.");
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            role: formData.role || null,
            bio: formData.bio || null,
            avatar_url: formData.avatar_url || null,
            website: formData.website || null,
            social_links: formData.social_links || {}
        };

        let error;

        if (editingAuthor) {
            const { error: updateError } = await supabase
                .from("authors")
                .update(payload)
                .eq("id", editingAuthor.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("authors")
                .insert([payload]);
            error = insertError;
        }

        if (error) {
            console.error("Error saving author:", error);
            toast.error("Erro ao salvar autor.");
        } else {
            toast.success("Autor salvo com sucesso.");
            setIsDialogOpen(false);
            setEditingAuthor(null);
            resetForm();
            fetchAuthors();
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            role: "",
            bio: "",
            avatar_url: "",
            website: "",
            social_links: {}
        });
    };

    const openEdit = (author: Author) => {
        setEditingAuthor(author);
        setFormData({
            name: author.name,
            email: author.email,
            role: author.role || "",
            bio: author.bio || "",
            avatar_url: author.avatar_url || "",
            website: author.website || "",
            social_links: author.social_links || {}
        });
        setIsDialogOpen(true);
    };

    const openNew = () => {
        setEditingAuthor(null);
        resetForm();
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>Gerenciar Bios | Crie Valor</title>
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
                            <h1 className="text-3xl font-bold">Gerenciar Bios</h1>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={openNew}>
                                        <Plus className="w-4 h-4 mr-2" /> Novo Autor
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{editingAuthor ? "Editar Autor" : "Novo Autor"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nome *</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Cargo / Função</Label>
                                            <Input
                                                id="role"
                                                value={formData.role ?? ""}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Biografia</Label>
                                            <Textarea
                                                id="bio"
                                                value={formData.bio ?? ""}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar_url">URL do Avatar</Label>
                                            <Input
                                                id="avatar_url"
                                                value={formData.avatar_url ?? ""}
                                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                value={formData.website ?? ""}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleSave}>
                                            <Save className="w-4 h-4 mr-2" /> Salvar
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Autores ({authors.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">Carregando...</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Autor</TableHead>
                                                <TableHead>Cargo</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {authors.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        Nenhum autor encontrado.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {authors.map((author) => (
                                                <TableRow key={author.id}>
                                                    <TableCell className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={author.avatar_url || ""} />
                                                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium">{author.name}</div>
                                                    </TableCell>
                                                    <TableCell>{author.role || "-"}</TableCell>
                                                    <TableCell>{author.email}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(author)} title="Editar">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(author.id)} title="Excluir">
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
