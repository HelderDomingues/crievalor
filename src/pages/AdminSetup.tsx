
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";

const AdminSetup = () => {
  const { user } = useAuth();
  const { profile, updateProfileField, loading } = useProfile();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminGranted, setAdminGranted] = useState(false);

  useEffect(() => {
    // Check if user already has admin privileges
    if (profile?.social_media && 'admin' in profile.social_media) {
      setAdminGranted(true);
    }
  }, [profile]);

  const handleGrantAdmin = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar esta funcionalidade");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Update the social_media object to include admin privileges
      const updatedSocialMedia = {
        ...(profile?.social_media || {}),
        admin: true
      };
      
      await updateProfileField("social_media", updatedSocialMedia);
      
      toast.success("Privilégios de administrador concedidos com sucesso!");
      setAdminGranted(true);
    } catch (error) {
      console.error("Erro ao conceder privilégios de administrador:", error);
      toast.error("Erro ao conceder privilégios de administrador");
    } finally {
      setIsProcessing(false);
    }
  };

  // Ensure we're using window.location.href instead of navigate
  // This forces a complete page reload to ensure proper state updates
  const goToWebhookAdmin = () => {
    window.location.href = "/admin/webhooks";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Configuração de Administrador</h1>
          
          {!user && (
            <Card className="w-full max-w-lg mx-auto mb-8 border-amber-300">
              <CardHeader className="bg-amber-50">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="text-amber-500 mr-2" />
                  Autenticação Necessária
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>Você precisa estar logado para acessar esta funcionalidade.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/auth")}>
                  Ir para Login
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {user && (
            <Card className="w-full max-w-lg mx-auto">
              <CardHeader>
                <CardTitle>Conceder Privilégios de Administrador</CardTitle>
                <CardDescription>
                  Conceda privilégios de administrador ao seu usuário para acessar funcionalidades administrativas.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    <p>Carregando informações do perfil...</p>
                  </div>
                ) : adminGranted ? (
                  <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-500 mr-2" />
                    <p>Você já possui privilégios de administrador</p>
                  </div>
                ) : (
                  <p>
                    Esta página permite conceder privilégios de administrador ao seu usuário.
                    Isso permitirá que você acesse a página de administração de webhooks e outras 
                    funcionalidades administrativas.
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Voltar para Home
                </Button>
                
                {!adminGranted && user && (
                  <Button 
                    onClick={handleGrantAdmin} 
                    disabled={isProcessing || loading}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Conceder Privilégios"
                    )}
                  </Button>
                )}
                
                {adminGranted && (
                  <Button onClick={goToWebhookAdmin}>
                    Ir para Admin Webhooks
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSetup;
