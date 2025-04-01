
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
    // First, manually create the buckets locally if they don't exist
    // This is a fallback in case the edge function fails
    try {
      const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
      
      if (!listError) {
        // Check if clientlogos bucket exists, create it if not
        if (!buckets?.some(bucket => bucket.name === 'clientlogos')) {
          const { error } = await supabaseExtended.storage.createBucket('clientlogos', {
            public: true
          });
          
          if (!error) {
            console.log("Created clientlogos bucket manually");
          }
        } else {
          // Update bucket to ensure it's public
          await supabaseExtended.storage.updateBucket('clientlogos', {
            public: true
          });
        }
        
        // Check if materials bucket exists, create it if not
        if (!buckets?.some(bucket => bucket.name === 'materials')) {
          const { error } = await supabaseExtended.storage.createBucket('materials', {
            public: true
          });
          
          if (!error) {
            console.log("Created materials bucket manually");
          }
        } else {
          // Update bucket to ensure it's public
          await supabaseExtended.storage.updateBucket('materials', {
            public: true
          });
        }
      }
    } catch (err) {
      console.error("Error creating buckets manually:", err);
    }

    // Use the extended client to correctly invoke the function with authentication
    console.log("Setting up storage buckets via edge function...");
    
    // Try to call the setup-storage-policies function, but don't wait for it
    // This is to avoid blocking the app initialization if the function fails
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

// Initialize buckets if this module is imported directly
// initializeStorageBuckets().catch(console.error);
// Do not auto-initialize here, we'll do it in a controlled sequence
