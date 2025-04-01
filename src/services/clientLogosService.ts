
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  created_at: string;
}

/**
 * Fetches client logos from the database
 * @returns {Promise<ClientLogo[]>} Promise that resolves to an array of client logos
 */
export const fetchClientLogos = async (): Promise<ClientLogo[]> => {
  try {
    console.log("Fetching client logos...");
    const { data, error } = await supabaseExtended
      .from("client_logos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client logos:", error);
      throw new Error(`Failed to fetch client logos: ${error.message}`);
    }

    // Debug logs para diagnóstico
    console.log("Client logos data from DB:", data);

    // Processar cada logo para obter a URL pública
    const processedLogos = await Promise.all(
      (data || []).map(async (logo) => {
        try {
          // Verificar se o logo.logo_path existe
          if (!logo.logo) {
            console.warn(`Logo ${logo.id} has no logo defined`);
            return {
              ...logo,
              logo: "/placeholder.svg" // Placeholder para logos sem imagem
            };
          }

          // For logos that are already full URLs, just return them
          if (logo.logo.startsWith('http')) {
            return logo;
          }

          // Get public URL for logo stored in Supabase
          const { data: publicUrl } = supabaseExtended.storage
            .from("clientlogos")
            .getPublicUrl(logo.logo);

          console.log(`Logo ${logo.id} public URL:`, publicUrl);

          return {
            id: logo.id,
            name: logo.name,
            logo: publicUrl.publicUrl,
            created_at: logo.created_at
          };
        } catch (logoError) {
          console.error(`Error processing logo ${logo.id}:`, logoError);
          return {
            ...logo,
            logo: "/placeholder.svg" // Fallback para erro
          };
        }
      })
    );

    console.log("Processed logos:", processedLogos);
    return processedLogos;
  } catch (error) {
    console.error("Error in fetchClientLogos:", error);
    throw error;
  }
};

/**
 * Uploads a client logo image to storage and creates a record in the database
 */
export const addClientLogo = async (name: string, file: File): Promise<void> => {
  try {
    // Gerar um nome de arquivo único para evitar colisões
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = `${fileName}`;

    // Upload do arquivo para o bucket 'clientlogos'
    const { error: uploadError } = await supabaseExtended.storage
      .from('clientlogos')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }

    // Inserir registro no banco de dados
    const { error: insertError } = await supabaseExtended
      .from('client_logos')
      .insert({
        name,
        logo: filePath
      });

    if (insertError) {
      console.error("Error inserting logo record:", insertError);
      
      // Tentar remover o arquivo já enviado em caso de erro
      await supabaseExtended.storage
        .from('clientlogos')
        .remove([filePath]);
        
      throw new Error(`Failed to create logo record: ${insertError.message}`);
    }
  } catch (error) {
    console.error("Error in addClientLogo:", error);
    throw error;
  }
};

/**
 * Deletes a client logo from storage and database
 */
export const deleteClientLogo = async (id: string, logoPath: string): Promise<void> => {
  try {
    // Remover o registro do banco de dados
    const { error: deleteError } = await supabaseExtended
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error("Error deleting logo record:", deleteError);
      throw new Error(`Failed to delete logo record: ${deleteError.message}`);
    }

    // Se tiver um caminho de arquivo, remover do storage
    if (logoPath) {
      const { error: storageError } = await supabaseExtended.storage
        .from('clientlogos')
        .remove([logoPath]);

      if (storageError) {
        console.warn("Error removing logo file, but database record was deleted:", storageError);
      }
    }
  } catch (error) {
    console.error("Error in deleteClientLogo:", error);
    throw error;
  }
};
