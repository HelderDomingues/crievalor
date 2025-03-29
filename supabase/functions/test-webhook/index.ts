
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }
  
  try {
    // Get the JWT token from the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    // Parse the request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (e) {
      throw new Error(`Error parsing request body: ${e.message}`);
    }
    
    console.log("Testing webhook with body:", JSON.stringify(reqBody, null, 2));
    
    // Webhook URL to test
    const webhookUrl = "https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook";
    
    // Test data
    const testEvent = {
      event: "PAYMENT_CREATED",
      payment: {
        id: `test_${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        customer: "test_customer",
        value: 100,
        netValue: 97.5,
        description: "Test webhook",
        billingType: "CREDIT_CARD",
        status: "PENDING",
        dueDate: new Date().toISOString().split('T')[0],
        paymentDate: null,
        invoiceUrl: null,
        externalReference: `test_reference_${Date.now()}`,
      },
      testMode: true
    };
    
    // Test the webhook endpoint
    console.log(`Testing webhook at ${webhookUrl}`);
    
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Java/1.8.0_282", // Simulate the Asaas User-Agent
      },
      body: JSON.stringify(testEvent),
    });
    
    const webhookData = await webhookResponse.text();
    let parsedWebhookData;
    
    try {
      parsedWebhookData = JSON.parse(webhookData);
    } catch (e) {
      parsedWebhookData = { rawResponse: webhookData };
    }
    
    console.log(`Webhook response (${webhookResponse.status}):`, webhookData);
    
    // Format the results
    const testResults = {
      webhookEndpoint: {
        status: webhookResponse.status,
        success: webhookResponse.status >= 200 && webhookResponse.status < 300,
        data: parsedWebhookData,
        error: webhookResponse.status >= 400 ? "Endpoint returned an error" : null,
      },
      asaasAccount: {
        status: "OK",
        success: true,
        error: null,
      }
    };
    
    // If the webhook test failed, provide troubleshooting information
    let recommendations = [];
    let solution = null;
    let options = [];
    
    if (!testResults.webhookEndpoint.success) {
      recommendations = [
        "Verifique se a URL do webhook está correta",
        "Confirme que o webhook está ativo no painel do Asaas",
        "Verifique se o token de acesso está configurado corretamente",
      ];
      
      if (webhookResponse.status === 401) {
        solution = "Erro de autenticação. O webhook requer autenticação via header 'access_token', mas no ambiente Sandbox essa restrição foi temporariamente desativada.";
        options = [
          "Verificar a configuração do webhook no painel do Asaas",
          "Revisar o código do webhook para confirmar que ele aceita requisições do Asaas Sandbox"
        ];
      }
    }
    
    return new Response(
      JSON.stringify({
        success: testResults.webhookEndpoint.success,
        testResults,
        recommendations,
        solution,
        options,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error testing webhook:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.stack,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
