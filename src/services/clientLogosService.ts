
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { createStorageBucketIfNotExists } from "@/services/storageService";

export interface ClientLogo {
  id?: string;
  name: string;
  logo: string;
}

/**
 * Creates the logos storage bucket if it doesn't exist
 */
export const createLogosBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('logos', {
    public: true,
    fileSizeLimit: 5242880 // 5MB
  });
};

/**
 * Uploads a logo image to the storage bucket
 */
export const uploadLogoImage = async (file: File) => {
  try {
    // Make sure the logos bucket exists
    await createLogosBucketIfNotExists();
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabaseExtended.storage
      .from('logos')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabaseExtended.storage
      .from('logos')
      .getPublicUrl(filePath);
    
    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading logo image:', error);
    return { url: null, error };
  }
};

/**
 * Fetches client logos from the database
 */
export const fetchClientLogos = async (): Promise<ClientLogo[]> => {
  try {
    const { data, error } = await supabaseExtended
      .from('client_logos')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return data as ClientLogo[] || [];
  } catch (error) {
    console.error('Error fetching client logos:', error);
    return [];
  }
};

/**
 * Saves client logos to the database
 */
export const saveClientLogos = async (logos: ClientLogo[]) => {
  try {
    // Clear existing logos
    const { error: deleteError } = await supabaseExtended
      .from('client_logos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Insert new logos
    const { error: insertError } = await supabaseExtended
      .from('client_logos')
      .insert(logos.map(logo => ({
        name: logo.name,
        logo: logo.logo
      })));
    
    if (insertError) {
      throw insertError;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving client logos:', error);
    return { success: false, error };
  }
};
