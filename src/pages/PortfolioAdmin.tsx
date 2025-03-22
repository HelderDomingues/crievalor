
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioAdmin from "@/components/PortfolioAdmin";

const PortfolioAdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <PortfolioAdmin />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PortfolioAdminPage;
