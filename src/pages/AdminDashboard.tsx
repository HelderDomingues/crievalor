
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminAuth from "@/components/admin/AdminAuth";
import { Users, Settings, Shield } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, rolesLoading } = useProfile();
  
  useEffect(() => {
    // Add debug logging to understand the admin status
    console.log("AdminDashboard - User:", user?.id);
    console.log("AdminDashboard - isAdmin:", isAdmin);
    console.log("AdminDashboard - rolesLoading:", rolesLoading);
  }, [user, isAdmin, rolesLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <AdminAuth 
            onAuthenticated={() => {
              console.log("User authenticated as admin");
            }}
            redirectPath="/admin-setup"
          >
            <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Administração de Materiais
                  </CardTitle>
                  <CardDescription>
                    Gerencie materiais exclusivos disponíveis para os usuários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Adicione, edite ou remova materiais exclusivos que serão disponibilizados para os usuários com base no nível do plano.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate("/admin-materials")}
                    className="w-full"
                  >
                    Gerenciar Materiais
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure integrações e webhooks para o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Gerencie webhooks e integrações com sistemas externos como gateway de pagamento e outras plataformas.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate("/admin-webhooks")}
                    className="w-full"
                  >
                    Gerenciar Webhooks
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Administração de Usuários
                  </CardTitle>
                  <CardDescription>
                    Gerencie usuários e permissões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Visualize, edite permissões e gerencie contas de usuários da plataforma.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate("/admin-settings")}
                    className="w-full"
                  >
                    Gerenciar Usuários
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
