
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
  console.log("Setup RLS function invoked");
  
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Inicializar cliente Supabase com chave de serviço para ter permissões de admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Iniciando configuração de políticas RLS");
    
    // Registrar início da configuração no log de instalação
    await supabase.rpc("track_installation_status", {
      component: "setup_rls",
      status: "started",
      message: "Iniciando configuração de políticas RLS"
    });

    // Aplicar políticas RLS para a tabela de subscriptions com melhor tratamento de erros
    let setupSubscriptionsRLS;
    try {
      const { data, error } = await supabase
        .rpc("setup_subscriptions_rls_policies");
        
      if (error) {
        console.error("Erro ao configurar políticas RLS para subscriptions:", error);
        await supabase.rpc("track_installation_status", {
          component: "setup_subscriptions_rls",
          status: "error",
          message: `Erro: ${error.message}`
        });
        setupSubscriptionsRLS = { success: false, error: error.message };
      } else {
        console.log("Políticas RLS para subscriptions configuradas com sucesso");
        await supabase.rpc("track_installation_status", {
          component: "setup_subscriptions_rls",
          status: "success",
          message: "Políticas RLS configuradas com sucesso"
        });
        setupSubscriptionsRLS = { success: true };
      }
    } catch (error) {
      console.error("Exceção ao configurar políticas RLS para subscriptions:", error);
      await supabase.rpc("track_installation_status", {
        component: "setup_subscriptions_rls",
        status: "error",
        message: `Exceção: ${error.message}`
      });
      setupSubscriptionsRLS = { success: false, error: error.message };
    }
    
    // Aplicar políticas RLS para a tabela de asaas_customers com melhor tratamento de erros
    let setupAsaasCustomersRLS;
    try {
      const { data, error } = await supabase
        .rpc("setup_asaas_customers_rls_policies");
      
      if (error) {
        console.error("Erro ao configurar políticas RLS para asaas_customers:", error);
        await supabase.rpc("track_installation_status", {
          component: "setup_asaas_customers_rls",
          status: "error",
          message: `Erro: ${error.message}`
        });
        setupAsaasCustomersRLS = { success: false, error: error.message };
      } else {
        console.log("Políticas RLS para asaas_customers configuradas com sucesso");
        await supabase.rpc("track_installation_status", {
          component: "setup_asaas_customers_rls",
          status: "success",
          message: "Políticas RLS configuradas com sucesso"
        });
        setupAsaasCustomersRLS = { success: true };
      }
    } catch (error) {
      console.error("Exceção ao configurar políticas RLS para asaas_customers:", error);
      await supabase.rpc("track_installation_status", {
        component: "setup_asaas_customers_rls",
        status: "error",
        message: `Exceção: ${error.message}`
      });
      setupAsaasCustomersRLS = { success: false, error: error.message };
    }

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
        message: "Políticas RLS aplicadas com sucesso",
        results: {
          subscriptions: setupSubscriptionsRLS,
          asaas_customers: setupAsaasCustomersRLS
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função para configurar buckets e políticas
async function configureBucketsAndPolicies(supabase) {
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
      const { data: bucketData, error: bucketError } = await supabase
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
      const { data: policyData, error: policyError } = await supabase
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
        message: `Exceção: ${error.message}`
      });
    }
  }
}
