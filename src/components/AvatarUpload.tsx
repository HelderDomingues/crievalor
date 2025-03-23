
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Upload, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  avatarUrl: string | null;
  username: string | null;
  onAvatarUploaded?: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  avatarUrl, 
  username,
  onAvatarUploaded 
}) => {
  const { uploadAvatar, avatarUploading } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor selecione uma imagem (JPG, PNG, etc)."
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB."
      });
      return;
    }

    // Show local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    const { error, url } = await uploadAvatar(file);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer upload",
        description: error.message
      });
      // Revert preview
      setPreviewUrl(avatarUrl);
    } else if (url) {
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
      if (onAvatarUploaded) {
        onAvatarUploaded(url);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="h-24 w-24 cursor-pointer border-2 border-primary/20" onClick={triggerFileInput}>
        <AvatarImage src={previewUrl || ""} alt={username || "Avatar"} />
        <AvatarFallback className="bg-muted">
          <User className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <Button 
        size="sm" 
        variant="outline" 
        className="text-xs gap-1"
        onClick={triggerFileInput}
        disabled={avatarUploading}
      >
        {avatarUploading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Upload className="h-3 w-3" />
            <span>Alterar foto</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AvatarUpload;
