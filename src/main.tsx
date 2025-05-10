
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { supabase } from '@/integrations/supabase/client';
import { upsertSystemSetting } from './services/systemSettingsService';
import { executeInitialSetup } from './services/setupService';
import { HelmetProvider } from 'react-helmet-async';

// Initialize in sequence using a single async function with improved error handling
async function initializeApp() {
  try {
    console.log("Iniciando a sequência de inicialização da aplicação...");
    
    // First setup RLS policies and storage buckets - agora unificado em uma única função
    console.log("Setting up RLS policies and storage buckets...");
    try {
      const setupResult = await executeInitialSetup();
      console.log("Configuração inicial completa");
    } catch (setupError) {
      console.error("Erro crítico ao executar setup inicial:", setupError);
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
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
