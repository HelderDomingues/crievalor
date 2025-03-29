
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";
const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") || "";

// Enhanced CORS headers to ensure Asaas requests are accepted
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, user-agent, x-hook-token, asaas-token, access_token",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

serve(async (req) => {
  // Log all requests for debugging
  console.log(`${req.method} request received at ${new Date().toISOString()}`);
  console.log("URL:", req.url);
  console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
  
  try {
    // Handle OPTIONS requests for CORS preflight
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response("ok", { headers: corsHeaders });
    }
    
    // Special handler for GET requests (ping/test)
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

    // Extract token from various sources
    const requestUrl = new URL(req.url);
    const token = requestUrl.searchParams.get("token");
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const xHookToken = req.headers.get("x-hook-token") || req.headers.get("X-Hook-Token");
    const asaasToken = req.headers.get("asaas-token") || req.headers.get("Asaas-Token");
    const accessToken = req.headers.get("access_token") || req.headers.get("Access-Token");
    
    // Log all potential token sources for debugging
    console.log("Token sources:", {
      urlToken: token,
      authHeader,
      xHookToken,
      asaasToken,
      accessToken,
      expectedToken: ASAAS_WEBHOOK_TOKEN
    });
    
    // Check if we have a valid Asaas API Key in the access_token header
    const isValidAsaasApiKey = accessToken && ASAAS_API_KEY && accessToken === ASAAS_API_KEY;
    
    // Authenticate the request - Accept both our webhook token and the Asaas API key
    let validToken = null;
    let validApiKey = false;
    
    // Check token from URL parameters
    if (token === ASAAS_WEBHOOK_TOKEN) validToken = token;
    
    // Check token from Authorization header
    else if (authHeader) {
      let headerToken = authHeader;
      if (authHeader.startsWith("Bearer ")) {
        headerToken = authHeader.replace("Bearer ", "");
      } else if (authHeader.startsWith("Basic ")) {
        headerToken = authHeader.replace("Basic ", "");
        try {
          headerToken = atob(headerToken);
        } catch (e) {
          console.log("Not base64 encoded");
        }
      }
      if (headerToken === ASAAS_WEBHOOK_TOKEN) validToken = headerToken;
    }
    
    // Check other header sources
    else if (xHookToken === ASAAS_WEBHOOK_TOKEN) validToken = xHookToken;
    else if (asaasToken === ASAAS_WEBHOOK_TOKEN) validToken = asaasToken;
    else if (accessToken === ASAAS_WEBHOOK_TOKEN) validToken = accessToken;
    
    // Check if the access_token matches our Asaas API Key
    if (isValidAsaasApiKey) {
      console.log("Authenticated via Asaas API Key in access_token header");
      validApiKey = true;
    }
    
    // Parse webhook data
    let webhookData;
    try {
      const clonedReq = req.clone();
      const bodyText = await clonedReq.text();
      console.log("Raw request body:", bodyText);
      
      if (bodyText && bodyText.trim() !== '') {
        try {
          webhookData = JSON.parse(bodyText);
          console.log("Parsed webhook data:", JSON.stringify(webhookData, null, 2));
          
          // Check for token in body
          if (webhookData && webhookData.token && webhookData.token === ASAAS_WEBHOOK_TOKEN) {
            validToken = webhookData.token;
          }
        } catch (e) {
          console.error("Error parsing JSON payload:", e);
          webhookData = { rawBody: bodyText };
        }
      } else {
        console.log("Request body is empty");
        webhookData = {};
      }
    } catch (e) {
      console.error("Error reading request body:", e);
      webhookData = {};
    }
    
    // Log authentication check details
    console.log("Authentication check details:", {
      urlToken: token,
      headerToken: authHeader,
      xHookToken,
      asaasToken,
      accessToken,
      bodyToken: webhookData?.token,
      validToken,
      validApiKey,
      expectedToken: ASAAS_WEBHOOK_TOKEN
    });
    
    // Token validation - For production webhook calls, temporarily accept any request with access_token header
    // This allows us to receive webhook calls while debugging
    const isTokenRequired = !!ASAAS_WEBHOOK_TOKEN;
    const isAsaasProduction = req.headers.get("User-Agent")?.includes("Java");
    const hasAccessToken = !!accessToken;
    
    if (isTokenRequired && !validToken && !validApiKey) {
      // If this is from Asaas production and has any access_token, accept it for now while debugging
      if (isAsaasProduction && hasAccessToken) {
        console.log("Accepting request from Asaas with access_token for debugging purposes");
        // Continue processing
      } else {
        console.warn("Invalid or missing webhook token", {
          receivedTokens: {
            urlToken: token,
            authHeader,
            xHookToken,
            asaasToken,
            accessToken,
            bodyToken: webhookData?.token
          },
          expectedToken: ASAAS_WEBHOOK_TOKEN
        });
        
        // For test calls, respond with clear error
        if (webhookData && webhookData.testMode) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: "Unauthorized", 
              message: "Missing or invalid token for webhook authentication",
              hint: "Make sure your webhook is configured with the correct token"
            }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        // For Asaas production calls, return 200 to prevent retries but indicate error
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Unauthorized", 
            code: 401, 
            message: "Missing or invalid token",
            detail: "O token fornecido não corresponde ao token configurado para este webhook."
          }),
          {
            status: 200, // Return 200 to prevent Asaas from retrying
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // If this is a test request from our test-webhook function, just return success
    if (webhookData && webhookData.testMode === true) {
      console.log("Detected test mode request, returning success");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Test request received and validated successfully", 
          timestamp: new Date().toISOString() 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
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
