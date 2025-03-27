
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertTriangle, ExternalLink, ShieldAlert, Key, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAuth from "@/components/admin/AdminAuth";

const ADMIN_PASSWORD = "crie2024"; // Password for admin setup in production environment

const AdminSetup = () => {
  const { user } = useAuth();
  const { isAdmin, rolesLoading, grantAdminRole } = useProfile();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("supabase");
  
  // Admin authentication
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Portfolio admin credentials
  const [portfolioPassword, setPortfolioPassword] = useState("");
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already an admin, if so, we don't need to show the admin setup
    if (isAdmin && !rolesLoading) {
      setIsAdminAuthenticated(true);
    }
  }, [isAdmin, rolesLoading]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setIsAdminAuthOpen(false);
      setAdminPassword("");
      toast.success("Autenticação bem-sucedida");
    } else {
      toast.error("Senha de administrador incorreta");
    }
  };

  const handleGrantAdmin = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar esta funcionalidade");
      navigate("/auth");
      return;
    }

    if (!isAdminAuthenticated) {
      setIsAdminAuthOpen(true);
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
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      console.error("Admin setup: Exception in handleGrantAdmin:", error);
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMessage(errorMsg);
      toast.error(`Erro ao conceder privilégios de administrador: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePortfolioLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPortfolioLoading(true);
    
    // Legacy auth logic - simple password check
    if (portfolioPassword === "crie2024") {
      localStorage.setItem("adminAuthenticated", "true");
      setIsPortfolioLoading(false);
      toast.success("Login de portfólio bem sucedido");
      navigate("/portfolio-admin");
    } else {
      setIsPortfolioLoading(false);
      toast.error("Senha incorreta para acesso ao portfólio");
    }
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-lg mx-auto">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="supabase">Admin Supabase</TabsTrigger>
                <TabsTrigger value="portfolio">Admin Portfólio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="supabase">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Supabase</CardTitle>
                    <CardDescription>
                      Configuração de privilégios de administrador para acesso a funcionalidades administrativas.
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
                        
                        {isAdminAuthOpen ? (
                          <form onSubmit={handleAdminAuth} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <label htmlFor="admin-password" className="text-sm font-medium">
                                Senha de Administrador
                              </label>
                              <div className="relative">
                                <input
                                  id="admin-password"
                                  type="password"
                                  value={adminPassword}
                                  onChange={(e) => setAdminPassword(e.target.value)}
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                  required
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAdminAuthOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit">
                                Verificar
                              </Button>
                            </div>
                          </form>
                        ) : errorMessage && (
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
                      
                      {!isAdmin && user && !isAdminAuthOpen && (
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
                        onClick={() => navigate("/admin")}
                      >
                        <ExternalLink className="mr-2" />
                        Acessar Painel Administrativo
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Key className="mr-2 h-5 w-5" />
                      Acesso ao Admin de Portfólio
                    </CardTitle>
                    <CardDescription>
                      Use a senha para acessar o painel de administração do portfólio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePortfolioLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="portfolio-password" className="text-sm font-medium">
                          Senha de administrador
                        </label>
                        <input
                          id="portfolio-password"
                          type="password"
                          value={portfolioPassword}
                          onChange={(e) => setPortfolioPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isPortfolioLoading}>
                        {isPortfolioLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          "Acessar Portfólio Admin"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSetup;
