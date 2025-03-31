
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
      
      // For public buckets, add a policy for public read access
      if (options.public) {
        try {
          // Try to add a public read policy for the bucket
          const { error: policyError } = await supabaseExtended.rpc('create_storage_policy', {
            bucket_name: bucketName,
            policy_name: `Public Read Access for ${bucketName}`,
            policy_definition: `(bucket_id = '${bucketName}'::text)`,
            policy_operation: 'SELECT'
          });
          
          if (policyError) {
            console.error(`Error creating public read policy for ${bucketName}:`, policyError);
          } else {
            console.log(`Created public read policy for ${bucketName}`);
          }
        } catch (policyErr) {
          console.error(`Failed to create storage policy for ${bucketName}:`, policyErr);
        }
      }
    }
  } catch (error) {
    console.error(`Error setting up ${bucketName} storage bucket:`, error);
  }
};

// Create the clientlogos bucket if it doesn't exist
export const createClientLogosBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('clientlogos', {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  });
};

// Specific function for materials bucket for backward compatibility
export const createMaterialsBucketIfNotExists = async () => {
  return createStorageBucketIfNotExists('materials', {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  });
};

// Create required buckets when service is imported
export const initializeStorageBuckets = async () => {
  await createClientLogosBucketIfNotExists();
  await createMaterialsBucketIfNotExists();
};

// Initialize buckets if this module is imported directly
initializeStorageBuckets().catch(console.error);
