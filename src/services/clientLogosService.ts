
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
  try {
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }

    const logosBucketExists = buckets?.some(bucket => bucket.name === 'logos');
    
    if (!logosBucketExists) {
      // Create the logos bucket
      const { error: createError } = await supabaseExtended.storage.createBucket('logos', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        throw createError;
      }
      
      console.log('Logos storage bucket created');
    }
  } catch (error) {
    console.error('Error setting up logos storage bucket:', error);
  }
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
 * Saves client logos to the database
 * Note: In a real implementation, this would save to a database table
 */
export const saveClientLogos = async (logos: ClientLogo[]) => {
  // In a real implementation, this would save to a database
  // For this example, we'll just log the logos
  console.log('Saving client logos:', logos);
  
  // Return a success response
  return { success: true, error: null };
};
