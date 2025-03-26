import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
let asaasApiKey = "";
const asaasApiUrl = "https://sandbox.asaas.com/api/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("==== INÍCIO DO TESTE DE WEBHOOK ====");
    console.log("Iniciando teste de webhook com Asaas");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: settingData, error: settingError } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'ASAAS_API_KEY')
      .single();
    
    if (settingError) {
      console.error("Erro ao buscar chave da API:", settingError);
      throw new Error("API Key do Asaas não encontrada no banco de dados");
    }
    
    asaasApiKey = settingData.value;
    
    if (!asaasApiKey) {
      console.error("Teste webhook: ASAAS_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "API Key do Asaas não configurada" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("ASAAS_API_KEY está configurada, verificando autenticação do usuário");
    console.log(`ASAAS_API_URL: ${asaasApiUrl}`);
    console.log(`Usando Supabase URL: ${supabaseUrl}`);
    
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
    console.log("Token de autenticação obtido, verificando usuário");
    
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
    
    // Verificar se o usuário é admin - usando função RPC para evitar ambiguidade
    console.log("Verificando permissões de administrador para o usuário:", user.id);
    
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
      'check_if_user_is_admin',
      { user_id: user.id }
    );
    
    console.log("Resultado da verificação de admin:", { isAdmin, error: adminCheckError });
    
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
    console.log("Fazendo requisição para o Asaas para verificar webhooks");
    console.log(`URL da requisição: ${asaasApiUrl}/webhooks`);
    
    try {
      const webhooksResponse = await fetch(`${asaasApiUrl}/webhooks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        }
      });
      
      console.log("Status da resposta Asaas:", webhooksResponse.status);
      
      if (!webhooksResponse.ok) {
        const errorData = await webhooksResponse.json();
        console.error("Erro ao obter webhooks do Asaas:", errorData);
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
      console.log("Webhooks encontrados:", webhooks);
      
      if (!webhooks?.data?.length) {
        console.log("Nenhum webhook configurado no Asaas");
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
      console.log("Webhook configurado corretamente");
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
    } catch (asaasError) {
      console.error("Erro na requisição ao Asaas:", asaasError.message);
      return new Response(
        JSON.stringify({ 
          error: "Erro na comunicação com o Asaas", 
          details: asaasError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error(`Erro ao testar webhook: ${error.message}`);
    console.error(error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
