
import React from 'react';
import { WebhookManager } from '@/components/admin/WebhookManager';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import AdminAuth from '@/components/admin/AdminAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

const WebhookAdmin = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Administração de Webhooks</h1>
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/admin-setup')}
              >
                Configuração de Admin
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Voltar para Home
              </Button>
            </div>
          </div>
          
          <AdminAuth 
            onAuthenticated={() => {}}
            redirectPath="/admin-setup"
          >
            <ErrorBoundary>
              <div className="space-y-10">
                <WebhookManager />
              </div>
            </ErrorBoundary>
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default WebhookAdmin;
