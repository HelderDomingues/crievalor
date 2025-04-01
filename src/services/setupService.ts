
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { initializeStorageBuckets } from "./storageService";

/**
 * Helper function to execute initial setup tasks for the application
 */
export const executeInitialSetup = async (): Promise<void> => {
  try {
    console.log("Executando setup inicial da aplicação...");
    
    // Set up storage buckets and policies
    console.log("Configurando buckets de armazenamento...");
    await initializeStorageBuckets();
    
    // Set up RLS policies for other tables
    console.log("Configurando políticas RLS...");
    const { data: rlsData, error: rlsError } = await supabaseExtended.functions.invoke('setup-rls');
    
    if (rlsError) {
      console.error("Erro ao configurar políticas RLS:", rlsError);
    } else {
      console.log("Políticas RLS configuradas:", rlsData);
    }
    
    console.log("Setup inicial concluído com sucesso");
  } catch (error) {
    console.error("Erro durante setup inicial:", error);
  }
};

// Don't auto-execute on import, this will be called from main.tsx in the proper sequence
// executeInitialSetup().catch(console.error);
