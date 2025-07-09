import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppDashboard from "@/components/admin/WhatsAppDashboard";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const WhatsAppDashboardPage = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dashboard WhatsApp | Crie Valor</title>
        <meta name="description" content="Dashboard para monitoramento e gestão de conversas do WhatsApp Business" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <WhatsAppDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhatsAppDashboardPage;