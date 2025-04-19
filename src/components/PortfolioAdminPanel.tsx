
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2, ImagePlus, Paperclip, X, Link as LinkIcon, Calendar } from "lucide-react";
import { PortfolioProject } from "@/types/portfolio";
import { getPortfolioProjects, addProject, updateProject, deleteProject } from "@/services/portfolioService";
import { uploadPortfolioImage, deletePortfolioImage } from "@/services/storageService";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const PortfolioAdmin = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [selectedTab, setSelectedTab] = useState("basic");
  const [formData, setFormData] = useState<Partial<PortfolioProject>>({
    title: "",
    category: "",
    description: "",
    coverImage: "",
    gallery: [],
    date: new Date().toISOString().split('T')[0],
    projectUrl: "",
    client: "",
    tags: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [newTag, setNewTag] = useState("");

  // Opções de categoria
  const categoryOptions = [
    "Identidade Visual",
    "Branding",
    "UI/UX",
    "UI/UX & Branding",
    "Web Design",
    "Design Gráfico",
    "Marketing Digital",
    "Design"
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getPortfolioProjects();
        setProjects(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: "Não foi possível carregar os projetos do portfólio.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject?.tags) {
      setTagsInput(selectedProject.tags.join(', '));
    } else {
      setTagsInput("");
    }
  }, [selectedProject]);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      coverImage: "",
      gallery: [],
      date: new Date().toISOString().split('T')[0],
      projectUrl: "",
      client: "",
      tags: []
    });
    setTagsInput("");
    setNewTag("");
    setSelectedTab("basic");
  };

  const handleOpenDialog = (project?: PortfolioProject) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        ...project,
        tags: project.tags || [],
        gallery: project.gallery || []
      });
      setTagsInput(project.tags?.join(', ') || "");
    } else {
      setSelectedProject(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
    resetForm();
  };

  const handleOpenDeleteDialog = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (newTag.trim() !== "") {
      const updatedTags = [...(formData.tags || []), newTag.trim()];
      setFormData(prev => ({ ...prev, tags: updatedTags }));
      setTagsInput(updatedTags.join(', '));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = (formData.tags || []).filter(tag => tag !== tagToRemove);
    setFormData(prev => ({ ...prev, tags: updatedTags }));
    setTagsInput(updatedTags.join(', '));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir adicionar tag ao pressionar vírgula ou Enter
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTag(value);
  };

  const parseTagsInput = () => {
    if (!tagsInput) return [];
    
    // Divide a string por vírgulas e remove espaços extras
    return tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadPortfolioImage(file);
      setFormData(prev => ({ ...prev, coverImage: publicUrl }));
      toast({
        title: "Imagem carregada com sucesso",
        description: "A imagem foi salva e vinculada ao projeto."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive"
      });
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const uploadPromises = Array.from(files).map(file => uploadPortfolioImage(file));
      const urls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...urls]
      }));

      toast({
        title: "Imagens carregadas com sucesso",
        description: `${files.length} imagens foram adicionadas à galeria.`
      });
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast({
        title: "Erro ao carregar imagens",
        description: "Não foi possível fazer upload de algumas imagens.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveGalleryImage = async (imageUrl: string) => {
    try {
      // Apenas remover da galeria sem excluir do storage (será excluída ao salvar se não for mais usada)
      setFormData(prev => ({
        ...prev,
        gallery: prev.gallery?.filter(img => img !== imageUrl)
      }));
    } catch (error) {
      console.error('Error removing gallery image:', error);
      toast({
        title: "Erro ao remover imagem",
        description: "Não foi possível remover a imagem da galeria.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!formData.title || !formData.coverImage) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e imagem de capa são obrigatórios.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      // Processar e atualizar as tags
      const parsedTags = parseTagsInput();
      const projectWithTags = {
        ...formData,
        tags: parsedTags
      };

      if (selectedProject) {
        if (selectedProject.coverImage !== formData.coverImage) {
          try {
            await deletePortfolioImage(selectedProject.coverImage);
          } catch (error) {
            console.error('Error deleting old cover image:', error);
          }
        }
        
        const oldGallery = selectedProject.gallery || [];
        const newGallery = formData.gallery || [];
        const removedImages = oldGallery.filter(img => !newGallery.includes(img));
        
        await Promise.all(removedImages.map(img => deletePortfolioImage(img)));

        const updatedProject = await updateProject({
          ...selectedProject,
          ...projectWithTags
        } as PortfolioProject);
        
        setProjects(prevProjects => 
          prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
        );
        
        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso."
        });
      } else {
        const newProject = await addProject(projectWithTags as Omit<PortfolioProject, 'id'>);
        setProjects(prevProjects => [...prevProjects, newProject]);
        
        toast({
          title: "Projeto adicionado",
          description: "O novo projeto foi adicionado com sucesso."
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o projeto.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    try {
      setIsDeleting(true);
      
      await deletePortfolioImage(selectedProject.coverImage);
      
      if (selectedProject.gallery?.length) {
        await Promise.all(selectedProject.gallery.map(img => deletePortfolioImage(img)));
      }
      
      await deleteProject(selectedProject.id);
      setProjects(prevProjects => prevProjects.filter(p => p.id !== selectedProject.id));
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o projeto.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando projetos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Portfólio</h2>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={project.coverImage} 
                alt={project.title}
                className="w-full h-full object-cover" 
              />
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleOpenDialog(project)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(project)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? 'Editar Projeto' : 'Novo Projeto'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-10rem)] pr-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="gallery">Galeria</TabsTrigger>
                <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    placeholder="Título do projeto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Descrição do projeto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Imagem de Capa *</Label>
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <div className="flex-1 w-full">
                      <Input
                        id="coverImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mb-2"
                      />
                      <Input
                        id="coverImage"
                        name="coverImage"
                        value={formData.coverImage || ''}
                        onChange={handleChange}
                        placeholder="URL da imagem de capa"
                      />
                    </div>
                    {formData.coverImage && (
                      <div className="w-24 h-24 relative rounded overflow-hidden border border-border flex-shrink-0">
                        <img 
                          src={formData.coverImage} 
                          alt="Capa" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-4">
                <div className="space-y-2">
                  <Label>Galeria de Imagens</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="galleryUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={() => document.getElementById('galleryUpload')?.click()}>
                      <Paperclip className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  
                  {formData.gallery && formData.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {formData.gallery.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded overflow-hidden border border-border">
                          <img 
                            src={img} 
                            alt={`Galeria ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveGalleryImage(img)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-md p-8 mt-4 text-center">
                      <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Nenhuma imagem adicionada à galeria
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client"
                    name="client"
                    value={formData.client || ''}
                    onChange={handleChange}
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectUrl">URL do Projeto</Label>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="projectUrl"
                      name="projectUrl"
                      value={formData.projectUrl || ''}
                      onChange={handleChange}
                      placeholder="URL do projeto (se houver)"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.tags || []).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1 group">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="newTag"
                      value={newTag}
                      onChange={handleTagsInputChange}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Adicionar nova tag"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addTag}
                    >
                      Adicionar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite uma tag e pressione Enter ou clique em Adicionar
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o projeto "{selectedProject?.title}"? 
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioAdmin;
