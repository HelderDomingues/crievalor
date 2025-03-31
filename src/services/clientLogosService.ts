
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
    // Get all files from the clientlogos bucket
    const { data: files, error } = await supabaseExtended.storage
      .from('clientlogos')
      .list();
    
    if (error) {
      throw error;
    }
    
    // Convert file list to ClientLogo objects
    const logos = files.map((file, index) => {
      // Generate public URL for each file
      const { data: urlData } = supabaseExtended.storage
        .from('clientlogos')
        .getPublicUrl(file.name);
      
      // Use filename as the client name (removing extension)
      const clientName = file.name.split('.').slice(0, -1).join('.');
      
      return {
        id: String(index + 1),
        name: clientName || `Client ${index + 1}`,
        logo: urlData.publicUrl
      };
    });
    
    return logos;
  } catch (error) {
    console.error('Error fetching client logos:', error);
    return [];
  }
};
