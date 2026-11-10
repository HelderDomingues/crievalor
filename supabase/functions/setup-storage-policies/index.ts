
import { postCorsHeaders as corsHeaders } from "../_shared/cors.ts";
import { requireAdmin } from "../_shared/require-admin.ts";
import type { SupabaseClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: corsHeaders });
  }

  const access = await requireAdmin(req);
  if (access instanceof Response) return access;

  try {
    const { client: supabase } = access;

    const body = await req.json().catch(() => ({})) as {
      action?: string;
      bucket_name?: string;
      is_public?: boolean;
    };

    const action = body.action || "setup_all";
    const bucketName = body.bucket_name;
    const isPublic = body.is_public ?? true;

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
    console.error("Erro ao configurar políticas de armazenamento:", error);
    return new Response(
      JSON.stringify({ error: "Falha ao configurar políticas de armazenamento" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função para criar um bucket se não existir
async function createBucket(supabase: SupabaseClient, bucketName: string, isPublic = true): Promise<Record<string, unknown>> {
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
        message: `Exception creating bucket ${bucketName}: ${errorMessage(error)}`,
      error: error
    };
  }
}

// Função para configurar políticas de acesso a um bucket
async function setupBucketPolicies(supabase: SupabaseClient, bucketName: string): Promise<Record<string, unknown>> {
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
        message: `Exception setting up policies for bucket ${bucketName}: ${errorMessage(error)}`,
      error: error
    };
  }
}

// Função para configurar todos os buckets necessários
async function setupAllBuckets(supabase: SupabaseClient): Promise<Record<string, unknown>> {
  const buckets = ['clientlogos', 'materials', 'portfolio', 'avatars', 'blog_images'];
  const results: Record<string, unknown> = {};

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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
