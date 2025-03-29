
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

// List of trusted Asaas IP addresses (to be updated with actual Asaas IPs)
// For sandbox testing, we'll accept all IPs, but in production you should restrict this
const trustedIPs = [
  // Add known Asaas IP addresses here for production
  // For sandbox testing, we accept all
];

serve(async (req) => {
  // Log all requests for debugging
  console.log(`${req.method} request received at ${new Date().toISOString()}`);
  console.log("URL:", req.url);
  
  // Get client IP
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("X-Forwarded-For") || "unknown";
  console.log("Client IP:", clientIP);
  
  // Log all headers for debugging
  const headersObj = Object.fromEntries(req.headers.entries());
  console.log("Headers:", JSON.stringify(headersObj, null, 2));
  
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
          timestamp: new Date().toISOString(),
          config: {
            jwtVerificationDisabled: true,
            acceptAllOrigins: true
          }
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
    const userAgent = req.headers.get("User-Agent") || "";
    
    // Detect if this is from Asaas (Java-based) or a test
    const isFromAsaas = userAgent.includes("Java");
    let isTestMode = requestUrl.searchParams.get("test") === "true";
    
    // Log all potential token sources for debugging
    console.log("Token sources:", {
      urlToken: token,
      authHeader,
      xHookToken,
      asaasToken,
      accessToken,
      userAgent,
      isFromAsaas,
      isTestMode,
      clientIP,
      expectedToken: ASAAS_WEBHOOK_TOKEN,
      jwtVerificationDisabled: true
    });
    
    // Since JWT verification is disabled, we'll accept all Asaas webhook requests with "Java" user agent
    if (isFromAsaas) {
      console.log("Request appears to be from Asaas based on User-Agent (Java). JWT verification is disabled, proceeding with processing.");
      // Continue processing without token validation for Asaas requests
    } else {
      // Parse webhook data first to check for body tokens and test mode indicators
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
              console.log("Found valid token in request body");
            }
            
            // Check for test mode indicator in body
            if (webhookData && webhookData.testMode === true) {
              console.log("Test mode detected in request body");
              isTestMode = true;
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
      
      // Check if we have a valid Asaas API Key in the access_token header
      const isValidAsaasApiKey = accessToken && ASAAS_API_KEY && accessToken === ASAAS_API_KEY;
      
      // Authentication checks for non-Asaas requests
      let validToken = false;
      let validApiKey = false;
      let ipValidated = false;
      
      // For tests, check various authentication methods
      if (token === ASAAS_WEBHOOK_TOKEN) {
        console.log("Valid token found in URL parameters");
        validToken = true;
      } else if (authHeader) {
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
        if (headerToken === ASAAS_WEBHOOK_TOKEN) {
          console.log("Valid token found in Authorization header");
          validToken = true;
        }
      } else if (xHookToken === ASAAS_WEBHOOK_TOKEN) {
        console.log("Valid token found in x-hook-token header");
        validToken = true;
      } else if (asaasToken === ASAAS_WEBHOOK_TOKEN) {
        console.log("Valid token found in asaas-token header");
        validToken = true;
      } else if (accessToken === ASAAS_WEBHOOK_TOKEN) {
        console.log("Valid token found in access_token header");
        validToken = true;
      }
      
      // Check if the access_token matches our Asaas API Key
      if (isValidAsaasApiKey) {
        console.log("Authenticated via Asaas API Key in access_token header");
        validApiKey = true;
      }
      
      // For test calls, provide clear feedback
      if (isTestMode) {
        if (!validToken && !validApiKey && !ipValidated && !isFromAsaas) {
          console.log("Test request failed authentication, but JWT verification is disabled so continuing anyway");
          // We'll proceed with processing even without valid authentication for testing
        } else {
          console.log("Test request authenticated successfully");
          // Continue processing
        }
        
        // For test calls, return success response regardless of authentication
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Test request received with JWT verification disabled", 
            timestamp: new Date().toISOString(),
            authMethod: validToken ? "token" : (validApiKey ? "apiKey" : "none"),
            jwtVerificationDisabled: true
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body for processing
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    // Parse webhook data
    const event = requestBody.event;
    const payment = requestBody.payment;

    // If there's no event or payment data, return early
    if (!event || !payment) {
      console.log("Event not related to payment or incomplete data:", requestBody);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Event received but not processed (non-payment or incomplete data)", 
          event: event || 'unknown' 
        }),
        {
          status: 200, // Return 200 to prevent retries
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Processing event ${event} for payment ${payment.id}`);

    // Find subscription associated with this payment
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Error finding subscription by payment_id:", subscriptionError);
      throw subscriptionError;
    }

    if (!subscription) {
      console.log(`No subscription found for payment_id ${payment.id}, trying to find by externalReference`);
      
      // Try looking up by external reference
      if (payment.externalReference) {
        const { data: subByRef, error: refError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("external_reference", payment.externalReference)
          .maybeSingle();
        
        if (refError) {
          console.error("Error finding subscription by external reference:", refError);
        }
        
        if (!refError && subByRef) {
          console.log(`Found subscription by external reference: ${payment.externalReference}`);
          
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
            console.error("Error updating payment_id in subscription:", updateError);
            throw updateError;
          } else {
            console.log(`Payment ID updated in subscription ${subByRef.id}`);
            
            // Continue processing with the found subscription
            return await processPaymentEvent(supabase, event, payment, subByRef);
          }
        } else {
          console.log(`No subscription found for external reference: ${payment.externalReference}`);
        }
      }
      
      // If we got here, no subscription was found
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment event received, but no matching subscription found",
          paymentId: payment.id,
          externalReference: payment.externalReference || 'none',
          jwtVerificationDisabled: true
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
    console.error(`Error processing webhook: ${error.message}`, error);
    console.error(error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: true, // Still indicate success to prevent retries
        error: "Error processing webhook, but acknowledged", 
        message: error.message,
        stack: error.stack,
        jwtVerificationDisabled: true
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
      console.log(`Event ${event} does not require status update`);
      break;
  }

  // Update subscription if status needs to change
  if (newStatus !== subscription.status) {
    console.log(`Updating subscription ${subscription.id} status from ${subscription.status} to ${newStatus}`);
    
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        status: newStatus, 
        payment_status: payment.status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", subscription.id);
    
    if (updateError) {
      console.error("Error updating subscription:", updateError);
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
      console.error("Error updating payment status:", updateError);
      throw updateError;
    }
  }

  console.log("Webhook processed successfully");
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Webhook processed successfully",
      subscription: subscription.id,
      paymentId: payment.id,
      newStatus: newStatus,
      jwtVerificationDisabled: true
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
