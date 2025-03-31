
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { fetchClientLogos, ClientLogo } from "@/services/clientLogosService";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

const ClientLogosAdmin = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      console.error("Error in fetchLogos:", error);
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
      
      if (fileName) {
        // Delete file from Supabase storage
        const { error } = await supabaseExtended.storage
          .from('clientlogos')
          .remove([fileName]);
        
        if (error) {
          throw error;
        }
        
        toast.success("Logo removido com sucesso");
      }
      
      // Update local state
      const updatedLogos = [...logos];
      updatedLogos.splice(index, 1);
      setLogos(updatedLogos);
    } catch (error) {
      console.error("Error removing logo:", error);
      toast.error("Erro ao remover logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // In this refactored version, we don't need to save anything to the database
    // as we're directly managing files in the storage bucket
    setIsEditing(false);
    toast.success("Alterações salvas com sucesso");
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
        setIsLoading(true);
        
        // Create a sanitized filename
        // Use the configured name as the filename, replacing spaces with underscores
        const sanitizedName = logos[index].name.trim().replace(/\s+/g, '_').toLowerCase();
        const fileExt = file.name.split('.').pop();
        const fileName = `${sanitizedName}.${fileExt}`;
        
        // Upload the file
        const { error: uploadError } = await supabaseExtended.storage
          .from('clientlogos')
          .upload(fileName, file, { upsert: true });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabaseExtended.storage
          .from('clientlogos')
          .getPublicUrl(fileName);
        
        // Update logo URL in state
        handleLogoChange(index, 'logo', urlData.publicUrl);
        toast.success("Logo carregado com sucesso");
        
        // Refresh logos after upload
        fetchLogos();
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Erro ao fazer upload do logo");
      } finally {
        setIsLoading(false);
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
            Carregando logos dos clientes...
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
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Fazer upload de logo
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLogo(index)}
                  className="text-destructive"
                  disabled={isLoading}
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
            {logos.map((logo, index) => (
              <div key={index} className="flex flex-col items-center p-2 border rounded-md">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src={logo.logo}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-sm text-center mt-2">{logo.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientLogosAdmin;
