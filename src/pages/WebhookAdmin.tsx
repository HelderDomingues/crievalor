
import React from 'react';
import { WebhookManager } from '@/components/admin/WebhookManager';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WebhookAdmin = () => {
  const { profile, loading } = useProfile();
  
  // Verificar se o usuário tem permissão para acessar esta página
  // Check for admin permissions using the value in the social_media object
  // which is the current workaround until proper user roles are implemented
  if (!loading && (!profile || !profile.social_media?.hasOwnProperty('admin'))) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Administração de Webhooks</h1>
            <a 
              href="/"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Voltar para Home
            </a>
          </div>
          
          <div className="space-y-10">
            <WebhookManager />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WebhookAdmin;
