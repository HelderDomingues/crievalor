
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import ClientLogosAdmin from "@/components/admin/ClientLogosAdmin";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ClientLogosAdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  const navigateToAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
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
                  <h1 className="text-3xl font-bold">Gerenciamento de Logos dos Clientes</h1>
                  <div className="space-x-2">
                    <Button onClick={navigateToAdmin} variant="outline">
                      Dashboard Admin
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Sair
                    </Button>
                  </div>
                </div>
                <ClientLogosAdmin />
              </div>
            )}
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientLogosAdminPage;
