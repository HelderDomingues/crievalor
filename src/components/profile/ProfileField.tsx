
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPhoneNumber } from "@/utils/formatters";

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  fieldName: string;
  onSave: (field: string, value: string) => Promise<void>;
  loading: boolean;
  isTextarea?: boolean;
  placeholder?: string;
  required?: boolean;
  isPhoneNumber?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  fieldName,
  onSave,
  loading,
  isTextarea = false,
  placeholder = "",
  required = false,
  isPhoneNumber = false
}) => {
  const [isEditing, setIsEditing] = useState(!value);
  const [fieldValue, setFieldValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFieldValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isPhoneNumber) {
      setFieldValue(formatPhoneNumber(e.target.value));
    } else {
      setFieldValue(e.target.value);
    }
  };

  const handleSave = async () => {
    if (required && !fieldValue.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: `${label} é um campo obrigatório.`
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(fieldName, fieldValue);
      setIsEditing(false);
      toast({
        title: "Campo atualizado",
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
        <div className="flex items-center">
          <Label htmlFor={fieldName} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>{label}</Label>
          {required && (
            <span className="ml-2 text-xs text-muted-foreground">(Obrigatório)</span>
          )}
        </div>
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
      
      {isTextarea ? (
        <Textarea
          id={fieldName}
          value={fieldValue}
          onChange={handleChange}
          disabled={!isEditing || isSaving || loading}
          className="w-full"
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <Input
          id={fieldName}
          value={fieldValue}
          onChange={handleChange}
          disabled={!isEditing || isSaving || loading}
          className="w-full"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default ProfileField;
