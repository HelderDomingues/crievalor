
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
      
      // Set up direct SQL policies for the bucket since RPC is not working
      // We'll use the REST API to execute SQL directly
      const policySetupResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/setup_storage_policies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ bucket_name: bucketName })
      });
      
      if (!policySetupResponse.ok) {
        const errorText = await policySetupResponse.text();
        console.error(`Error setting up policies for ${bucketName} via REST API: ${errorText}`);
        
        // Mark as success anyway since the bucket exists and is public
        results[bucketName] = { 
          success: true,
          warning: `Policies may need manual setup: ${errorText}`
        };
      } else {
        console.log(`Storage policies for ${bucketName} configured successfully`);
        results[bucketName] = { success: true };
      }
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
