
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define CORS headers to allow browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Get environment variables for Supabase connection
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const asaasApiKey = Deno.env.get("ASAAS_API_KEY") || "";
const asaasWebhookToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "";

// Setup the server handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the webhook test request
    const { timestamp, test, userAgent, screenSize } = await req.json();
    
    console.log("Received test webhook request:", {
      timestamp,
      test,
      userAgent,
      screenSize,
    });

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Skip JWT validation for this test
    console.log("Processing webhook test without JWT validation");

    // Test result object to store various test results
    const testResults = {
      webhookEndpoint: await testWebhookEndpoint(),
      asaasAccount: await testAsaasApiConnection(),
      jwtVerificationDisabled: true,
    };

    // Return test results
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        testResults,
        message: "Webhook test completed successfully",
        recommendations: getRecommendations(testResults),
        jwtVerificationDisabled: true,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error in test-webhook function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unexpected error during webhook test",
        details: {
          stack: error.stack,
          name: error.name,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});

// Function to test the webhook endpoint by making a simple GET request
async function testWebhookEndpoint() {
  try {
    const webhookUrl = `${supabaseUrl}/functions/v1/asaas-webhook?test=true`;
    console.log(`Testing webhook endpoint: ${webhookUrl}`);

    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const status = response.status;
    const responseText = await response.text();
    console.log(`Webhook endpoint test result: ${status} - ${responseText}`);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    return {
      success: status >= 200 && status < 300,
      status,
      responseData,
      error: status >= 400 ? `HTTP Error ${status}` : null,
    };
  } catch (error) {
    console.error("Error testing webhook endpoint:", error);
    return {
      success: false,
      status: null,
      error: error.message || "Failed to connect to webhook endpoint",
    };
  }
}

// Function to test Asaas API connection
async function testAsaasApiConnection() {
  try {
    if (!asaasApiKey) {
      return {
        success: false,
        status: "missing_key",
        error: "Asaas API Key is not configured",
      };
    }

    // Test with a simple API call that doesn't modify data
    const response = await fetch(
      "https://sandbox.asaas.com/api/v3/customers?limit=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access_token": asaasApiKey,
        },
      }
    );

    const status = response.status;
    const responseData = await response.json();

    return {
      success: status >= 200 && status < 300,
      status,
      data: responseData,
      error: status >= 400 ? `Asaas API Error: ${status}` : null,
    };
  } catch (error) {
    console.error("Error testing Asaas API connection:", error);
    return {
      success: false,
      status: "connection_error",
      error: error.message || "Failed to connect to Asaas API",
    };
  }
}

// Function to provide helpful recommendations based on test results
function getRecommendations(testResults) {
  const recommendations = [];

  if (!testResults.webhookEndpoint.success) {
    recommendations.push(
      "Verifique se a função asaas-webhook está implantada corretamente no Supabase"
    );
    recommendations.push(
      "Verifique as permissões da função e se está acessível publicamente"
    );
  }

  if (!testResults.asaasAccount.success) {
    recommendations.push(
      "Verifique se a chave API do Asaas está configurada corretamente"
    );
    recommendations.push(
      "Confirme se a conta do Asaas está ativa e se a chave API tem permissões adequadas"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Tudo parece estar configurado corretamente. Você pode registrar o webhook no painel do Asaas."
    );
  }

  return recommendations;
}
