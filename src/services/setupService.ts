
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

/**
 * Helper function to execute initial setup tasks for the application
 * Improved with better error handling and retry logic
 */
export const executeInitialSetup = async (): Promise<void> => {
  try {
    console.log("Executando setup inicial da aplicação...");
    
    // Set up RLS policies for all tables using the unified setup function
    console.log("Configurando políticas RLS e buckets de armazenamento...");
    
    // Maximum of 3 retry attempts with exponential backoff
    let retries = 0;
    const maxRetries = 3;
    let success = false;
    
    while (!success && retries < maxRetries) {
      try {
        const { data: setupData, error: setupError } = await supabaseExtended.functions.invoke('setup-rls');
        
        if (setupError) {
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
          console.error(`Erro na tentativa ${retries + 1}/${maxRetries} ao configurar sistema:`, setupError);
          console.log(`Tentando novamente em ${waitTime/1000} segundos...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
        } else {
          success = true;
          console.log("Setup inicial concluído com sucesso:", setupData);
        }
      } catch (invokeError) {
        const waitTime = Math.pow(2, retries) * 1000;
        console.error(`Exceção na tentativa ${retries + 1}/${maxRetries}:`, invokeError);
        console.log(`Tentando novamente em ${waitTime/1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
      }
    }
    
    if (!success) {
      console.error(`Falha após ${maxRetries} tentativas. O sistema pode não estar totalmente configurado.`);
    }
    
  } catch (error) {
    console.error("Erro durante setup inicial:", error);
  }
};

/**
 * System diagnostic function to check the current state of the setup
 * Useful for troubleshooting issues
 */
export const diagnoseSystemSetup = async (): Promise<Record<string, any>> => {
  try {
    const { data, error } = await supabaseExtended.rpc('diagnose_system_installation');
    
    if (error) {
      console.error("Erro ao diagnosticar sistema:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exceção ao diagnosticar sistema:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Function to manually trigger database repair if needed
 */
export const repairSystemSetup = async (): Promise<boolean> => {
  try {
    // Force a complete rerun of the setup
    const { data, error } = await supabaseExtended.functions.invoke('setup-rls');
    
    if (error) {
      console.error("Erro ao reparar configurações do sistema:", error);
      return false;
    }
    
    console.log("Sistema reparado com sucesso:", data);
    return true;
  } catch (error) {
    console.error("Exceção ao reparar sistema:", error);
    return false;
  }
};
