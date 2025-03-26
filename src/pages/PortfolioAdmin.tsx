
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioAdminPanel from "@/components/PortfolioAdmin";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";

const PortfolioAdminPage = () => {
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
            redirectPath="/admin-setup"
          >
            {isAuthenticated && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Painel Administrativo de Portfólio</h1>
                  <Button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Sair
                  </Button>
                </div>
                <PortfolioAdminPanel />
              </div>
            )}
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PortfolioAdminPage;
