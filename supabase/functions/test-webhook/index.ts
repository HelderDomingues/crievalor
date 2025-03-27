
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
    
    // Get ASAAS_API_KEY from database system_settings
    console.log("Buscando ASAAS_API_KEY da tabela system_settings");
    const { data: settingData, error: settingError } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'ASAAS_API_KEY')
      .maybeSingle();
    
    if (settingError) {
      console.error("Erro ao buscar chave da API:", settingError);
      throw new Error(`API Key do Asaas não encontrada no banco de dados: ${settingError.message}`);
    }
    
    if (!settingData || !settingData.value) {
      console.error("Teste webhook: ASAAS_API_KEY não encontrada na tabela system_settings");
      return new Response(
        JSON.stringify({ 
          error: "API Key do Asaas não configurada na tabela system_settings",
          details: "Verifique se a chave ASAAS_API_KEY está configurada na tabela system_settings"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    asaasApiKey = settingData.value;
    console.log("ASAAS_API_KEY obtida da tabela system_settings");
    
    // Log first few characters of API key for debugging (never log full API keys)
    if (asaasApiKey) {
      const keyLength = asaasApiKey.length;
      const maskedKey = asaasApiKey.substring(0, 5) + "..." + asaasApiKey.substring(keyLength - 5);
      console.log(`ASAAS_API_KEY encontrada (formato: ${maskedKey}), comprimento: ${keyLength} caracteres`);
    }
    
    if (!asaasApiKey) {
      console.error("Teste webhook: ASAAS_API_KEY obtida mas está vazia");
      return new Response(
        JSON.stringify({ error: "API Key do Asaas está vazia" }),
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
    
    // Verificar se o usuário é admin - utilizando tabela diretamente para evitar problemas da função RPC
    console.log("Verificando permissões de administrador para o usuário:", user.id);
    
    // FIX: Use table alias to avoid ambiguous column reference
    const { data: adminRoles, error: adminQueryError } = await supabase
      .from('user_roles as ur')
      .select('ur.role')
      .eq('ur.user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (adminQueryError) {
      console.error("Erro ao verificar permissões de admin:", adminQueryError);
      return new Response(
        JSON.stringify({ 
          error: "Erro ao verificar permissões de administrador", 
          details: adminQueryError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const isAdmin = !!adminRoles;
    console.log("Resultado da verificação de admin (consulta direta):", { isAdmin });
    
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
      console.log("Iniciando chamada à API do Asaas com access_token:", 
                  asaasApiKey.substring(0, 5) + "..." + asaasApiKey.substring(asaasApiKey.length - 5));
      
      const webhooksResponse = await fetch(`${asaasApiUrl}/webhooks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        }
      });
      
      console.log("Status da resposta Asaas:", webhooksResponse.status);
      console.log("Headers da resposta:", JSON.stringify([...webhooksResponse.headers.entries()]));
      
      if (!webhooksResponse.ok) {
        let errorData;
        try {
          errorData = await webhooksResponse.json();
        } catch (jsonError) {
          errorData = { 
            parseError: "Não foi possível analisar a resposta como JSON",
            textContent: await webhooksResponse.text()
          };
        }
        
        console.error("Erro ao obter webhooks do Asaas:", 
                      webhooksResponse.status, webhooksResponse.statusText, errorData);
        
        return new Response(
          JSON.stringify({ 
            error: `Erro ao obter webhooks do Asaas: ${webhooksResponse.status} ${webhooksResponse.statusText}`,
            details: errorData
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      let webhooks;
      try {
        webhooks = await webhooksResponse.json();
        console.log("Webhooks obtidos com sucesso, formato da resposta:", 
                    JSON.stringify(webhooks, null, 2).substring(0, 500) + "...");
      } catch (jsonError) {
        console.error("Erro ao analisar resposta JSON do Asaas:", jsonError);
        const textResponse = await webhooksResponse.text();
        return new Response(
          JSON.stringify({ 
            error: "Erro ao analisar resposta do Asaas como JSON", 
            details: {
              parseError: jsonError.message,
              responseText: textResponse.substring(0, 1000) + (textResponse.length > 1000 ? "..." : "")
            }
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      if (!webhooks?.data) {
        console.log("Resposta não contém data array:", webhooks);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Resposta do Asaas não contém o campo data esperado',
            response: webhooks
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      if (!webhooks.data.length) {
        console.log("Nenhum webhook configurado no Asaas");
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Nenhum webhook configurado no Asaas',
            details: 'É necessário configurar pelo menos um webhook no painel do Asaas'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // Webhook está configurado e funcionando
      console.log("Webhook configurado corretamente, encontrados:", webhooks.data.length, "webhooks");
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
      console.error("Erro na requisição ao Asaas:", asaasError.message, asaasError.stack);
      return new Response(
        JSON.stringify({ 
          error: "Erro na comunicação com o Asaas", 
          details: {
            message: asaasError.message,
            stack: asaasError.stack
          }
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
