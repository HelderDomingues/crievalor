
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioAdmin from "@/components/PortfolioAdmin";
import PortfolioAdminLogin from "@/components/PortfolioAdminLogin";

const PortfolioAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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
          {isAuthenticated ? (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Painel Administrativo de Portfólio</h1>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Sair
                </button>
              </div>
              <PortfolioAdmin />
            </div>
          ) : (
            <PortfolioAdminLogin onLogin={handleLogin} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PortfolioAdminPage;
