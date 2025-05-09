
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

/**
 * Insere ou atualiza uma configuração do sistema
 */
export const upsertSystemSetting = async (
  key: string,
  value: string,
  description?: string
): Promise<boolean> => {
  try {
    // Verificar se a configuração já existe
    const { data: existingData, error: fetchError } = await supabaseExtended
      .from("system_settings")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (fetchError) {
      console.error("Erro ao verificar configuração:", fetchError);
      return false;
    }

    // Se já existe, atualizar
    if (existingData) {
      const { error: updateError } = await supabaseExtended
        .from("system_settings")
        .update({
          value,
          description: description || existingData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id);

      if (updateError) {
        console.error("Error updating system setting:", updateError);
        return false;
      }
    } else {
      // Se não existe, inserir novo
      const { error: insertError } = await supabaseExtended
        .from("system_settings")
        .insert({
          key,
          value,
          description: description || `Configuração ${key}`,
        });

      if (insertError) {
        console.error("Error inserting system setting:", insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error upserting system setting:", error);
    return false;
  }
};

/**
 * Busca uma configuração do sistema por chave
 */
export const getSystemSetting = async (key: string): Promise<string | null> => {
  try {
    const { data, error } = await supabaseExtended
      .from("system_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error("Error fetching system setting:", error);
      return null;
    }

    return data?.value || null;
  } catch (error) {
    console.error("Error getting system setting:", error);
    return null;
  }
};

/**
 * Busca todas as configurações do sistema
 */
export const getAllSystemSettings = async () => {
  try {
    const { data, error } = await supabaseExtended
      .from("system_settings")
      .select("*")
      .order("key");

    if (error) {
      console.error("Error fetching all system settings:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error getting all system settings:", error);
    return [];
  }
};
