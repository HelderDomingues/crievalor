
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export const createStorageBucketIfNotExists = async (bucketName: string, options = { public: true, fileSizeLimit: 10485760 }) => {
  try {
    // For client-side usage, just check if the bucket exists
    // The actual creation is handled by the edge function
    console.log(`Checking if bucket ${bucketName} exists...`);
    
    const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
    
    if (listError) {
      console.error(`Error checking buckets: ${listError.message}`);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists.`);
    } else {
      console.log(`Bucket ${bucketName} not found. Will attempt to create via edge function.`);
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
    // Use the extended client to correctly invoke the function with authentication
    console.log("Setting up storage buckets via edge function...");
    
    // Ensure storage.objects table has RLS enabled
    console.log("Calling setup-storage-policies edge function...");
    const { data, error } = await supabaseExtended.functions.invoke('setup-storage-policies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error setting up storage policies:", error);
    } else {
      console.log("Storage policies set up successfully:", data);
    }
    
    // Check bucket existence locally (won't create)
    await createClientLogosBucketIfNotExists();
    await createMaterialsBucketIfNotExists();
  } catch (err) {
    console.error("Error initializing storage buckets:", err);
  }
};

// Initialize buckets if this module is imported directly
// initializeStorageBuckets().catch(console.error);
// Do not auto-initialize here, we'll do it in a controlled sequence
