import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminAuth from "@/components/admin/AdminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Lecture {
  id: string;
  title: string;
  description: string;
  speaker: string;
  is_active: boolean;
  created_at: string;
}

const LecturesAdmin = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    is_active: true,
  });

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLectures(data || []);
    } catch (error) {
      console.error("Erro ao carregar palestras:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as palestras.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLecture) {
        const { error } = await supabase
          .from("lectures")
          .update(formData)
          .eq("id", editingLecture.id);

        if (error) throw error;
        toast({ title: "Palestra atualizada com sucesso!" });
      } else {
        const { error } = await supabase.from("lectures").insert(formData);

        if (error) throw error;
        toast({ title: "Palestra criada com sucesso!" });
      }

      setFormData({ title: "", description: "", speaker: "", is_active: true });
      setEditingLecture(null);
      setIsCreating(false);
      fetchLectures();
    } catch (error) {
      console.error("Erro ao salvar palestra:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a palestra.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description || "",
      speaker: lecture.speaker || "",
      is_active: lecture.is_active,
    });
    setIsCreating(true);
  };

  const handleDelete = async (lectureId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta palestra?")) return;

    try {
      const { error } = await supabase
        .from("lectures")
        .delete()
        .eq("id", lectureId);

      if (error) throw error;
      toast({ title: "Palestra excluída com sucesso!" });
      fetchLectures();
    } catch (error) {
      console.error("Erro ao excluir palestra:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a palestra.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", speaker: "", is_active: true });
    setEditingLecture(null);
    setIsCreating(false);
  };

  return (
    <AdminAuth onAuthenticated={() => {}}>
      <div className="min-h-screen bg-background">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Gerenciar Palestras</h1>
                <p className="text-muted-foreground">
                  Administre as palestras disponíveis no sistema
                </p>
              </div>
              
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Palestra
              </Button>
            </div>

            {isCreating && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    {editingLecture ? "Editar Palestra" : "Nova Palestra"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Título da palestra"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="speaker">Palestrante</Label>
                        <Input
                          id="speaker"
                          value={formData.speaker}
                          onChange={(e) =>
                            setFormData({ ...formData, speaker: e.target.value })
                          }
                          placeholder="Nome do palestrante"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Descrição da palestra"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                      <Label htmlFor="is_active">Palestra ativa</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingLecture ? "Atualizar" : "Criar"} Palestra
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Carregando palestras...</div>
              ) : lectures.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma palestra encontrada.</p>
                </div>
              ) : (
                lectures.map((lecture) => (
                  <Card key={lecture.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{lecture.title}</h3>
                            <Badge variant={lecture.is_active ? "default" : "secondary"}>
                              {lecture.is_active ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          
                          {lecture.speaker && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Palestrante:</strong> {lecture.speaker}
                            </p>
                          )}
                          
                          {lecture.description && (
                            <p className="text-muted-foreground mb-3">
                              {lecture.description}
                            </p>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            Criada em: {new Date(lecture.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lecture)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lecture.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AdminAuth>
  );
};

export default LecturesAdmin;