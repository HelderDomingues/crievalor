
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { supabase } from '@/integrations/supabase/client';
import { upsertSystemSetting } from './services/systemSettingsService';
import { executeInitialSetup } from './services/setupService';
import { HelmetProvider } from 'react-helmet-async';

// Retry function with exponential backoff for initialization steps
async function retryOperation(operation, maxRetries = 3, description = "Operation") {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await operation();
      console.log(`${description} completed successfully`);
      return result;
    } catch (error) {
      retries++;
      const waitTime = Math.pow(2, retries) * 1000;

      console.error(`Error in ${description} (attempt ${retries}/${maxRetries}):`, error);

      if (retries < maxRetries) {
        console.log(`Retrying ${description} in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error(`${description} failed after ${maxRetries} attempts`);
      }
    }
  }

  return null;
}

// Initialize in sequence using a single async function with improved error handling
async function initializeApp() {
  try {
    console.log("Iniciando a sequência de inicialização da aplicação...");

    // First setup RLS policies and storage buckets
    console.log("Setting up RLS policies and storage buckets...");
    try {
      await retryOperation(
        executeInitialSetup,
        3,
        "Initial system setup"
      );
    } catch (setupError) {
      console.error("Erro crítico ao executar setup inicial:", setupError);
      // Continue mesmo com erro para não bloquear o carregamento da aplicação
    }

    // Finally setup system settings
    console.log("Setting up system settings...");
    // TEMPORARIAMENTE DESABILITADO - Erro de RLS bloqueando inicialização
    /*
    try {
      // Inserir API Key do Asaas na tabela system_settings
      const asaasApiKey = "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjA3NDkzNWU3LWJmYWYtNDRiMC04NzZjLTEwZGNjYTIyMTMzNzo6JGFhY2hfZThiZDMzN2UtZDIyOC00NGYyLWE0OTctMmY3OTkzYTQ4MTc4";
      
      await retryOperation(
        async () => upsertSystemSetting(
          'ASAAS_API_KEY',
          asaasApiKey,
          'API Key do Asaas para integração de pagamentos'
        ),
        3,
        "Asaas API key configuration"
      );
      
      console.log("API Key do Asaas configurada com sucesso");
    } catch (settingsError) {
      console.error("Erro ao configurar system settings:", settingsError);
      // Continue mesmo com erro para não bloquear o carregamento da aplicação
    }
    */

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

// Função para expor conteúdo aos crawlers
function exposeSEOContent() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const seoContent = document.getElementById('seo-content');
    if (seoContent) {
      // Torna o conteúdo visível temporariamente para crawlers
      seoContent.style.position = 'static';
      seoContent.style.left = 'auto';
      seoContent.style.top = 'auto';
      seoContent.style.visibility = 'hidden';
      seoContent.style.height = '0';
      seoContent.style.overflow = 'hidden';
    }
  }
}

// Expõe conteúdo SEO após carregamento
window.addEventListener('load', () => {
  setTimeout(exposeSEOContent, 100);
});
