
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const asaasApiKey = Deno.env.get("ASAAS_API_KEY") || "";
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "Thx11vbaBPEvUI2OJCoWvCM8OQHMlBDY";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized or invalid token", details: userError }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User authenticated:", user.id);
    
    // Verify if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve user profile", details: profileError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (profile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin privileges required", details: "User is not an admin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!asaasApiKey) {
      return new Response(
        JSON.stringify({
          error: "Asaas API key not configured",
          solution: "Configure a valid Asaas API key in the project settings",
          details: "The Asaas API key environment variable is not set"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the webhook URLs to test
    const { data: request } = await req.json();
    console.log("Request payload:", request);
    
    const directEndpointUrl = "https://crievalor.lovable.app/api/webhook/asaas?token=" + ASAAS_WEBHOOK_TOKEN;
    const supabaseFunctionUrl = `${supabaseUrl}/functions/v1/asaas-webhook?token=${ASAAS_WEBHOOK_TOKEN}`;
    
    console.log("Testing direct endpoint:", directEndpointUrl);
    console.log("Testing Supabase function endpoint:", supabaseFunctionUrl);
    
    // Test results to track webhook connectivity
    const testResults = {
      directEndpoint: await testEndpoint(directEndpointUrl),
      supabaseFunction: await testEndpoint(supabaseFunctionUrl),
      asaasAccount: await testAsaasAccount()
    };
    
    // Determine recommendations based on test results
    let recommendations = [];
    let options = {};
    
    if (testResults.directEndpoint.status >= 200 && testResults.directEndpoint.status < 300) {
      recommendations.push("O endpoint direto está funcionando corretamente.");
      options.preferredEndpoint = "direct";
    } else if (testResults.supabaseFunction.status >= 200 && testResults.supabaseFunction.status < 300) {
      recommendations.push("O endpoint da função Supabase está funcionando, mas o endpoint direto falhou.");
      recommendations.push("Use a URL da função Supabase no painel do Asaas.");
      options.preferredEndpoint = "supabase";
    } else {
      recommendations.push("Ambos endpoints falharam. Verifique as configurações do webhook e do Cloudflare.");
      options.preferredEndpoint = "none";
    }
    
    if (testResults.asaasAccount.status >= 200 && testResults.asaasAccount.status < 300) {
      recommendations.push("A conta do Asaas está configurada corretamente.");
      options.asaasAccount = "valid";
    } else {
      recommendations.push("Houve um problema ao verificar a conta do Asaas. Verifique a chave API.");
      options.asaasAccount = "invalid";
    }
    
    // Send back the test results
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Webhook test completed",
        testResults,
        recommendations,
        options,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error in webhook test:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to test webhook", 
        details: error.message || "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Test if an endpoint can be reached
async function testEndpoint(url) {
  try {
    const testPayload = {
      event: "TEST_EVENT",
      dateCreated: new Date().toISOString(),
      testMode: true
    };
    
    console.log(`Sending test request to ${url}`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Java/1.8.0_282" // Simulate Asaas User-Agent
      },
      body: JSON.stringify(testPayload)
    });
    
    const text = await response.text();
    
    console.log(`Response from ${url}: status=${response.status}, body=`, text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { rawText: text };
    }
    
    return {
      url,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      data,
      headers: Object.fromEntries(response.headers.entries()),
      error: response.status >= 400 ? "HTTP error " + response.status : null
    };
  } catch (error) {
    console.error(`Error testing endpoint ${url}:`, error);
    
    return {
      url,
      status: 0,
      success: false,
      error: error.message || "Unknown error",
      data: null
    };
  }
}

// Test if Asaas account is properly configured
async function testAsaasAccount() {
  try {
    const response = await fetch(`${ASAAS_API_URL}/finance/balance`, {
      method: "GET",
      headers: {
        "access_token": asaasApiKey,
        "Content-Type": "application/json"
      }
    });
    
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { rawText: text };
    }
    
    return {
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      data,
      error: response.status >= 400 ? "HTTP error " + response.status : null
    };
  } catch (error) {
    return {
      status: 0,
      success: false,
      error: error.message || "Unknown error",
      data: null
    };
  }
}
