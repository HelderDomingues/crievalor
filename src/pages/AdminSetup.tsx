import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { FileText, Image, MessageSquareQuote, Settings, Palette } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";

const AdminSetup = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <AdminAuth 
            onAuthenticated={() => setIsAuthenticated(true)}
            redirectPath="/"
          >
            {isAuthenticated && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                  <Button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Sair
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AdminCard 
                    title="Gerenciar Portfólio"
                    icon={<Palette className="h-10 w-10" />}
                    to="/admin-portfolio"
                    description="Gerenciar projetos e trabalhos do portfólio"
                  />
                  
                  <AdminCard 
                    title="Configurações do Sistema" 
                    icon={<Settings className="h-10 w-10" />}
                    to="/admin-webhooks"
                    description="Gerenciar webhooks e outras configurações do sistema"
                  />
                  
                  <AdminCard 
                    title="Materiais Exclusivos" 
                    icon={<FileText className="h-10 w-10" />}
                    to="/admin-materials"
                    description="Gerenciar materiais disponíveis para usuários de diferentes planos"
                  />
                  
                  <AdminCard 
                    title="Logos de Clientes" 
                    icon={<Image className="h-10 w-10" />}
                    to="/admin-logos"
                    description="Gerenciar logos de clientes exibidos na página inicial"
                  />

                  <AdminCard 
                    title="Depoimentos" 
                    icon={<MessageSquareQuote className="h-10 w-10" />}
                    to="/admin-testimonials"
                    description="Gerenciar depoimentos de clientes exibidos na página inicial"
                  />
                </div>
              </div>
            )}
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSetup;
