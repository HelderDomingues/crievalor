
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  fetchClientLogos, 
  uploadClientLogo, 
  deleteClientLogo, 
  ClientLogo 
} from "@/services/clientLogosService";

const ClientLogosAdmin = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      setIsLoading(true);
      const fetchedLogos = await fetchClientLogos();
      
      if (fetchedLogos && fetchedLogos.length > 0) {
        setLogos(fetchedLogos);
      }
    } catch (error) {
      console.error("Erro ao buscar logos:", error);
      toast.error("Erro ao carregar logos dos clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (index: number, field: 'name' | 'logo', value: string) => {
    const updatedLogos = [...logos];
    updatedLogos[index] = { ...updatedLogos[index], [field]: value };
    setLogos(updatedLogos);
  };

  const handleAddLogo = () => {
    setLogos([...logos, { name: `Cliente ${logos.length + 1}`, logo: "/placeholder.svg" }]);
  };

  const handleRemoveLogo = async (index: number) => {
    try {
      setIsLoading(true);
      const logoToRemove = logos[index];
      
      // Extract the filename from the URL
      const fileName = logoToRemove.logo.split('/').pop();
      
      if (fileName && logoToRemove.logo.includes('clientlogos')) {
        // Delete file from Supabase storage
        const result = await deleteClientLogo(fileName);
        
        if (result.error) {
          throw result.error;
        }
        
        toast.success("Logo removido com sucesso");
      }
      
      // Update local state
      const updatedLogos = [...logos];
      updatedLogos.splice(index, 1);
      setLogos(updatedLogos);
    } catch (error) {
      console.error("Erro ao remover logo:", error);
      toast.error("Erro ao remover logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    toast.success("Alterações salvas com sucesso");
    await fetchLogos(); // Recarregar logos após salvar
  };

  const handleUploadImage = async (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      
      try {
        setUploading({...uploading, [index]: true});
        
        // Verificar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          toast.error("Por favor, selecione uma imagem válida");
          return;
        }
        
        // Verificar tamanho (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error("A imagem é muito grande. Tamanho máximo: 2MB");
          return;
        }
        
        // Sanitize the name for use as filename
        const logoName = logos[index].name.trim() || `cliente-${index + 1}`;
        
        // Upload file
        const { url, error } = await uploadClientLogo(file, logoName);
        
        if (error) {
          console.error("Erro no upload:", error);
          toast.error(`Erro ao fazer upload: ${error.message}`);
          return;
        }
        
        if (url) {
          // Update logo URL in state with timestamp to prevent caching
          handleLogoChange(index, 'logo', `${url}?t=${new Date().getTime()}`);
          toast.success("Logo carregado com sucesso");
        }
      } catch (error) {
        console.error("Erro no upload da imagem:", error);
        toast.error("Erro ao fazer upload do logo");
      } finally {
        const newUploading = {...uploading};
        delete newUploading[index];
        setUploading(newUploading);
      }
    };
    
    input.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Logos dos Clientes</span>
          <div>
            {isEditing ? (
              <div className="space-x-2">
                <Button 
                  onClick={handleSave} 
                  variant="default"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? "Carregando..." : "Editar"}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !isEditing ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando logos dos clientes...</span>
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center gap-4 p-2 border rounded-md">
                <div className="w-16 h-16 flex items-center justify-center bg-secondary/20 rounded">
                  <img
                    src={logo.logo}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-grow space-y-2">
                  <Input
                    value={logo.name}
                    onChange={(e) => handleLogoChange(index, 'name', e.target.value)}
                    placeholder="Nome do cliente"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => handleUploadImage(index)}
                    title="Fazer upload de imagem"
                    disabled={uploading[index]}
                    className="w-full"
                  >
                    {uploading[index] ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" /> 
                        Fazer upload de logo
                      </>
                    )}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLogo(index)}
                  className="text-destructive"
                  disabled={uploading[index]}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              onClick={handleAddLogo} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Logo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {logos.length > 0 ? (
              logos.map((logo, index) => (
                <div key={index} className="flex flex-col items-center p-2 border rounded-md">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <span className="text-sm text-center mt-2">{logo.name}</span>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Nenhum logo de cliente adicionado ainda
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientLogosAdmin;
