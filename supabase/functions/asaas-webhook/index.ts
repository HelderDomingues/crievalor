
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders, handlePaymentEvent, logRequestDetails } from "./handlers.ts";

const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";
const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") || "";

serve(async (req) => {
  // Log all requests for debugging
  logRequestDetails(req);
  
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

    // For POST requests, process the webhook payload
    if (req.method === "POST") {
      // Check if request has Java user agent (from Asaas)
      const userAgent = req.headers.get("User-Agent") || "";
      const isFromAsaas = userAgent.includes("Java");
      
      if (isFromAsaas) {
        console.log("Request appears to be from Asaas based on User-Agent (Java). JWT verification is disabled, proceeding with processing.");
      } else {
        console.log("Request does not appear to be from Asaas, but JWT verification is disabled, proceeding anyway.");
      }
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const supabase = createClient(supabaseUrl, supabaseKey);

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
      return await handlePaymentEvent(supabase, event, payment, corsHeaders);
    }

    // Default response for unsupported methods
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Unsupported method", 
        method: req.method 
      }),
      {
        status: 200, // Return 200 even for errors to prevent retries
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
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
