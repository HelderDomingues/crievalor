
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
let asaasApiKey = "";
const asaasApiUrl = "https://sandbox.asaas.com/api/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, user-agent"
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
    
    // Authentication check
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
    
    // Check admin permissions
    const { data: userData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error("Erro ao verificar perfil do usuário:", profileError);
      return new Response(
        JSON.stringify({ 
          error: "Erro ao verificar perfil do usuário", 
          details: profileError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const isAdmin = userData?.role === 'admin';
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

    // First test - check if webhook endpoint is responding
    console.log("Testando conexão direta com o webhook endpoint");

    // Armazenar os resultados dos testes
    const testResults = {
      directEndpoint: { status: null, response: null, error: null },
      supabaseFunction: { status: null, response: null, error: null },
      asaasWebhooks: { status: null, response: null, error: null }
    };

    try {
      // Teste 1: URL pública do domínio do cliente
      const webhookEndpoint = "https://crievalor.lovable.app/api/webhook/asaas?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";
      console.log(`Testando endpoint público: ${webhookEndpoint}`);
      
      const pingResponse = await fetch(webhookEndpoint, { 
        method: 'GET',
        headers: { 
          'User-Agent': 'Asaas-Webhook-Test/1.0',
          'accept': '*/*'
        }
      });
      
      console.log(`Status da resposta do endpoint público: ${pingResponse.status}`);
      
      testResults.directEndpoint.status = pingResponse.status;
      try {
        testResults.directEndpoint.response = await pingResponse.text();
      } catch (e) {
        console.error("Erro ao ler resposta do endpoint público:", e);
        testResults.directEndpoint.error = e.message;
      }
    } catch (pingError) {
      console.error("Erro ao fazer ping no webhook endpoint público:", pingError);
      testResults.directEndpoint.error = pingError.message;
    }

    // Teste 2: URL direta da função Supabase
    try {
      const supabaseFunction = `${supabaseUrl}/functions/v1/asaas-webhook?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY`;
      console.log(`Testando endpoint Supabase: ${supabaseFunction}`);
      
      const supabaseResponse = await fetch(supabaseFunction, {
        method: 'GET',
        headers: { 
          'User-Agent': 'Asaas-Webhook-Test/1.0',
          'accept': '*/*'
        }
      });
      
      console.log(`Status da resposta da função Supabase: ${supabaseResponse.status}`);
      
      testResults.supabaseFunction.status = supabaseResponse.status;
      try {
        testResults.supabaseFunction.response = await supabaseResponse.text();
      } catch (e) {
        console.error("Erro ao ler resposta da função Supabase:", e);
        testResults.supabaseFunction.error = e.message;
      }
    } catch (supabaseError) {
      console.error("Erro ao testar função Supabase:", supabaseError);
      testResults.supabaseFunction.error = supabaseError.message;
    }
    
    // Third test - check webhooks registered in Asaas
    console.log("Verificando webhooks registrados no Asaas");
    try {
      const webhooksResponse = await fetch(`${asaasApiUrl}/webhooks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        }
      });
      
      console.log("Status da resposta Asaas:", webhooksResponse.status);
      testResults.asaasWebhooks.status = webhooksResponse.status;
      
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
        testResults.asaasWebhooks.error = errorData;
        
        return new Response(
          JSON.stringify({ 
            error: `Erro ao obter webhooks do Asaas: ${webhooksResponse.status} ${webhooksResponse.statusText}`,
            details: errorData,
            solution: "Verifique se a API Key do Asaas está correta e tem as permissões necessárias."
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
        testResults.asaasWebhooks.response = webhooks;
        console.log("Webhooks obtidos com sucesso");
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
            response: webhooks,
            solution: "Entre em contato com o suporte do Asaas para verificar o formato da resposta."
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
            details: 'É necessário configurar pelo menos um webhook no painel do Asaas',
            solution: "Acesse o painel do Asaas e configure o webhook",
            options: [
              {
                url: `${supabaseUrl}/functions/v1/asaas-webhook?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY`,
                label: "URL da função Supabase (recomendado se o domínio não funcionar)",
                note: "Esta URL acessa diretamente a função do Supabase, evitando o Cloudflare"
              },
              {
                url: "https://crievalor.lovable.app/api/webhook/asaas?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY",
                label: "URL do domínio personalizado",
                note: "Esta URL passa pelo Cloudflare e pode ser bloqueada"
              }
            ],
            testResults
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // Determine se algum webhook está usando a URL da função Supabase diretamente
      const webhooksInfo = webhooks.data.map(webhook => ({
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        enabled: webhook.enabled,
        interrupted: webhook.interrupted,
        apiVersion: webhook.apiVersion,
        usesFunctionUrl: webhook.url.includes(`${supabaseUrl}/functions/v1/asaas-webhook`)
      }));

      // Verificar se há um webhook configurado com URL direta da função
      const hasFunctionWebhook = webhooksInfo.some(w => w.usesFunctionUrl);
      
      // Verificar se há um webhook configurado com URL do domínio personalizado
      const hasCustomDomainWebhook = webhooksInfo.some(w => 
        w.url.includes("crievalor.lovable.app/api/webhook/asaas")
      );

      // Verificar se algum webhook está com problemas
      const hasInterruptedWebhooks = webhooksInfo.some(w => w.interrupted);
      
      // Success response
      console.log("Webhook configurado corretamente, encontrados:", webhooks.data.length, "webhooks");
      
      // Incluir recomendações com base no status dos testes
      let recommendations = [];
      
      if (testResults.directEndpoint.error || 
          (testResults.directEndpoint.status && testResults.directEndpoint.status >= 400)) {
        // Se o endpoint público falhou, recomendar usar a URL direta da função
        if (!hasFunctionWebhook) {
          recommendations.push({
            type: "warning",
            message: "O endpoint público está retornando erro. Recomendamos configurar um webhook usando a URL direta da função Supabase.",
            action: `Configure um novo webhook no Asaas com a URL: ${supabaseUrl}/functions/v1/asaas-webhook?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY`
          });
        }
      }
      
      if (hasInterruptedWebhooks) {
        recommendations.push({
          type: "warning",
          message: "Há webhooks interrompidos no Asaas. Isso pode indicar falhas nas entregas.",
          action: "Verifique o painel do Asaas e reative os webhooks se necessário."
        });
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Webhook configurado corretamente",
          webhooksInfo: webhooksInfo,
          recommendations: recommendations,
          testResults: testResults,
          options: {
            functionUrl: `${supabaseUrl}/functions/v1/asaas-webhook?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY`,
            customDomainUrl: "https://crievalor.lovable.app/api/webhook/asaas?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY"
          }
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
          },
          solution: "Verifique se você consegue acessar a API do Asaas de outros contextos.",
          testResults
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
        stack: error.stack,
        solution: "Entre em contato com o suporte técnico para resolver este problema."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
