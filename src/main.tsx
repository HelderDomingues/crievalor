
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { supabase } from '@/integrations/supabase/client';
import { upsertSystemSetting } from './services/systemSettingsService';
import { initializeStorageBuckets } from './services/storageService';

// Initialize storage buckets first
async function setupStorage() {
  try {
    console.log("Setting up storage buckets...");
    await initializeStorageBuckets();
    console.log("Storage setup completed");
  } catch (error) {
    console.error("Error during storage setup:", error);
  }
}

// Function to set up RLS policies
async function setupRLSPolicies() {
  try {
    console.log("Setting up RLS policies...");
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

// Function to set up system settings
async function setupSystemSettings() {
  try {
    console.log("Setting up system settings...");
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

// Initialize in sequence
async function initializeApp() {
  try {
    // First setup storage buckets
    await setupStorage();
    
    // Then setup RLS policies
    await setupRLSPolicies();
    
    // Finally setup system settings
    await setupSystemSettings();
    
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
