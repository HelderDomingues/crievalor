
import React from 'react';
import { WebhookManager } from '@/components/admin/WebhookManager';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';

const WebhookAdmin = () => {
  const { profile, loading } = useProfile();
  
  // Verificar se o usuário tem permissão para acessar esta página
  // Check for admin permissions using the value in the social_media object
  // which is the current workaround until proper user roles are implemented
  if (!loading && (!profile || !profile.social_media?.hasOwnProperty('admin'))) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-10">Administração de Webhooks</h1>
      
      <div className="space-y-10">
        <WebhookManager />
      </div>
    </div>
  );
};

export default WebhookAdmin;
