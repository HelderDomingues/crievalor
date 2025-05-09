
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handlers } from "./handlers.ts";

// Configuração do Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const asaasWebhookToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "";

// Headers CORS para permitir requisições de qualquer origem
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Inicializar o cliente do Supabase com a chave de serviço
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar o token de autenticação do webhook (opcional para sandbox)
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    
    // Log para debugging
    console.log("Recebido webhook do Asaas");
    console.log("URL:", req.url);
    console.log("Token recebido:", token);
    console.log("Token esperado:", asaasWebhookToken);
    
    // Em produção, descomentar esta validação:
    // if (token !== asaasWebhookToken) {
    //   console.error("Token de webhook inválido");
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), { 
    //     status: 401, 
    //     headers: { ...corsHeaders, "Content-Type": "application/json" } 
    //   });
    // }

    // Extrair o payload do webhook
    const payload = await req.json();
    console.log("Payload recebido:", JSON.stringify(payload, null, 2));
    
    // Identificar o tipo de evento e processar de acordo
    const eventType = payload.event;
    console.log("Tipo de evento:", eventType);
    
    // Processar o evento com os handlers correspondentes
    if (eventType in handlers) {
      const result = await handlers[eventType](payload, supabase);
      console.log("Resultado do processamento:", result);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      console.log(`Evento não tratado: ${eventType}`);
      return new Response(JSON.stringify({ message: `Evento não tratado: ${eventType}` }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
