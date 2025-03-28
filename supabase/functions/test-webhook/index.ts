
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
    try {
      const webhookEndpoint = "https://crievalor.lovable.app/api/webhook/asaas?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";
      const pingResponse = await fetch(webhookEndpoint, { 
        method: 'GET',
        headers: { 'User-Agent': 'WebhookTest/1.0' }
      });
      
      console.log(`Status da resposta do endpoint: ${pingResponse.status}`);
      
      const pingResult = {
        status: pingResponse.status,
        ok: pingResponse.ok
      };
      
      try {
        pingResult.text = await pingResponse.text();
        if (pingResponse.headers.get('content-type')?.includes('application/json')) {
          try {
            pingResult.json = JSON.parse(pingResult.text);
          } catch (e) {
            console.log("Resposta não é JSON válido");
          }
        }
      } catch (e) {
        console.error("Erro ao ler resposta do endpoint:", e);
      }
      
      console.log("Resultado do ping ao endpoint:", pingResult);
      
      if (!pingResponse.ok) {
        console.error("Endpoint do webhook não está respondendo corretamente");
      }
    } catch (pingError) {
      console.error("Erro ao fazer ping no webhook endpoint:", pingError);
    }
    
    // Second test - check webhooks registered in Asaas
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
            solution: "Acesse o painel do Asaas e configure o webhook com a URL: https://crievalor.lovable.app/api/webhook/asaas?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // Success response
      console.log("Webhook configurado corretamente, encontrados:", webhooks.data.length, "webhooks");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Webhook configurado corretamente",
          webhooks: webhooks.data,
          webhookUrl: "https://crievalor.lovable.app/api/webhook/asaas?token=Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY",
          note: "Se o webhook estiver retornando erro 1010 do Cloudflare, recomendamos usar diretamente o endereço da função do Supabase para evitar o firewall."
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
          solution: "Verifique se você consegue acessar a API do Asaas de outros contextos."
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
