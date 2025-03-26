
import React, { useState, useEffect } from 'react';
import { WebhookManager } from '@/components/admin/WebhookManager';
import { useProfile } from '@/hooks/useProfile';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const WebhookAdmin = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [accessChecked, setAccessChecked] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      setAccessChecked(true);
      
      // If user doesn't have admin permissions after loading completes, show a toast
      if (!(profile?.social_media && 'admin' in profile.social_media)) {
        toast.error("Você não tem permissões de administrador");
      }
    }
  }, [loading, profile]);
  
  // Check for admin permissions
  const isAdmin = profile?.social_media && 'admin' in profile.social_media;
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Verificando permissões...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If done loading and not admin, redirect to admin setup
  if (accessChecked && !isAdmin) {
    return <Navigate to="/admin-setup" replace />;
  }
  
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
