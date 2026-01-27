
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminMaterialsManager from "@/components/admin/AdminMaterialsManager";

const AdminMaterialsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Administração de Materiais</h1>
          <AdminMaterialsManager />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminMaterialsPage;
