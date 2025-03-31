
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export const createStorageBucketIfNotExists = async (bucketName: string, options = { public: true, fileSizeLimit: 10485760 }) => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabaseExtended.storage.createBucket(bucketName, options);
      
      if (createError) {
        throw createError;
      }
      
      console.log(`Storage bucket '${bucketName}' created`);
    }
  } catch (error) {
    console.error(`Error setting up ${bucketName} storage bucket:`, error);
  }
};

// Specific function for materials bucket for backward compatibility
export const createMaterialsBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('materials', {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  });
};
