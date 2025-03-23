
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Briefcase, Phone, Globe, FileText } from "lucide-react";
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

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: "",
      full_name: "",
      phone: "",
      company_name: "",
      company_address: "",
      website: "",
      social_media: {
        linkedin: "",
        twitter: "",
        instagram: "",
        facebook: ""
      },
      cnpj: ""
    }
  });
  
  // Update form values when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        company_name: profile.company_name || "",
        company_address: profile.company_address || "",
        website: profile.website || "",
        social_media: profile.social_media || {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: ""
        },
        cnpj: profile.cnpj || ""
      });
    }
  }, [profile, form]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsUpdating(true);
    
    const { error } = await updateProfile(values as Partial<UserProfile>);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message
      });
    } else {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    }
    
    setIsUpdating(false);
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
            
            {/* Sidebar */}
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
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Meu Perfil</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e de empresa
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {activeTab === "personal" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Dados Pessoais</h3>
                          
                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome de Usuário</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Seu nome de usuário" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Seu nome completo" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="(00) 00000-0000" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      {activeTab === "company" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Dados da Empresa</h3>
                          
                          <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome da Empresa</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Nome da sua empresa" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="company_address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Endereço da Empresa</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Endereço completo da empresa" 
                                    className="resize-none" 
                                    rows={3}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://www.seusite.com.br" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cnpj"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CNPJ</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="00.000.000/0000-00" />
                                </FormControl>
                                <FormDescription>
                                  Opcional, mas recomendado
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      {activeTab === "social" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Redes Sociais</h3>
                          
                          <FormField
                            control={form.control}
                            name="social_media.linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://linkedin.com/in/seuperfil" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="social_media.instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://instagram.com/seuperfil" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="social_media.facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://facebook.com/seuperfil" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="social_media.twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://twitter.com/seuperfil" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </form>
                  </Form>
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
