
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";

// Enhanced CORS headers to ensure Asaas requests are accepted
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, user-agent, x-hook-token, asaas-token",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

serve(async (req) => {
  try {
    // Special handler for ping/test requests
    if (req.method === "GET") {
      console.log("Received GET request to webhook - likely a test or ping");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Webhook endpoint is operational", 
          timestamp: new Date().toISOString() 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Handle OPTIONS requests for CORS preflight
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response("ok", { headers: corsHeaders });
    }

    // Log request details
    console.log("Webhook received request:", req.url);
    console.log("Method:", req.method);
    console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
    console.log("User-Agent:", req.headers.get("user-agent"));
    
    // Extract token from various sources
    const requestUrl = new URL(req.url);
    const token = requestUrl.searchParams.get("token");
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const xHookToken = req.headers.get("x-hook-token") || req.headers.get("X-Hook-Token");
    const asaasToken = req.headers.get("asaas-token") || req.headers.get("Asaas-Token");
    
    let headerToken = null;
    if (authHeader) {
      // Handle different authorization header formats
      if (authHeader.startsWith("Bearer ")) {
        headerToken = authHeader.replace("Bearer ", "");
      } else if (authHeader.startsWith("Basic ")) {
        headerToken = authHeader.replace("Basic ", "");
        try {
          headerToken = atob(headerToken);
        } catch (e) {
          console.log("Not base64 encoded");
        }
      } else {
        headerToken = authHeader;
      }
    }
    
    // Parse webhook data from body
    let webhookData;
    let bodyToken = null;
    
    try {
      const clonedReq = req.clone();
      const bodyText = await clonedReq.text();
      console.log("Raw request body:", bodyText);
      
      if (bodyText) {
        try {
          webhookData = JSON.parse(bodyText);
          console.log("Parsed webhook data:", JSON.stringify(webhookData, null, 2));
          
          if (webhookData && webhookData.token) {
            bodyToken = webhookData.token;
          }
        } catch (e) {
          console.error("Error parsing JSON payload:", e);
        }
      } else {
        console.log("Request body is empty");
      }
    } catch (e) {
      console.error("Error reading request body:", e);
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
          success: false,
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

    // Parse webhook data if not already done
    if (!webhookData) {
      try {
        const requestClone = req.clone();
        const rawBody = await requestClone.text();
        
        if (!rawBody || rawBody.trim() === '') {
          console.log("Empty request body received");
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Received empty body", 
              timestamp: new Date().toISOString() 
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        try {
          webhookData = JSON.parse(rawBody);
          console.log("Webhook data parsed in second attempt:", JSON.stringify(webhookData, null, 2));
        } catch (e) {
          console.error("Error parsing JSON in second attempt:", e, "Raw body:", rawBody);
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Received non-JSON data", 
              rawData: rawBody.substring(0, 500) + (rawBody.length > 500 ? "..." : "") 
            }),
            {
              status: 200, // Still return 200 to prevent retries
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
      } catch (e) {
        console.error("Fatal error processing webhook payload:", e);
        return new Response(
          JSON.stringify({ 
            success: true, // Still indicate success to prevent retries
            error: "Invalid payload - could not process", 
            code: 400 
          }),
          {
            status: 200, // Return 200 to prevent Asaas from retrying
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Special case: Handle ACCOUNT_STATUS events differently
    if (webhookData && webhookData.event && webhookData.event.startsWith("ACCOUNT_STATUS")) {
      console.log("Processando evento de status da conta:", webhookData.event);
      // For account status events, we just acknowledge them but don't process further
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Account status event received and acknowledged", 
          event: webhookData.event 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check if this is a payment event with required data
    if (!webhookData.event || !webhookData.payment) {
      console.log("Evento não relacionado a pagamento ou dados incompletos:", webhookData);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Event received but not processed (non-payment or incomplete data)", 
          event: webhookData.event || 'unknown' 
        }),
        {
          status: 200, // Return 200 to prevent Asaas from retrying
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Process payment events
    const event = webhookData.event;
    const payment = webhookData.payment;

    console.log(`Processando evento ${event} para pagamento ${payment.id}`);

    // Find subscription associated with this payment
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Erro ao buscar assinatura pelo payment_id:", subscriptionError);
      throw subscriptionError;
    }

    if (!subscription) {
      console.log(`Nenhuma assinatura encontrada para o payment_id ${payment.id}, tentando buscar por externalReference`);
      
      // Try looking up by external reference
      if (payment.externalReference) {
        const { data: subByRef, error: refError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("external_reference", payment.externalReference)
          .maybeSingle();
        
        if (refError) {
          console.error("Erro ao buscar assinatura por referência externa:", refError);
        }
        
        if (!refError && subByRef) {
          console.log(`Encontrada assinatura pela referência externa: ${payment.externalReference}`);
          
          // Update the payment_id in the subscription
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
            throw updateError;
          } else {
            console.log(`Payment ID atualizado na assinatura ${subByRef.id}`);
            
            // Continue processing with the found subscription
            return await processPaymentEvent(supabase, event, payment, subByRef);
          }
        } else {
          console.log(`Nenhuma assinatura encontrada para a referência externa: ${payment.externalReference}`);
        }
      }
      
      // If we got here, no subscription was found
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment event received, but no matching subscription found",
          paymentId: payment.id,
          externalReference: payment.externalReference || 'none'
        }),
        {
          status: 200, // Return 200 to prevent retries
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Process the payment event for the found subscription
    return await processPaymentEvent(supabase, event, payment, subscription);
  } catch (error) {
    console.error(`Erro ao processar webhook: ${error.message}`, error);
    console.error(error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: true, // Still indicate success to prevent retries
        error: "Error processing webhook, but acknowledged", 
        message: error.message,
        stack: error.stack
      }),
      {
        status: 200, // Return 200 even for errors to prevent Asaas from retrying
        headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
});

// Helper function to process payment events
async function processPaymentEvent(supabase, event, payment, subscription) {
  // Update subscription status based on payment event
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

  // Update subscription if status needs to change
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
    // Update only the payment status
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
    JSON.stringify({ 
      success: true, 
      message: "Webhook processado com sucesso",
      subscription: subscription.id,
      paymentId: payment.id,
      newStatus: newStatus
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
