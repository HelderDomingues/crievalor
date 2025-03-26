
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SocialMediaFieldProps {
  label: string;
  value: string | undefined;
  platform: string;
  onSave: (field: string, value: string) => Promise<void>;
  loading: boolean;
  placeholder: string;
}

const SocialMediaField: React.FC<SocialMediaFieldProps> = ({
  label,
  value,
  platform,
  onSave,
  loading,
  placeholder
}) => {
  const [isEditing, setIsEditing] = useState(!value);
  const [fieldValue, setFieldValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFieldValue(value || "");
  }, [value]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(`social_media.${platform}`, fieldValue);
      setIsEditing(false);
      toast({
        title: "Rede social atualizada",
        description: `${label} foi atualizado com sucesso.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setFieldValue("");
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <Label htmlFor={`social-${platform}`}>{label}</Label>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                disabled={isSaving}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Limpar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" /> {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Input
        id={`social-${platform}`}
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
        disabled={!isEditing || isSaving || loading}
        className="w-full"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SocialMediaField;
