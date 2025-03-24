
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Briefcase, Phone, Globe, FileText, CreditCard, Save, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AvatarUpload from "@/components/AvatarUpload";
import { UserProfile } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import SubscriptionDetails from "@/components/profile/SubscriptionDetails";
import { subscriptionService } from "@/services/subscriptionService";

const ProfileSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  company_name: z.string().min(2, "Nome da empresa é obrigatório"),
  company_address: z.string().min(5, "Endereço da empresa é obrigatório"),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  social_media: z.object({
    linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
    twitter: z.string().url("URL inválida").optional().or(z.literal("")),
    instagram: z.string().url("URL inválida").optional().or(z.literal("")),
    facebook: z.string().url("URL inválida").optional().or(z.literal(""))
  }).optional(),
  cnpj: z.string().optional().or(z.literal(""))
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

// Component for editable field
const EditableField = ({ 
  label, 
  value, 
  fieldName, 
  onSave,
  loading,
  isTextarea = false
}: { 
  label: string; 
  value: string; 
  fieldName: string; 
  onSave: (field: string, value: string) => Promise<void>;
  loading: boolean;
  isTextarea?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFieldValue(value || "");
  }, [value]);

  const handleSave = async () => {
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
        <Label htmlFor={fieldName}>{label}</Label>
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
          onChange={(e) => setFieldValue(e.target.value)}
          disabled={!isEditing || isSaving || loading}
          className="w-full"
          rows={3}
        />
      ) : (
        <Input
          id={fieldName}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          disabled={!isEditing || isSaving || loading}
          className="w-full"
        />
      )}
    </div>
  );
};

// Component for social media field
const SocialMediaField = ({ 
  label, 
  value, 
  platform, 
  onSave,
  loading
}: { 
  label: string; 
  value: string; 
  platform: string; 
  onSave: (field: string, value: string) => Promise<void>;
  loading: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
        placeholder={`https://${platform}.com/seuperfil`}
      />
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfileField } = useProfile();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("personal");
  
  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSaveField = async (field: string, value: string) => {
    console.log(`Saving field ${field} with value:`, value);
    const { error } = await updateProfileField(field, value);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar campo",
        description: error.message
      });
      return Promise.reject(error);
    }
    
    return Promise.resolve();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Carregando suas informações...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isProfileComplete = 
    profile?.full_name && 
    profile?.company_name && 
    profile?.company_address;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <AvatarUpload 
                      avatarUrl={profile?.avatar_url || null} 
                      username={profile?.username || null}
                    />
                    
                    <div className="mt-4 text-center">
                      <h3 className="font-medium">{profile?.full_name || user?.email}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {!isProfileComplete && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Complete seu perfil para continuar
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <nav className="flex flex-col space-y-1">
                    <Button 
                      variant={activeTab === "personal" ? "default" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("personal")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dados Pessoais
                    </Button>
                    <Button 
                      variant={activeTab === "company" ? "default" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("company")}
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Dados da Empresa
                    </Button>
                    <Button 
                      variant={activeTab === "social" ? "default" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("social")}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Redes Sociais
                    </Button>
                    <Button 
                      variant={activeTab === "subscription" ? "default" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("subscription")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Assinatura
                    </Button>
                  </nav>

                  <Separator className="my-4" />
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    Sair
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "personal" && "Dados Pessoais"}
                    {activeTab === "company" && "Dados da Empresa"}
                    {activeTab === "social" && "Redes Sociais"}
                    {activeTab === "subscription" && "Assinatura e Financeiro"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "personal" && "Gerencie suas informações pessoais"}
                    {activeTab === "company" && "Gerencie as informações da sua empresa"}
                    {activeTab === "social" && "Gerencie suas redes sociais"}
                    {activeTab === "subscription" && "Gerencie sua assinatura e dados financeiros"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {activeTab === "subscription" ? (
                    <SubscriptionDetails />
                  ) : (
                    <>
                      {activeTab === "personal" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Dados Pessoais</h3>
                          
                          <EditableField
                            label="Nome de Usuário"
                            value={profile?.username || ""}
                            fieldName="username"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <EditableField
                            label="Nome Completo"
                            value={profile?.full_name || ""}
                            fieldName="full_name"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <EditableField
                            label="Telefone"
                            value={profile?.phone || ""}
                            fieldName="phone"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                        </div>
                      )}
                      
                      {activeTab === "company" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Dados da Empresa</h3>
                          
                          <EditableField
                            label="Nome da Empresa"
                            value={profile?.company_name || ""}
                            fieldName="company_name"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <EditableField
                            label="Endereço da Empresa"
                            value={profile?.company_address || ""}
                            fieldName="company_address"
                            onSave={handleSaveField}
                            loading={loading}
                            isTextarea={true}
                          />
                          
                          <EditableField
                            label="Website"
                            value={profile?.website || ""}
                            fieldName="website"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <EditableField
                            label="CNPJ"
                            value={profile?.cnpj || ""}
                            fieldName="cnpj"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                        </div>
                      )}
                      
                      {activeTab === "social" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Redes Sociais</h3>
                          
                          <SocialMediaField
                            label="LinkedIn"
                            value={profile?.social_media?.linkedin || ""}
                            platform="linkedin"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <SocialMediaField
                            label="Instagram"
                            value={profile?.social_media?.instagram || ""}
                            platform="instagram"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <SocialMediaField
                            label="Facebook"
                            value={profile?.social_media?.facebook || ""}
                            platform="facebook"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                          
                          <SocialMediaField
                            label="Twitter"
                            value={profile?.social_media?.twitter || ""}
                            platform="twitter"
                            onSave={handleSaveField}
                            loading={loading}
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
