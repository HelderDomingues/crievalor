
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Plus, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { 
  fetchAllTestimonials, 
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  Testimonial 
} from "@/services/testimonialsService";

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    text: '',
    active: true
  });
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error);
      toast.error("Erro ao carregar depoimentos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTestimonialChange = (field: keyof Testimonial, value: string | boolean) => {
    setNewTestimonial({ ...newTestimonial, [field]: value });
  };

  const handleEditFormChange = (field: keyof Testimonial, value: string | boolean) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleAddTestimonial = async () => {
    try {
      if (!newTestimonial.name || !newTestimonial.role || !newTestimonial.company || !newTestimonial.text) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsLoading(true);
      const result = await createTestimonial(newTestimonial as Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>);
      
      if (result) {
        setTestimonials([result, ...testimonials]);
        setNewTestimonial({
          name: '',
          role: '',
          company: '',
          text: '',
          active: true
        });
        toast.success("Depoimento criado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao adicionar depoimento:", error);
      toast.error("Erro ao adicionar depoimento");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setEditForm({ ...testimonial });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = async () => {
    try {
      if (!editingId || !editForm.name || !editForm.role || !editForm.company || !editForm.text) {
        toast.error("Dados de edição inválidos");
        return;
      }

      setIsLoading(true);
      const result = await updateTestimonial(editingId, editForm);
      
      if (result) {
        setTestimonials(testimonials.map(item => 
          item.id === editingId ? result : item
        ));
        setEditingId(null);
        setEditForm({});
        toast.success("Depoimento atualizado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao atualizar depoimento:", error);
      toast.error("Erro ao atualizar depoimento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      setIsLoading(true);
      const result = await updateTestimonial(id, { active: !currentActive });
      
      if (result) {
        setTestimonials(testimonials.map(item => 
          item.id === id ? result : item
        ));
        toast.success(`Depoimento ${!currentActive ? 'ativado' : 'desativado'} com sucesso`);
      }
    } catch (error) {
      console.error("Erro ao atualizar status do depoimento:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await deleteTestimonial(id);
      
      if (success) {
        setTestimonials(testimonials.filter(item => item.id !== id));
        toast.success("Depoimento excluído com sucesso");
      }
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      toast.error("Erro ao excluir depoimento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Depoimentos de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && testimonials.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando depoimentos...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Formulário para adicionar novo depoimento */}
            <Card className="border-dashed border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Novo Depoimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nome</label>
                      <Input
                        value={newTestimonial.name}
                        onChange={(e) => handleNewTestimonialChange('name', e.target.value)}
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Cargo</label>
                      <Input
                        value={newTestimonial.role}
                        onChange={(e) => handleNewTestimonialChange('role', e.target.value)}
                        placeholder="Cargo"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Empresa</label>
                      <Input
                        value={newTestimonial.company}
                        onChange={(e) => handleNewTestimonialChange('company', e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Depoimento</label>
                    <Textarea
                      value={newTestimonial.text}
                      onChange={(e) => handleNewTestimonialChange('text', e.target.value)}
                      placeholder="Texto do depoimento"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newTestimonial.active === true}
                      onCheckedChange={(checked) => handleNewTestimonialChange('active', checked)}
                    />
                    <label>Ativo</label>
                  </div>
                  
                  <Button
                    onClick={handleAddTestimonial}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Depoimento
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Lista de depoimentos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Depoimentos Existentes</h3>
              
              {testimonials.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum depoimento adicionado ainda
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className={`border ${testimonial.active ? 'border-green-200' : 'border-gray-200'}`}>
                    <CardContent className="pt-6">
                      {editingId === testimonial.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Nome</label>
                              <Input
                                value={editForm.name || ''}
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Cargo</label>
                              <Input
                                value={editForm.role || ''}
                                onChange={(e) => handleEditFormChange('role', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Empresa</label>
                              <Input
                                value={editForm.company || ''}
                                onChange={(e) => handleEditFormChange('company', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Depoimento</label>
                            <Textarea
                              value={editForm.text || ''}
                              onChange={(e) => handleEditFormChange('text', e.target.value)}
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={cancelEditing}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                            <Button 
                              onClick={saveEditing}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Salvar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {testimonial.role}, {testimonial.company}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-2 mr-4">
                                <Switch
                                  checked={testimonial.active}
                                  onCheckedChange={() => handleToggleActive(testimonial.id, testimonial.active)}
                                  disabled={isLoading}
                                />
                                <span className="text-sm">
                                  {testimonial.active ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditing(testimonial)}
                                disabled={isLoading}
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          
                          <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground">
                            "{testimonial.text}"
                          </blockquote>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialsAdmin;
