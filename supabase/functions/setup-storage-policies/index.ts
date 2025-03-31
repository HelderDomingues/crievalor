
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
    console.log('Iniciando configuração de políticas para buckets de armazenamento');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create the clientlogos bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }
    
    const bucketNames = ['clientlogos', 'materials'];
    const results: Record<string, any> = {};
    
    for (const bucketName of bucketNames) {
      console.log(`Checking bucket: ${bucketName}`);
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Creating bucket: ${bucketName}`);
        
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          results[bucketName] = { success: false, error: createError.message };
          console.error(`Error creating bucket ${bucketName}:`, createError);
          continue;
        }
      }
      
      // Set up storage policy for public read access
      const { error: policyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: `Public Read Access for ${bucketName}`,
        policy_definition: `bucket_id = '${bucketName}'`,
        policy_operation: 'SELECT'
      });
      
      if (policyError) {
        results[bucketName] = { success: false, error: policyError.message };
        console.error(`Error creating policy for ${bucketName}:`, policyError);
      } else {
        results[bucketName] = { success: true };
        console.log(`Storage policies configured for ${bucketName}`);
      }
      
      // Add additional policies for authenticated users
      const policyOperations = ['INSERT', 'UPDATE', 'DELETE'];
      
      for (const operation of policyOperations) {
        const { error: authPolicyError } = await supabase.rpc('create_storage_policy', {
          bucket_name: bucketName,
          policy_name: `Auth ${operation} Access for ${bucketName}`,
          policy_definition: `(bucket_id = '${bucketName}' AND auth.role() = 'authenticated')`,
          policy_operation: operation
        });
        
        if (authPolicyError && !authPolicyError.message.includes('already exists')) {
          console.error(`Error creating ${operation} policy for ${bucketName}:`, authPolicyError);
        } else {
          console.log(`${operation} policy configured for ${bucketName}`);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Storage policies configured successfully',
        results 
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error setting up storage policies:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to configure storage policies' 
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});
