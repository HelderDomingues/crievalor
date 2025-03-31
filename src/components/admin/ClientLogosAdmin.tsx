
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientLogos } from "@/components/ClientLogosCarousel";
import { Trash2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { uploadLogoImage } from "@/services/clientLogosService";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

interface ClientLogo {
  id?: string;
  name: string;
  logo: string;
}

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
      
      // Try to fetch from Supabase first
      const { data, error } = await supabaseExtended
        .from('client_logos')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching logos:", error);
        // Fallback to local data
        setLogos([...clientLogos]);
      } else if (data && data.length > 0) {
        setLogos(data);
      } else {
        // No data in database yet, use the local data
        setLogos([...clientLogos]);
      }
    } catch (error) {
      console.error("Error in fetchLogos:", error);
      setLogos([...clientLogos]);
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

  const handleRemoveLogo = (index: number) => {
    const updatedLogos = [...logos];
    updatedLogos.splice(index, 1);
    setLogos(updatedLogos);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Create the table if it doesn't exist
      const { error: tableError } = await supabaseExtended.rpc('create_table_if_not_exists', {
        table_name: 'client_logos',
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          name text not null,
          logo text not null,
          created_at timestamp with time zone default now(),
          updated_at timestamp with time zone default now()
        `
      });
      
      if (tableError) {
        console.error("Error creating table:", tableError);
        throw new Error("Erro ao criar tabela de logos");
      }
      
      // Clear existing data
      const { error: deleteError } = await supabaseExtended
        .from('client_logos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      if (deleteError) {
        console.error("Error deleting existing logos:", deleteError);
        throw new Error("Erro ao limpar logos existentes");
      }
      
      // Insert new data
      const { error: insertError } = await supabaseExtended
        .from('client_logos')
        .insert(logos.map(logo => ({
          name: logo.name,
          logo: logo.logo
        })));
      
      if (insertError) {
        console.error("Error inserting logos:", insertError);
        throw new Error("Erro ao salvar logos");
      }
      
      toast.success("Logos dos clientes atualizados com sucesso");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving client logos:", error);
      toast.error("Erro ao salvar logos dos clientes");
    } finally {
      setIsLoading(false);
    }
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
        const { url, error } = await uploadLogoImage(file);
        
        if (error || !url) {
          console.error("Error uploading image:", error);
          toast.error("Erro ao fazer upload da imagem");
          return;
        }
        
        // Update the logo URL in state
        handleLogoChange(index, 'logo', url);
        toast.success("Imagem carregada com sucesso");
      } catch (error) {
        console.error("Error in handleUploadImage:", error);
        toast.error("Erro ao processar imagem");
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
                  <div className="flex items-center gap-2">
                    <Input
                      value={logo.logo}
                      onChange={(e) => handleLogoChange(index, 'logo', e.target.value)}
                      placeholder="URL do logo"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleUploadImage(index)}
                      title="Fazer upload de imagem"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
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
