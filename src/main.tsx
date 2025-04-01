
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { supabase } from '@/integrations/supabase/client';
import { upsertSystemSetting } from './services/systemSettingsService';
import { initializeStorageBuckets } from './services/storageService';

// Initialize in sequence using a single async function
async function initializeApp() {
  try {
    console.log("Iniciando a sequência de inicialização da aplicação...");
    
    // First setup RLS policies - isso deve vir antes de qualquer operação de storage
    console.log("Setting up RLS policies...");
    try {
      const { data, error } = await supabase.functions.invoke('setup-rls');
      
      if (error) {
        console.error("Erro ao configurar políticas RLS:", error);
      } else {
        console.log("Políticas RLS configuradas com sucesso:", data);
      }
    } catch (rlsError) {
      console.error("Erro crítico ao chamar edge function setup-rls:", rlsError);
      // Continue mesmo com erro para não bloquear o carregamento da aplicação
    }
    
    // Then setup storage buckets
    console.log("Setting up storage buckets...");
    try {
      await initializeStorageBuckets();
      console.log("Storage setup completed");
    } catch (storageError) {
      console.error("Error during storage setup:", storageError);
      // Continue mesmo com erro para não bloquear o carregamento da aplicação
    }
    
    // Finally setup system settings
    console.log("Setting up system settings...");
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
    } catch (settingsError) {
      console.error("Erro ao configurar system settings:", settingsError);
      // Continue mesmo com erro para não bloquear o carregamento da aplicação
    }
    
    console.log("Application initialization completed successfully");
  } catch (error) {
    console.error("Error during application initialization:", error);
  }
}

// Start the initialization process but don't block rendering
initializeApp();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
