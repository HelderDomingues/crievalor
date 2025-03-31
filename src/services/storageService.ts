
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export const createStorageBucketIfNotExists = async (bucketName: string, options = { public: true, fileSizeLimit: 10485760 }) => {
  try {
    // Instead of trying to create buckets directly (which requires admin privileges),
    // we'll invoke the edge function to handle this securely
    console.log(`Checking if bucket ${bucketName} exists...`);
    
    // For client-side usage, just check if the bucket exists
    // The actual creation is handled by the edge function
    const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
    
    if (listError) {
      console.error(`Error checking buckets: ${listError.message}`);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} does not exist yet. It will be created by the edge function.`);
    } else {
      console.log(`Bucket ${bucketName} already exists.`);
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
  try {
    // Invoke the edge function to set up storage policies
    const { error } = await supabaseExtended.functions.invoke('setup-storage-policies');
    if (error) {
      console.error("Error setting up storage policies:", error);
    } else {
      console.log("Storage policies set up successfully");
    }
    
    // Check bucket existence locally (won't create)
    await createClientLogosBucketIfNotExists();
    await createMaterialsBucketIfNotExists();
  } catch (err) {
    console.error("Error initializing storage buckets:", err);
  }
};

// Initialize buckets if this module is imported directly
initializeStorageBuckets().catch(console.error);
