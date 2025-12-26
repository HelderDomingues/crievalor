
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configurações do Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req) => {
  console.log("Setup storage policies function loaded");

  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Inicializar cliente Supabase com chave de serviço para ter permissões de admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const action = body.action || "setup_all";
    const bucketName = body.bucket_name;
    const isPublic = body.is_public || true;

    let result = {};

    // Com base na ação solicitada, realizar a operação correspondente
    if (action === "create_bucket" && bucketName) {
      result = await createBucket(supabase, bucketName, isPublic);
    }
    else if (action === "setup_policies" && bucketName) {
      result = await setupBucketPolicies(supabase, bucketName);
    }
    else {
      // Configuração padrão - configurar todos os buckets necessários
      result = await setupAllBuckets(supabase);
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Erro ao configurar políticas: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função para criar um bucket se não existir
async function createBucket(supabase, bucketName, isPublic = true) {
  try {
    // Verificar se o bucket já existe
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) {
      return {
        success: false,
        message: `Error listing buckets: ${listError.message}`,
        error: listError
      };
    }

    const bucketExists = existingBuckets.some(bucket => bucket.name === bucketName);

    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return {
        success: true,
        message: `Bucket ${bucketName} already exists`,
        exists: true
      };
    }

    // Criar bucket se não existir
    const { data, error } = await supabase
      .storage
      .createBucket(bucketName, {
        public: isPublic
      });

    if (error) {
      return {
        success: false,
        message: `Error creating bucket ${bucketName}: ${error.message}`,
        error: error
      };
    }

    return {
      success: true,
      message: `Bucket ${bucketName} created successfully`,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: `Exception creating bucket ${bucketName}: ${error.message}`,
      error: error
    };
  }
}

// Função para configurar políticas de acesso a um bucket
async function setupBucketPolicies(supabase, bucketName) {
  try {
    const { data, error } = await supabase.rpc('setup_storage_bucket_policies', {
      bucket_name: bucketName
    });

    if (error) {
      return {
        success: false,
        message: `Error setting up policies for bucket ${bucketName}: ${error.message}`,
        error: error
      };
    }

    return {
      success: true,
      message: `Policies configured successfully for bucket ${bucketName}`,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: `Exception setting up policies for bucket ${bucketName}: ${error.message}`,
      error: error
    };
  }
}

// Função para configurar todos os buckets necessários
async function setupAllBuckets(supabase) {
  const buckets = ['clientlogos', 'materials', 'portfolio', 'avatars', 'blog_images'];
  const results = {};

  for (const bucket of buckets) {
    console.log(`Setting up ${bucket} bucket...`);

    // Criar bucket
    const createResult = await createBucket(supabase, bucket, true);
    results[`${bucket}_create`] = createResult;

    // Configurar políticas
    if (createResult.success) {
      const policiesResult = await setupBucketPolicies(supabase, bucket);
      results[`${bucket}_policies`] = policiesResult;
    }
  }

  return {
    success: true,
    message: "Storage buckets and policies setup completed",
    results: results
  };
}
