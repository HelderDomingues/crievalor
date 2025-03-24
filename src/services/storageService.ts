
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export const createStorageBucketIfNotExists = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabaseExtended.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }

    const materialsBucketExists = buckets?.some(bucket => bucket.name === 'materials');
    
    if (!materialsBucketExists) {
      // Create the materials bucket
      const { error: createError } = await supabaseExtended.storage.createBucket('materials', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        throw createError;
      }
      
      console.log('Materials storage bucket created');
    }
  } catch (error) {
    console.error('Error setting up materials storage bucket:', error);
  }
};
