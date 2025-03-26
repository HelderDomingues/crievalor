
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const asaasApiKey = Deno.env.get("ASAAS_API_KEY") || "";
const asaasApiUrl = "https://sandbox.asaas.com/api/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Obter usuário autenticado
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Teste webhook: Autenticação necessária");
      return new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Teste webhook: Usuário não autenticado", userError);
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado", details: userError }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Usuário autenticado:", user.id);
    
    // Verificar se o usuário é admin - correção na consulta para evitar ambiguidade
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
      'check_if_user_is_admin',
      { user_id: user.id }
    );
    
    if (adminCheckError) {
      console.error("Teste webhook: Erro ao verificar se usuário é admin", adminCheckError);
      return new Response(
        JSON.stringify({ 
          error: "Erro ao verificar permissões de administrador", 
          details: adminCheckError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    if (!isAdmin) {
      console.error("Teste webhook: Usuário não é administrador", user.id);
      return new Response(
        JSON.stringify({ error: "O usuário não possui permissões de administrador" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Usuário é administrador, prosseguindo com teste de webhook");
    
    // Verificar webhooks ativos no Asaas
    if (!asaasApiKey) {
      console.error("Teste webhook: ASAAS_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "API Key do Asaas não configurada no servidor" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const webhooksResponse = await fetch(`${asaasApiUrl}/webhooks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      }
    });
    
    if (!webhooksResponse.ok) {
      const errorData = await webhooksResponse.json();
      console.error("Erro ao obter webhooks:", errorData);
      return new Response(
        JSON.stringify({ 
          error: `Erro ao obter webhooks do Asaas: ${webhooksResponse.status}`,
          details: errorData
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const webhooks = await webhooksResponse.json();
    console.log("Webhooks encontrados:", webhooks.data);
    
    if (!webhooks?.data?.length) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Nenhum webhook configurado no Asaas'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Webhook está configurado e funcionando
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook configurado corretamente",
        webhooks: webhooks.data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Erro ao testar webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
