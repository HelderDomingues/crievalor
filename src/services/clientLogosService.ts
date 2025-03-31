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
    console.log("Fetching client logos from Supabase...");
    
    // Get all files from the clientlogos bucket
    const { data: files, error } = await supabaseExtended.storage
      .from('clientlogos')
      .list();
    
    if (error) {
      console.error("Error listing files:", error);
      throw error;
    }
    
    console.log("Files from bucket:", files);
    
    if (!files || files.length === 0) {
      console.log("No logo files found in bucket");
      return [];
    }
    
    // Filter out folders and only keep actual files
    const logoFiles = files.filter(file => !file.name.endsWith('/') && !file.name.startsWith('.'));
    
    console.log("Filtered logo files:", logoFiles);
    
    // Convert file list to ClientLogo objects
    const logos = await Promise.all(logoFiles.map(async (file, index) => {
      // Generate public URL for each file
      const { data: urlData } = supabaseExtended.storage
        .from('clientlogos')
        .getPublicUrl(file.name);
      
      // Use filename as the client name (removing extension)
      const clientName = file.name.split('.').slice(0, -1).join('.');
      
      console.log(`Logo ${index + 1}: ${clientName} - ${urlData.publicUrl}`);
      
      return {
        id: String(index + 1),
        name: clientName || `Client ${index + 1}`,
        logo: urlData.publicUrl
      };
    }));
    
    console.log("Processed logos:", logos);
    return logos;
  } catch (error) {
    console.error('Error fetching client logos:', error);
    return [];
  }
};
