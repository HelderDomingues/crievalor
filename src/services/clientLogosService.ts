
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export interface ClientLogo {
  id?: string;
  name: string;
  logo: string;
}

/**
 * Fetches client logos from the Supabase storage bucket
 */
export const fetchClientLogos = async (): Promise<ClientLogo[]> => {
  try {
    console.log("Iniciando busca de logos dos clientes...");
    
    // Get all files from the clientlogos bucket
    const { data: files, error } = await supabaseExtended.storage
      .from('clientlogos')
      .list();
    
    if (error) {
      console.error("Erro ao listar arquivos:", error);
      throw error;
    }
    
    console.log("Arquivos encontrados no bucket:", files);
    
    if (!files || files.length === 0) {
      console.log("Nenhum arquivo de logo encontrado no bucket");
      return [];
    }
    
    // Filter out folders and only keep actual image files
    const logoFiles = files.filter(file => 
      !file.name.endsWith('/') && 
      !file.name.startsWith('.') && 
      (file.name.toLowerCase().endsWith('.png') || 
       file.name.toLowerCase().endsWith('.jpg') || 
       file.name.toLowerCase().endsWith('.jpeg') || 
       file.name.toLowerCase().endsWith('.svg') || 
       file.name.toLowerCase().endsWith('.gif'))
    );
    
    console.log("Arquivos de logo filtrados:", logoFiles);
    
    // Convert file list to ClientLogo objects
    const logos = await Promise.all(logoFiles.map(async (file, index) => {
      // Generate public URL for each file
      const { data: urlData } = supabaseExtended.storage
        .from('clientlogos')
        .getPublicUrl(file.name);
      
      const publicUrl = urlData.publicUrl + '?t=' + new Date().getTime(); // Add cache-busting parameter
      
      // Use filename as the client name (removing extension)
      const clientName = file.name.split('.').slice(0, -1).join('.');
      
      console.log(`Logo ${index + 1}: ${clientName} - ${publicUrl}`);
      
      return {
        id: String(index + 1),
        name: clientName || `Cliente ${index + 1}`,
        logo: publicUrl
      };
    }));
    
    console.log("Logos processados:", logos);
    return logos;
  } catch (error) {
    console.error('Erro ao buscar logos dos clientes:', error);
    return [];
  }
};

/**
 * Uploads a logo file to the Supabase storage
 */
export const uploadClientLogo = async (file: File, name: string): Promise<{url: string | null; error: Error | null}> => {
  try {
    if (!file) {
      return { url: null, error: new Error("Nenhum arquivo fornecido") };
    }
    
    console.log("Iniciando upload de logo:", name, file.type);
    
    // Sanitize the filename
    const sanitizedName = name.trim().replace(/\s+/g, '_').toLowerCase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${sanitizedName}.${fileExt}`;
    
    // Upload file to clientlogos bucket
    const { error: uploadError } = await supabaseExtended.storage
      .from('clientlogos')
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      return { url: null, error: uploadError };
    }
    
    // Get the public URL
    const { data: urlData } = supabaseExtended.storage
      .from('clientlogos')
      .getPublicUrl(fileName);
    
    // Add cache-busting query parameter
    const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
    
    console.log("Upload concluído com sucesso. URL:", publicUrl);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Erro inesperado durante upload:", error);
    return { url: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

/**
 * Deletes a logo file from Supabase storage
 */
export const deleteClientLogo = async (fileName: string): Promise<{success: boolean; error: Error | null}> => {
  try {
    console.log("Tentando remover logo:", fileName);
    
    // Extract the filename from a URL if needed
    const fileNameOnly = fileName.includes('/') 
      ? fileName.split('/').pop()?.split('?')[0] // Also remove query params if present
      : fileName;
    
    if (!fileNameOnly) {
      return { success: false, error: new Error("Nome de arquivo inválido") };
    }
    
    const { error } = await supabaseExtended.storage
      .from('clientlogos')
      .remove([fileNameOnly]);
    
    if (error) {
      console.error("Erro ao remover logo:", error);
      return { success: false, error };
    }
    
    console.log("Logo removido com sucesso:", fileNameOnly);
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro inesperado ao remover logo:", error);
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
