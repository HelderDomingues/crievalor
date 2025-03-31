
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

/**
 * Helper function to execute initial setup tasks for the application
 */
export const executeInitialSetup = async (): Promise<void> => {
  try {
    console.log("Executando setup inicial da aplicação...");
    
    // Set up storage buckets and policies
    const { data: storageData, error: storageError } = await supabaseExtended.functions.invoke('setup-storage-policies');
    
    if (storageError) {
      console.error("Erro ao configurar políticas de armazenamento:", storageError);
    } else {
      console.log("Políticas de armazenamento configuradas:", storageData);
    }
    
    // Set up RLS policies for other tables
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

// Execute setup on module import
executeInitialSetup().catch(console.error);
