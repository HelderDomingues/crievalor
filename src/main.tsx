
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createStorageBucketIfNotExists } from './services/storageService';
import { supabase } from '@/integrations/supabase/client';
import { upsertSystemSetting } from './services/systemSettingsService';

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

// Função para inicializar configurações do sistema
async function setupSystemSettings() {
  try {
    // Inserir API Key do Asaas na tabela system_settings
    const asaasApiKey = "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjA3NDkzNWU3LWJmYWYtNDRiMC04NzZjLTEwZGNjYTIyMTMzNzo6JGFhY2hfZThiZDMzN2UtZDIyOC00NGYyLWE0OTctMmY3OTkzYTQ4MTc4";
    const result = await upsertSystemSetting(
      'ASAAS_API_KEY',
      asaasApiKey,
      'API Key do Asaas para integração de pagamentos'
    );
    
    if (result) {
      console.log("API Key do Asaas configurada com sucesso");
    } else {
      console.error("Erro ao configurar API Key do Asaas");
    }
  } catch (error) {
    console.error("Erro ao configurar system settings:", error);
  }
}

// Inicializar storage bucket, configurar políticas RLS e system settings
createStorageBucketIfNotExists('materials');

// Note: No need to create logos bucket since it's already created in Supabase
setupRLSPolicies();
setupSystemSettings();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
