
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SystemSettings } from '@/components/admin/SystemSettings';
import AdminAuth from "@/components/admin/AdminAuth";

const AdminSettings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Configurações do Sistema</h1>
          
          <AdminAuth 
            onAuthenticated={() => {}}
            redirectPath="/admin-setup"
          >
            <div className="max-w-3xl mx-auto">
              <SystemSettings />
            </div>
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSettings;
