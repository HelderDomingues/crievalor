
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Webhook received request:", req.url);
    console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
    console.log("User-Agent:", req.headers.get("user-agent"));
    
    // Extract token from URL if present
    const requestUrl = new URL(req.url);
    const token = requestUrl.searchParams.get("token");
    
    // Check if the token is in any authorization header (multiple possible formats)
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    let headerToken = null;
    
    if (authHeader) {
      // Handle different authorization header formats
      if (authHeader.startsWith("Bearer ")) {
        headerToken = authHeader.replace("Bearer ", "");
      } else if (authHeader.startsWith("Basic ")) {
        headerToken = authHeader.replace("Basic ", "");
        try {
          // Try to decode if it's base64 encoded
          headerToken = atob(headerToken);
        } catch (e) {
          console.log("Not base64 encoded");
        }
      } else {
        // Just use the raw value
        headerToken = authHeader;
      }
    }
    
    // Check for x-hook-token or other custom headers Asaas might use
    const xHookToken = req.headers.get("x-hook-token") || req.headers.get("X-Hook-Token");
    
    // Check Asaas-specific headers that might contain the token
    const asaasToken = req.headers.get("asaas-token") || req.headers.get("Asaas-Token");
    
    // Also check if token is in the payload body for some integrations
    let bodyToken = null;
    let webhookData;
    try {
      const clonedReq = req.clone();
      const bodyText = await clonedReq.text();
      console.log("Raw request body:", bodyText);
      
      try {
        webhookData = JSON.parse(bodyText);
        console.log("Parsed webhook data:", webhookData);
        if (webhookData && webhookData.token) {
          bodyToken = webhookData.token;
        }
      } catch (e) {
        console.error("Error parsing JSON payload:", e);
        // Continue processing as the main webhook data will be parsed again later
      }
    } catch (e) {
      console.error("Error reading request body:", e);
      // Continue processing as the main webhook data will be parsed again later
    }
    
    // Log all potential token sources for debugging
    console.log("Authentication check details:", {
      urlToken: token,
      headerToken,
      xHookToken,
      asaasToken,
      bodyToken,
      expectedToken: ASAAS_WEBHOOK_TOKEN
    });
    
    // Accept token from any of the possible sources
    const isValidToken = 
      (token && token === ASAAS_WEBHOOK_TOKEN) || 
      (headerToken && headerToken === ASAAS_WEBHOOK_TOKEN) ||
      (xHookToken && xHookToken === ASAAS_WEBHOOK_TOKEN) ||
      (asaasToken && asaasToken === ASAAS_WEBHOOK_TOKEN) ||
      (bodyToken && bodyToken === ASAAS_WEBHOOK_TOKEN);
    
    // If no token validation is configured, accept the request (more permissive)
    const isTokenRequired = !!ASAAS_WEBHOOK_TOKEN;
    
    if (isTokenRequired && !isValidToken) {
      console.error("Token webhook inválido ou não encontrado.", {
        urlToken: token,
        headerToken,
        xHookToken,
        asaasToken,
        bodyToken
      });
      return new Response(
        JSON.stringify({ 
          error: "Não autorizado", 
          code: 401, 
          message: "Missing or invalid token",
          detail: "O token fornecido não corresponde ao token configurado para este webhook."
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Obter dados do webhook (parse again if needed)
    if (!webhookData) {
      try {
        const requestClone = req.clone();
        const rawBody = await requestClone.text();
        try {
          webhookData = JSON.parse(rawBody);
        } catch (e) {
          console.error("Error parsing JSON:", e, "Raw body:", rawBody);
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Received non-JSON data", 
              rawData: rawBody.substring(0, 500) + (rawBody.length > 500 ? "..." : "") 
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        console.log("Dados recebidos do webhook Asaas:", JSON.stringify(webhookData, null, 2));
      } catch (e) {
        console.error("Erro ao processar payload do webhook:", e);
        return new Response(
          JSON.stringify({ error: "Invalid JSON payload", code: 400 }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Special case: Handle ACCOUNT_STATUS events differently
    if (webhookData && webhookData.event && webhookData.event.startsWith("ACCOUNT_STATUS")) {
      console.log("Processando evento de status da conta:", webhookData.event);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Account status event received", 
          event: webhookData.event 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check if this is a payment event
    if (!webhookData.event || !webhookData.payment) {
      console.log("Evento não relacionado a pagamento ou dados incompletos:", webhookData);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Non-payment event received or incomplete data", 
          event: webhookData.event 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Inicializar cliente Supabase com chave de serviço
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Processar eventos de pagamento do Asaas
    const event = webhookData.event;
    const payment = webhookData.payment;

    console.log(`Processando evento ${event} para pagamento ${payment.id}`);

    // Buscar assinatura relacionada a este pagamento
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Erro ao buscar assinatura:", subscriptionError);
      throw subscriptionError;
    }

    if (!subscription) {
      console.log(`Nenhuma assinatura encontrada para o pagamento ${payment.id}`);
      
      // Tentar buscar pela referência externa
      if (payment.externalReference) {
        const { data: subByRef, error: refError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("external_reference", payment.externalReference)
          .maybeSingle();
        
        if (!refError && subByRef) {
          console.log(`Encontrada assinatura pela referência externa: ${payment.externalReference}`);
          
          // Atualizar o payment_id na assinatura
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ 
              payment_id: payment.id,
              payment_status: payment.status,
              updated_at: new Date().toISOString() 
            })
            .eq("id", subByRef.id);
          
          if (updateError) {
            console.error("Erro ao atualizar payment_id na assinatura:", updateError);
          } else {
            console.log(`Payment ID atualizado na assinatura ${subByRef.id}`);
            
            // Continuar processamento com a assinatura encontrada
            return await processPaymentEvent(supabase, event, payment, subByRef);
          }
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Evento recebido, mas nenhuma assinatura encontrada" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return await processPaymentEvent(supabase, event, payment, subscription);
  } catch (error) {
    console.error(`Erro ao processar webhook: ${error.message}`, error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 200, // Return 200 even for errors to avoid Asaas retrying
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função auxiliar para processar eventos de pagamento
async function processPaymentEvent(supabase, event, payment, subscription) {
  // Atualizar status da assinatura com base no evento de pagamento
  let newStatus = subscription.status;
  
  switch (event) {
    case "PAYMENT_RECEIVED":
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED_IN_CASH":
      newStatus = "active";
      break;
    
    case "PAYMENT_OVERDUE":
      newStatus = "past_due";
      break;
    
    case "PAYMENT_DELETED":
    case "PAYMENT_REFUNDED":
    case "PAYMENT_CHARGEBACK_REQUESTED":
    case "PAYMENT_CHARGEBACK_DISPUTE":
      newStatus = "canceled";
      break;
    
    default:
      console.log(`Evento ${event} não exige atualização de status`);
      break;
  }

  // Atualizar assinatura se o status precisa mudar
  if (newStatus !== subscription.status) {
    console.log(`Atualizando status da assinatura ${subscription.id} de ${subscription.status} para ${newStatus}`);
    
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        status: newStatus, 
        payment_status: payment.status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", subscription.id);
    
    if (updateError) {
      console.error("Erro ao atualizar assinatura:", updateError);
      throw updateError;
    }
  } else {
    // Atualizar apenas o status do pagamento
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        payment_status: payment.status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", subscription.id);
    
    if (updateError) {
      console.error("Erro ao atualizar status de pagamento:", updateError);
      throw updateError;
    }
  }

  console.log("Webhook processado com sucesso");
  
  return new Response(
    JSON.stringify({ success: true, message: "Webhook processado com sucesso" }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
