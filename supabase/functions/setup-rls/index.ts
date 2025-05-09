
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
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("Iniciando configuração de políticas RLS");
    
    // Inicializar cliente Supabase com chave de serviço para ter permissões de admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Aplicar políticas RLS para a tabela de subscriptions
    const { data: setupSubscriptionsRLS, error: subscriptionsError } = await supabase
      .rpc("setup_subscriptions_rls_policies");
      
    if (subscriptionsError) {
      console.error("Erro ao configurar políticas RLS para subscriptions:", subscriptionsError);
      throw subscriptionsError;
    }
    
    // Aplicar políticas RLS para a tabela de asaas_customers
    const { data: setupAsaasCustomersRLS, error: asaasError } = await supabase
      .rpc("setup_asaas_customers_rls_policies");
    
    if (asaasError) {
      console.error("Erro ao configurar políticas RLS para asaas_customers:", asaasError);
      throw asaasError;
    }
    
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
