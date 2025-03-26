
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";

const AdminSetup = () => {
  const { user } = useAuth();
  const { isAdmin, rolesLoading, grantAdminRole } = useProfile();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGrantAdmin = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar esta funcionalidade");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      console.log("Admin setup: Calling grantAdminRole");
      const result = await grantAdminRole();
      
      if (result.error) {
        console.error("Admin setup: Error returned from grantAdminRole:", result.error);
        setErrorMessage(result.error.message || "Erro desconhecido ao conceder privilégios");
        toast.error(`Erro ao conceder privilégios de administrador: ${result.error.message || "Erro desconhecido"}`);
        return;
      }
      
      toast.success("Privilégios de administrador concedidos com sucesso!");
    } catch (error) {
      console.error("Admin setup: Exception in handleGrantAdmin:", error);
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMessage(errorMsg);
      toast.error(`Erro ao conceder privilégios de administrador: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para navegar para a página de webhooks admin
  const navigateToWebhookAdmin = () => {
    navigate("/admin-webhooks");
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
                {rolesLoading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    <p>Verificando permissões...</p>
                  </div>
                ) : isAdmin ? (
                  <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-500 mr-2" />
                    <p>Você já possui privilégios de administrador</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4">
                      Esta página permite conceder privilégios de administrador ao seu usuário.
                      Isso permitirá que você acesse a página de administração de webhooks e outras 
                      funcionalidades administrativas.
                    </p>
                    
                    {errorMessage && (
                      <div className="flex items-center p-4 mt-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p className="text-sm">{errorMessage}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 w-full">
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Voltar para Home
                  </Button>
                  
                  {!isAdmin && user && (
                    <Button 
                      onClick={handleGrantAdmin} 
                      disabled={isProcessing || rolesLoading}
                      className={errorMessage ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : errorMessage ? (
                        "Tentar Novamente"
                      ) : (
                        "Conceder Privilégios"
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Botão que só aparece quando os privilégios de administrador foram concedidos */}
                {isAdmin && (
                  <Button 
                    className="w-full mt-4"
                    onClick={navigateToWebhookAdmin}
                  >
                    <ExternalLink className="mr-2" />
                    Acessar Administração de Webhooks
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
