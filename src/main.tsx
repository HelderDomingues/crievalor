
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createStorageBucketIfNotExists } from './services/storageService';
import { supabase } from '@/integrations/supabase/client';

// Função para inicializar e configurar as políticas RLS
async function setupRLSPolicies() {
  try {
    const { data, error } = await supabase.functions.invoke('setup-rls');
    
    if (error) {
      console.error("Erro ao configurar políticas RLS:", error);
    } else {
      console.log("Políticas RLS configuradas com sucesso:", data);
    }
  } catch (error) {
    console.error("Erro ao chamar edge function setup-rls:", error);
  }
}

// Inicializar storage bucket e configurar políticas RLS
createStorageBucketIfNotExists();
setupRLSPolicies();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
