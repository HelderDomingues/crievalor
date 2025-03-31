
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientLogos } from "@/components/ClientLogosCarousel";
import { Trash2, Upload, Plus } from "lucide-react";

const ClientLogosAdmin = () => {
  const [logos, setLogos] = useState([...clientLogos]);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogoChange = (index: number, field: 'name' | 'logo', value: string) => {
    const updatedLogos = [...logos];
    updatedLogos[index] = { ...updatedLogos[index], [field]: value };
    setLogos(updatedLogos);
  };

  const handleAddLogo = () => {
    setLogos([...logos, { name: `Client ${logos.length + 1}`, logo: "/placeholder.svg" }]);
  };

  const handleRemoveLogo = (index: number) => {
    const updatedLogos = [...logos];
    updatedLogos.splice(index, 1);
    setLogos(updatedLogos);
  };

  const handleSave = async () => {
    try {
      // Here you would typically save to a database
      // For now, we'll just show a success message
      alert("Client logos updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving client logos:", error);
      alert("Error saving client logos");
    }
  };

  const handleUploadImage = async (index: number) => {
    // In a real implementation, this would open a file dialog and upload the image
    // For demonstration purposes, we'll just update with a placeholder
    const newImageUrl = `/lovable-uploads/new-client-${index + 1}.png`;
    handleLogoChange(index, 'logo', newImageUrl);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Logos dos Clientes</span>
          <div>
            {isEditing ? (
              <div className="space-x-2">
                <Button onClick={handleSave} variant="default">Salvar</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">Cancelar</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">Editar</Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
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
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddLogo} variant="outline" className="w-full">
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
