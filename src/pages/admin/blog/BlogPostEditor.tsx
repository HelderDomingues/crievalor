import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
];

export default function BlogPostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== "new";

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [published, setPublished] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [authorId, setAuthorId] = useState<string | null>(null);

    // Data State
    const [categories, setCategories] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        fetchInitialData();
        if (isEditing) {
            fetchPost(id);
        } else {
            // Set current user as author by default
            supabase.auth.getUser().then(({ data }) => {
                if (data.user) setAuthorId(data.user.id);
            });
        }
    }, [id]);

    const fetchInitialData = async () => {
        const [cats, profs] = await Promise.all([
            supabase.from("categories" as any).select("*").order("name"),
            supabase.from("profiles" as any).select("id, full_name, email"),
        ]);

        if (cats.data) setCategories(cats.data);
        if (profs.data) setProfiles(profs.data);
    };

    const fetchPost = async (postId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from("posts" as any)
            .select(`
        *,
        post_categories(category_id)
      `)
            .eq("id", postId)
            .single();

        if (error) {
            toast.error("Erro ao carregar post.");
            navigate("/admin-blog");
            return;
        }

        // Populate Fields
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCoverUrl(data.cover_image_url || "");
        setPublished(data.published);
        setAuthorId(data.author_id);
        setSelectedCategories(data.post_categories?.map((pc: any) => pc.category_id) || []);

        setLoading(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!isEditing) {
            // Auto-generate slug from title if new
            setSlug(newTitle.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9\s-]/g, "") // remove special chars
                .replace(/\s+/g, "-") // replace spaces with dashes
            );
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("blog_images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("blog_images").getPublicUrl(filePath);
            setCoverUrl(data.publicUrl);
            toast.success("Imagem carregada com sucesso!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Erro no upload da imagem: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const toggleCategory = (catId: string) => {
        setSelectedCategories(prev =>
            prev.includes(catId)
                ? prev.filter(id => id !== catId)
                : [...prev, catId]
        );
    };

    const handleSave = async () => {
        if (!title || !slug || !content) {
            toast.error("Título, Slug e Conteúdo são obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            const postData = {
                title,
                slug,
                excerpt,
                content,
                cover_image_url: coverUrl,
                published,
                author_id: authorId,
                updated_at: new Date().toISOString(),
            };

            let savedPostId = id;

            if (isEditing) {
                const { error } = await supabase
                    .from("posts" as any)
                    .update(postData as any)
                    .eq("id", id);
                if (error) throw error;
                toast.success("Post atualizado!");
            } else {
                const { data, error } = await supabase
                    .from("posts" as any)
                    .insert([{ ...postData, published_at: new Date().toISOString() }] as any)
                    .select()
                    .single();
                if (error) throw error;
                savedPostId = data.id;
                toast.success("Post criado!");
            }

            // Update Categories
            // First delete existing
            if (isEditing) {
                await supabase.from("post_categories" as any).delete().eq("post_id", savedPostId);
            }

            // Insert new
            if (selectedCategories.length > 0) {
                const categoryInserts = selectedCategories.map(catId => ({
                    post_id: savedPostId,
                    category_id: catId
                }));
                const { error: catError } = await supabase.from("post_categories" as any).insert(categoryInserts);
                if (catError) throw catError;
            }

            navigate("/admin-blog");

        } catch (error: any) {
            console.error("Save error:", error);
            toast.error("Erro ao salvar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>{isEditing ? "Editar Artigo" : "Novo Artigo"} | Admin</title>
            </Helmet>
            <Header />
            <main className="flex-grow py-16 bg-muted/10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <AdminAuth onAuthenticated={() => { }} redirectPath="/admin-setup">
                        <div className="flex items-center gap-4 mb-8">
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/admin-blog">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold">{isEditing ? "Editar Artigo" : "Novo Artigo"}</h1>
                            <div className="ml-auto flex gap-2">
                                <Button variant="outline" onClick={() => navigate("/admin-blog")}>Cancelar</Button>
                                <Button onClick={handleSave} disabled={loading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Conteúdo</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Título</Label>
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={handleTitleChange}
                                                placeholder="Digite o título do artigo"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="slug">Slug (URL)</Label>
                                            <Input
                                                id="slug"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                placeholder="titulo-do-artigo"
                                            />
                                            <p className="text-xs text-muted-foreground">URL amigável do post.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Editor</Label>
                                            <div className="prose-editor">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={content}
                                                    onChange={setContent}
                                                    modules={modules}
                                                    formats={formats}
                                                    className="h-[400px] mb-12 bg-background"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Resumo</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            placeholder="Um breve resumo do artigo para aparecer nos cards..."
                                            className="h-24"
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Publicação</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="published">Status</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">{published ? "Publicado" : "Rascunho"}</span>
                                                <Switch
                                                    id="published"
                                                    checked={published}
                                                    onCheckedChange={setPublished}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="author">Autor</Label>
                                            <select
                                                id="author"
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={authorId || ""}
                                                onChange={(e) => setAuthorId(e.target.value)}
                                            >
                                                <option value="">Selecione um autor</option>
                                                {profiles.map(profile => (
                                                    <option key={profile.id} value={profile.id}>
                                                        {profile.full_name || profile.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Imagem de Capa</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {coverUrl ? (
                                            <div className="relative aspect-video rounded-md overflow-hidden border">
                                                <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6"
                                                    onClick={() => setCoverUrl("")}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                                                <Upload className="h-8 w-8 mb-2" />
                                                <span className="text-xs">Upload de Imagem</span>
                                            </div>
                                        )}

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="cover_image">Arquivo</Label>
                                            <Input id="cover_image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Categorias</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <Badge
                                                    key={cat.id}
                                                    variant={selectedCategories.includes(cat.id) ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() => toggleCategory(cat.id)}
                                                >
                                                    {cat.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        {categories.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma categoria encontrada.</p>}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </AdminAuth>
                </div>
            </main>
            <Footer />
        </div>
    );
}
