
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

/**
 * Creates a storage bucket if it doesn't exist
 * @param bucketName Name of the bucket to create
 * @param options Optional configuration options
 */
export const createStorageBucketIfNotExists = async (bucketName: string, options = { public: true, fileSizeLimit: 10485760 }) => {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`);
    
    const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
    
    if (listError) {
      console.error(`Error checking buckets: ${listError.message}`);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists.`);
      
      // Update bucket to ensure it's public even if it exists
      const { error: updateError } = await supabaseExtended.storage.updateBucket(bucketName, {
        public: true
      });
      
      if (updateError) {
        console.error(`Error updating bucket ${bucketName}: ${updateError.message}`);
      } else {
        console.log(`Bucket ${bucketName} updated to be public.`);
      }
    } else {
      console.log(`Bucket ${bucketName} not found, attempting to create it.`);
      const { error: createError } = await supabaseExtended.storage.createBucket(bucketName, {
        public: options.public,
        fileSizeLimit: options.fileSizeLimit
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}: ${createError.message}`);
      } else {
        console.log(`Bucket ${bucketName} created successfully.`);
      }
    }
  } catch (error) {
    console.error(`Error setting up ${bucketName} storage bucket:`, error);
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
 * Initialize all required storage buckets and policies
 */
export const initializeStorageBuckets = async () => {
  try {
    console.log("Setting up storage buckets...");
    
    // Create required buckets
    await createClientLogosBucketIfNotExists();
    await createMaterialsBucketIfNotExists();
    await createPortfolioBucketIfNotExists();
    
    // Setup storage policies via edge function
    console.log("Setting up storage policies via edge function...");
    
    // Invoke the setup-storage-policies function without waiting
    supabaseExtended.functions.invoke('setup-storage-policies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(({ data, error }) => {
      if (error) {
        console.error("Error setting up storage policies:", error);
      } else {
        console.log("Storage policies set up successfully:", data);
      }
    }).catch(err => {
      console.error("Failed to invoke setup-storage-policies:", err);
    });
    
    console.log("Storage setup completed");
  } catch (err) {
    console.error("Error initializing storage buckets:", err);
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
