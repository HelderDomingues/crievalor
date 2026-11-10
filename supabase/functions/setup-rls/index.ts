
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
    console.log("Iniciando configuração de políticas RLS");
    
    // Registrar início da configuração no log de instalação
    await supabase.rpc("track_installation_status", {
      component: "setup_rls",
      status: "started",
      message: "Iniciando configuração de políticas RLS"
    });

    // Configurar buckets de armazenamento
    await configureBucketsAndPolicies(supabase);
    
    // Registrar conclusão da configuração
    await supabase.rpc("track_installation_status", {
      component: "setup_rls",
      status: "completed",
      message: "Configuração de políticas RLS concluída"
    });
    
    console.log("Políticas RLS configuradas com sucesso");
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Políticas RLS aplicadas com sucesso"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Erro ao configurar políticas RLS:", error);
    return new Response(
      JSON.stringify({ error: "Falha ao configurar políticas RLS" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função para configurar buckets e políticas
async function configureBucketsAndPolicies(supabase: SupabaseClient) {
  const buckets = ['clientlogos', 'materials', 'portfolio', 'avatars'];
  
  for (const bucket of buckets) {
    console.log(`Configurando bucket ${bucket}...`);
    
    try {
      // Registrar início da configuração
      await supabase.rpc("track_installation_status", {
        component: `setup_bucket_${bucket}`,
        status: "started",
        message: `Iniciando configuração do bucket ${bucket}`
      });
      
      // Criar bucket
      const { error: bucketError } = await supabase
        .rpc("create_bucket_if_not_exists", {
          bucket_name: bucket,
          is_public: true
        });
      
      if (bucketError) {
        console.error(`Erro ao criar/atualizar bucket ${bucket}:`, bucketError);
        await supabase.rpc("track_installation_status", {
          component: `setup_bucket_${bucket}`,
          status: "error",
          message: `Erro ao criar/atualizar bucket: ${bucketError.message}`
        });
        continue;
      }
      
      // Configurar políticas
      const { error: policyError } = await supabase
        .rpc("setup_storage_bucket_policies", {
          bucket_name: bucket
        });
      
      if (policyError) {
        console.error(`Erro ao configurar políticas para ${bucket}:`, policyError);
        await supabase.rpc("track_installation_status", {
          component: `setup_bucket_policies_${bucket}`,
          status: "error",
          message: `Erro ao configurar políticas: ${policyError.message}`
        });
      } else {
        console.log(`Políticas para ${bucket} configuradas com sucesso`);
        await supabase.rpc("track_installation_status", {
          component: `setup_bucket_${bucket}`,
          status: "success",
          message: `Bucket ${bucket} e políticas configurados com sucesso`
        });
      }
    } catch (error) {
      console.error(`Exceção ao configurar ${bucket}:`, error);
      await supabase.rpc("track_installation_status", {
        component: `setup_bucket_${bucket}`,
        status: "error",
        message: `Exceção: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
}
