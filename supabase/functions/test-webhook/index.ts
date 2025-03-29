
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") || "";
const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const requestData = await req.json();
    console.log("Test webhook request data:", requestData);

    // Verify authentication
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Construct webhook test result structure
    const testResults = {
      webhookEndpoint: await testWebhookEndpoint(),
      asaasAccount: await testAsaasAccount(ASAAS_API_KEY),
      webhookToken: Boolean(ASAAS_WEBHOOK_TOKEN),
      installmentTest: await testInstallmentCreation()
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook test completed successfully",
        testResults,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in test-webhook function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Test the webhook endpoint with a simulated Asaas request
 */
async function testWebhookEndpoint() {
  try {
    console.log("Testing webhook endpoint...");
    const webhookUrl = "https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook";
    
    // Get webhook token if available
    const webhookToken = ASAAS_WEBHOOK_TOKEN || "test_webhook_token";
    
    // Simulate a request that looks like it comes from Asaas
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Java/1.8.0_282",  // Simulate Asaas Java user agent
        "access_token": ASAAS_API_KEY || "test_token", // Use API key if available, otherwise test token
        "asaas-access-token": webhookToken // Add webhook token in expected format
      },
      body: JSON.stringify({
        testMode: true,
        timestamp: new Date().toISOString(),
        event: "TEST_EVENT",
        payment: {
          id: "test_payment_id",
          status: "PENDING",
          externalReference: "test_external_reference",
          installmentCount: 8, // Add installment info in test data
          billingType: "CREDIT_CARD"
        }
      })
    });
    
    const responseText = await response.text();
    console.log("Webhook endpoint response status:", response.status);
    console.log("Webhook endpoint response:", responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { rawResponse: responseText };
    }
    
    // Consider the test successful if we get a 200 OK, even with an error message
    // This is because the webhook might return a "success: false" with status 200
    // to prevent Asaas from retrying
    const success = response.status === 200;
    return {
      success,
      status: response.status,
      response: responseData,
      error: success ? null : `Webhook returned status ${response.status}`
    };
  } catch (error) {
    console.error("Error testing webhook endpoint:", error);
    return {
      success: false,
      status: 0,
      error: error.message || "Failed to connect to webhook endpoint"
    };
  }
}

/**
 * Test the Asaas account connectivity
 */
async function testAsaasAccount(apiKey) {
  if (!apiKey) {
    return {
      success: false,
      status: 0,
      error: "No Asaas API key configured"
    };
  }
  
  try {
    console.log("Testing Asaas account connectivity...");
    
    // Try to ping Asaas API (sandbox environment)
    const response = await fetch("https://sandbox.asaas.com/api/v3/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      }
    });
    
    console.log("Asaas API response status:", response.status);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log("Asaas API response:", data);
      return {
        success: true,
        status: response.status,
        data: { customersCount: data.data ? data.data.length : 0 }
      };
    } else {
      const errorText = await response.text();
      console.error("Asaas API error:", errorText);
      return {
        success: false,
        status: response.status,
        error: `Asaas API returned status ${response.status}: ${errorText}`
      };
    }
  } catch (error) {
    console.error("Error testing Asaas account:", error);
    return {
      success: false,
      status: 0,
      error: error.message || "Failed to connect to Asaas API"
    };
  }
}

/**
 * Test the creation of installments in Asaas
 */
async function testInstallmentCreation() {
  if (!ASAAS_API_KEY) {
    return {
      success: false,
      status: 0,
      error: "No Asaas API key configured"
    };
  }
  
  try {
    console.log("Testing Asaas installment creation...");
    
    // Criar um cliente de teste temporário para o parcelamento
    const customerResponse = await fetch("https://sandbox.asaas.com/api/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY
      },
      body: JSON.stringify({
        name: "Cliente Teste Webhook",
        email: "teste_webhook@example.com",
        cpfCnpj: "11111111111",
        mobilePhone: "67999999999"
      })
    });
    
    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      throw new Error(`Failed to create test customer: ${errorText}`);
    }
    
    const customer = await customerResponse.json();
    console.log("Test customer created:", customer);
    
    // Criar um parcelamento de teste
    const installmentResponse = await fetch("https://sandbox.asaas.com/api/v3/installments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: "CREDIT_CARD",
        value: 100,
        description: "Teste de parcelamento via webhook",
        externalReference: "test_installment_webhook_" + Date.now(),
        installmentCount: 3,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]
      })
    });
    
    if (!installmentResponse.ok) {
      const errorText = await installmentResponse.text();
      throw new Error(`Failed to create test installment: ${errorText}`);
    }
    
    const installment = await installmentResponse.json();
    console.log("Test installment created:", installment);
    
    // Agora, criar um link de pagamento que indica parcelamento
    const linkResponse = await fetch("https://sandbox.asaas.com/api/v3/paymentLinks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY
      },
      body: JSON.stringify({
        billingType: "CREDIT_CARD",
        chargeType: "DETACHED",
        name: "Teste de link parcelado",
        description: "Teste de link parcelado",
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
        value: 100,
        dueDateLimitDays: 1,
        installmentCount: 3,
        maxInstallmentCount: 3,
        externalReference: "test_link_installment_" + Date.now()
      })
    });
    
    if (!linkResponse.ok) {
      const errorText = await linkResponse.text();
      throw new Error(`Failed to create test payment link: ${errorText}`);
    }
    
    const link = await linkResponse.json();
    console.log("Test payment link created:", link);
    
    return {
      success: true,
      status: 200,
      data: {
        installmentId: installment.id,
        installmentCount: installment.installmentCount,
        paymentLinkId: link.id,
        paymentLinkUrl: link.url,
        maxInstallmentCount: link.maxInstallmentCount
      }
    };
    
  } catch (error) {
    console.error("Error testing installment creation:", error);
    return {
      success: false,
      status: 0,
      error: error.message || "Failed to test installment creation"
    };
  }
}
