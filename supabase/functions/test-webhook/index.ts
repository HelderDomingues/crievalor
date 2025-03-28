
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const asaasApiKey = Deno.env.get("ASAAS_API_KEY") || "";
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";

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
      console.error("User authentication error:", userError);
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
      console.error("Profile retrieval error:", profileError);
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
    
    // Get the request data
    let requestData = {};
    try {
      if (req.headers.get("content-type")?.includes("application/json")) {
        const json = await req.json();
        requestData = json.data || json;
        console.log("Request data:", requestData);
      }
    } catch (e) {
      console.error("Error parsing request JSON:", e);
    }
    
    // Define Supabase function URL for webhook
    const webhookUrl = `${supabaseUrl}/functions/v1/asaas-webhook`;
    console.log("Testing webhook endpoint:", webhookUrl);
    
    // Test results to track webhook connectivity
    const testResults = {
      webhookEndpoint: await testEndpoint(webhookUrl),
      asaasAccount: await testAsaasAccount()
    };
    
    // Determine recommendations based on test results
    let recommendations = [];
    let options = {};
    
    if (testResults.webhookEndpoint.status >= 200 && testResults.webhookEndpoint.status < 300) {
      recommendations.push("O endpoint do webhook está funcionando corretamente.");
      options.webhookStatus = "active";
    } else {
      recommendations.push("O endpoint do webhook falhou. Verifique as configurações da função.");
      options.webhookStatus = "inactive";
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
        "User-Agent": "Java/1.8.0_282", // Simulate Asaas User-Agent
        "access_token": asaasApiKey // Add the access_token header needed by Asaas
      },
      body: JSON.stringify(testPayload)
    });
    
    let responseText;
    try {
      responseText = await response.text();
      console.log(`Response from ${url}: status=${response.status}, body=`, responseText);
    } catch (e) {
      console.error(`Error reading response text:`, e);
      responseText = "Could not read response text";
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { rawText: responseText };
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
    
    let responseText;
    try {
      responseText = await response.text();
    } catch (e) {
      responseText = "Could not read response text";
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { rawText: responseText };
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
