
import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";
import AdminAuth from "@/components/admin/AdminAuth";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

const TestimonialsAdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
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
                  <h1 className="text-3xl font-bold">Administração de Depoimentos</h1>
                  <div className="space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/admin-setup')}
                    >
                      Painel Admin
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Sair
                    </Button>
                  </div>
                </div>
                <TestimonialsAdmin />
              </div>
            )}
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default TestimonialsAdminPage;
