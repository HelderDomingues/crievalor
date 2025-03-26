
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2, ImagePlus, Image } from "lucide-react";
import { PortfolioProject } from "@/types/portfolio";
import { getPortfolioProjects, addProject, updateProject, deleteProject } from "@/services/portfolioService";
import { toast } from "@/components/ui/use-toast";

const PortfolioAdmin = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
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

  // Carregar projetos
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
  };

  const handleOpenDialog = (project?: PortfolioProject) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        ...project,
        tags: project.tags || [],
        gallery: project.gallery || []
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const galleryString = e.target.value;
    const galleryArray = galleryString.split('\n').map(url => url.trim()).filter(url => url);
    setFormData(prev => ({ ...prev, gallery: galleryArray }));
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.coverImage) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e imagem de capa são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      if (selectedProject) {
        // Atualizar projeto existente
        const updatedProject = await updateProject({
          ...selectedProject,
          ...formData
        } as PortfolioProject);
        
        setProjects(prevProjects => 
          prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
        );
        
        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso."
        });
      } else {
        // Adicionar novo projeto
        const newProject = await addProject(formData as Omit<PortfolioProject, 'id'>);
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
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    try {
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

      {/* Diálogo para adicionar/editar projeto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? 'Editar Projeto' : 'Novo Projeto'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  placeholder="Ex: Identidade Visual, UI/UX"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Descrição do projeto"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">URL da Imagem de Capa *</Label>
              <div className="flex space-x-2">
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage || ''}
                  onChange={handleChange}
                  placeholder="URL da imagem de capa"
                  className="flex-1"
                />
                {formData.coverImage && (
                  <div className="w-12 h-12 rounded overflow-hidden border border-border">
                    <img 
                      src={formData.coverImage} 
                      alt="Capa" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Erro";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gallery">Galeria de Imagens (uma URL por linha)</Label>
              <Textarea
                id="gallery"
                name="gallery"
                rows={4}
                value={(formData.gallery || []).join('\n')}
                onChange={handleGalleryChange}
                placeholder="URL das imagens da galeria (uma por linha)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectUrl">URL do Projeto</Label>
              <Input
                id="projectUrl"
                name="projectUrl"
                value={formData.projectUrl || ''}
                onChange={handleChange}
                placeholder="URL do projeto (se houver)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                name="tags"
                value={(formData.tags || []).join(', ')}
                onChange={handleTagsChange}
                placeholder="Ex: logo, identidade, web"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioAdmin;
