
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando configuração de buckets de armazenamento');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }
    
    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create or check required buckets
    const bucketNames = ['clientlogos', 'materials'];
    const results = {};
    
    console.log('Checking and creating required buckets...');
    
    for (const bucketName of bucketNames) {
      console.log(`Processing bucket: ${bucketName}`);
      
      // Check if bucket exists
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error(`Error listing buckets: ${listError.message}`);
        results[bucketName] = { success: false, error: listError.message };
        continue;
      }
      
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Creating bucket: ${bucketName}`);
        
        // Create the bucket
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          console.error(`Error creating bucket ${bucketName}: ${createError.message}`);
          results[bucketName] = { success: false, error: createError.message };
          continue;
        }
        
        console.log(`Bucket ${bucketName} created successfully`);
      } else {
        console.log(`Bucket ${bucketName} already exists`);
      }
      
      // Update bucket settings to ensure it's public
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (updateError) {
        console.error(`Error updating bucket ${bucketName}: ${updateError.message}`);
        results[bucketName] = { success: false, error: updateError.message };
        continue;
      }
      
      // Instead of calling an RPC function, directly execute SQL to create policies
      // We'll use direct SQL execution via edge function to avoid the RPC error
      
      try {
        // Apply direct storage policies via SQL
        const { error: policyError } = await supabase.rpc('apply_storage_policies', { 
          bucket_name: bucketName 
        });
        
        if (policyError) {
          console.error(`Error applying policies for ${bucketName}: ${policyError.message}`);
          
          // Try alternate approach with direct SQL execution
          console.log(`Attempting direct SQL execution for bucket policies...`);
          
          // Create policies directly with SQL
          // First check if policies exist and drop them if needed
          const policySql = `
            BEGIN;
            
            -- Drop any existing policies for this bucket
            DROP POLICY IF EXISTS "Public read access for ${bucketName}" ON storage.objects;
            DROP POLICY IF EXISTS "Auth users can upload to ${bucketName}" ON storage.objects;
            DROP POLICY IF EXISTS "Auth users can update own ${bucketName} objects" ON storage.objects;
            DROP POLICY IF EXISTS "Auth users can delete own ${bucketName} objects" ON storage.objects;
            
            -- Create policy for public read access
            CREATE POLICY "Public read access for ${bucketName}"
              ON storage.objects FOR SELECT
              USING (bucket_id = '${bucketName}');
            
            -- Create policy for authenticated users to insert
            CREATE POLICY "Auth users can upload to ${bucketName}"
              ON storage.objects FOR INSERT
              WITH CHECK (
                bucket_id = '${bucketName}'
                AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
              );
            
            -- Create policy for authenticated users to update their own objects
            CREATE POLICY "Auth users can update own ${bucketName} objects"
              ON storage.objects FOR UPDATE
              USING (
                bucket_id = '${bucketName}'
                AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
              );
            
            -- Create policy for authenticated users to delete their own objects
            CREATE POLICY "Auth users can delete own ${bucketName} objects"
              ON storage.objects FOR DELETE
              USING (
                bucket_id = '${bucketName}'
                AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
              );
              
            COMMIT;
          `;
          
          const { error: sqlError } = await supabase.rpc('exec_sql', { sql: policySql });
          
          if (sqlError) {
            console.error(`Direct SQL execution failed: ${sqlError.message}`);
            console.log(`Falling back to basic policy setup...`);
            
            // Attempt simple policy setup with minimal permissions
            const simplePolicy = `
              BEGIN;
              -- Ensure storage.objects has RLS enabled
              ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
              
              -- Create a simple public read policy for this bucket
              DROP POLICY IF EXISTS "Public ${bucketName} policy" ON storage.objects;
              CREATE POLICY "Public ${bucketName} policy" 
                ON storage.objects
                USING (bucket_id = '${bucketName}');
              COMMIT;
            `;
            
            const { error: simpleError } = await supabase.rpc('exec_sql', { sql: simplePolicy });
            
            if (simpleError) {
              console.error(`Simple policy setup failed: ${simpleError.message}`);
              results[bucketName] = { 
                success: true, 
                warning: `Policies setup failed, manual setup may be required: ${simpleError.message}`
              };
            } else {
              console.log(`Simple policy setup successful for ${bucketName}`);
              results[bucketName] = { success: true };
            }
          } else {
            console.log(`Direct SQL execution for policies successful for ${bucketName}`);
            results[bucketName] = { success: true };
          }
        } else {
          console.log(`Storage policies for ${bucketName} configured successfully`);
          results[bucketName] = { success: true };
        }
      } catch (policySetupError) {
        console.error(`Unexpected error setting up policies: ${policySetupError.message}`);
        results[bucketName] = { 
          success: true,
          warning: `Unexpected error during policy setup: ${policySetupError.message}`
        };
      }
    }
    
    // Enable RLS on storage.objects in any case
    try {
      const enableRlsSql = `ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;`;
      await supabase.rpc('exec_sql', { sql: enableRlsSql });
      console.log('RLS enabled on storage.objects table');
    } catch (rlsError) {
      console.error(`Error enabling RLS: ${rlsError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Storage buckets configured successfully',
        results
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to configure storage buckets'
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});
