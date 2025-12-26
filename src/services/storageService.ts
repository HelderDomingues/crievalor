
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a storage bucket if it doesn't exist using the safer function
 * @param bucketName Name of the bucket to create
 * @param options Optional configuration options
 */
export const createStorageBucketIfNotExists = async (bucketName: string, options = { public: true, fileSizeLimit: 10485760 }) => {
  try {
    console.log(`Verificando/criando bucket ${bucketName}...`);

    // Use direct SQL query through Edge Function instead of RPC
    const { data, error } = await supabaseExtended.functions.invoke('setup-storage-policies', {
      body: {
        action: 'create_bucket',
        bucket_name: bucketName,
        is_public: options.public
      }
    });

    if (error) {
      console.error(`Erro ao criar/verificar bucket ${bucketName}: ${error.message}`);
      return false;
    }

    console.log(`Bucket ${bucketName} configurado com sucesso`);

    // Configurar políticas para o bucket
    const { data: policyData, error: policyError } = await supabaseExtended.functions.invoke('setup-storage-policies', {
      body: {
        action: 'setup_policies',
        bucket_name: bucketName
      }
    });

    if (policyError) {
      console.error(`Erro ao configurar políticas para ${bucketName}: ${policyError.message}`);
      return false;
    }

    console.log(`Políticas para ${bucketName} configuradas com sucesso`);
    return true;
  } catch (error) {
    console.error(`Erro ao configurar bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * Create the clientlogos bucket if it doesn't exist
 */
export const createClientLogosBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('clientlogos', {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  });
};

/**
 * Create the materials bucket if it doesn't exist
 */
export const createMaterialsBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('materials', {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  });
};

/**
 * Create the portfolio bucket if it doesn't exist
 */
export const createPortfolioBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('portfolio', {
    public: true,
    fileSizeLimit: 20971520 // 20MB
  });
};

/**
 * Create the avatars bucket if it doesn't exist
 */
export const createAvatarsBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('avatars', {
    public: true,
    fileSizeLimit: 5242880 // 5MB
  });
};

/**
 * Create the blog_images bucket if it doesn't exist
 */
export const createBlogImagesBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('blog_images', {
    public: true,
    fileSizeLimit: 5242880 // 5MB
  });
};

/**
 * Initialize all required storage buckets
 * Uses the improved setup-rls unified function
 */
export const initializeStorageBuckets = async () => {
  try {
    console.log("Setting up storage buckets...");

    // This will be handled by the setup-rls function, but we'll call it here
    // for backward compatibility and debug purposes
    const { data, error } = await supabaseExtended.functions.invoke('setup-rls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      console.error("Error setting up storage and RLS policies:", error);
      return false;
    } else {
      console.log("Storage and RLS policies set up successfully:", data);
      return true;
    }
  } catch (err) {
    console.error("Error initializing storage buckets:", err);
    return false;
  }
};

/**
 * Upload an image to the portfolio storage bucket
 * @param file File to upload
 * @returns URL of the uploaded image
 */
export const uploadPortfolioImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabaseExtended.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseExtended.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading portfolio image:', error);
    throw error;
  }
};

/**
 * Delete an image from the portfolio storage bucket
 * @param url URL of the image to delete
 */
export const deletePortfolioImage = async (url: string): Promise<void> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const path = urlParts[urlParts.length - 1];

    if (!path) throw new Error('Invalid URL');

    const { error } = await supabaseExtended.storage
      .from('portfolio')
      .remove([path]);

    if (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting portfolio image:', error);
    throw error;
  }
};
