
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ProfileField from "./ProfileField";
import SocialMediaField from "./SocialMediaField";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { UserProfile } from "@/types/auth";

interface ProfileTabsProps {
  activeTab: string;
  profile: UserProfile | null;
  loading: boolean;
  handleSaveField: (field: string, value: string) => Promise<void>;
  openWhatsApp: () => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  profile,
  loading,
  handleSaveField,
  openWhatsApp
}) => {
  return (
    <CardContent>
      {activeTab === "personal" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados Pessoais</h3>
          
          <ProfileField
            label="Nome de Usuário"
            value={profile?.username || ""}
            fieldName="username"
            onSave={handleSaveField}
            loading={loading}
            placeholder="Seu nome de usuário"
            required
          />
          
          <ProfileField
            label="Nome Completo"
            value={profile?.full_name || ""}
            fieldName="full_name"
            onSave={handleSaveField}
            loading={loading}
            placeholder="Seu nome completo"
            required
          />
          
          <ProfileField
            label="Telefone"
            value={profile?.phone || ""}
            fieldName="phone"
            onSave={handleSaveField}
            loading={loading}
            placeholder="Seu telefone com DDD"
            required
          />
          
          <ProfileField
            label="CPF"
            value={profile?.cpf || ""}
            fieldName="cpf"
            onSave={handleSaveField}
            loading={loading}
            placeholder="Seu CPF (apenas números)"
            required
          />
        </div>
      )}
      
      {activeTab === "company" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados da Empresa</h3>
          
          <ProfileField
            label="Nome da Empresa"
            value={profile?.company_name || ""}
            fieldName="company_name"
            onSave={handleSaveField}
            loading={loading}
            placeholder="Nome da sua empresa"
            required
          />
          
          <ProfileField
            label="Endereço da Empresa"
            value={profile?.company_address || ""}
            fieldName="company_address"
            onSave={handleSaveField}
            loading={loading}
            isTextarea={true}
            placeholder="Endereço completo da empresa"
            required
          />
          
          <ProfileField
            label="Website"
            value={profile?.website || ""}
            fieldName="website"
            onSave={handleSaveField}
            loading={loading}
            placeholder="https://www.seusite.com.br"
          />
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <ProfileField
                label="CNPJ"
                value={profile?.cnpj || ""}
                fieldName="cnpj"
                onSave={handleSaveField}
                loading={loading}
                placeholder="00.000.000/0000-00"
              />
            </div>
            
            {!profile?.cnpj && (
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="text-sm mb-2">Não possui CNPJ? Entre em contato com nosso consultor para orientações.</p>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={openWhatsApp}
                  className="w-full"
                >
                  <Phone className="h-4 w-4 mr-2" /> Falar com Consultor
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === "social" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Redes Sociais</h3>
          
          <SocialMediaField
            label="LinkedIn"
            value={profile?.social_media?.linkedin}
            platform="linkedin"
            onSave={handleSaveField}
            loading={loading}
            placeholder="https://linkedin.com/in/seuperfil"
          />
          
          <SocialMediaField
            label="Instagram"
            value={profile?.social_media?.instagram}
            platform="instagram"
            onSave={handleSaveField}
            loading={loading}
            placeholder="https://instagram.com/seuperfil"
          />
          
          <SocialMediaField
            label="Facebook"
            value={profile?.social_media?.facebook}
            platform="facebook"
            onSave={handleSaveField}
            loading={loading}
            placeholder="https://facebook.com/seuperfil"
          />
          
          <SocialMediaField
            label="Twitter"
            value={profile?.social_media?.twitter}
            platform="twitter"
            onSave={handleSaveField}
            loading={loading}
            placeholder="https://twitter.com/seuperfil"
          />
        </div>
      )}
    </CardContent>
  );
};

export default ProfileTabs;
