
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, getAsaasApiUrl } from './utils.ts';
import { 
  handleCustomer,
  handlePayment,
  handleSubscription,
  handlePaymentLink,
  handleCreateCustomer, 
  handleCreateCharge, 
  handleCreateCreditCard, 
  handleDeleteCard,
  handleCreateSubscription,
  handleGetAllPayments,
  handleGetPayment,
  handleGetCustomer,
  handleRequestRefund,
  handleTestWebhookCustomer
} from "./handlers.ts";

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY') || '';

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Get API key from environment variables
    const apiKey = Deno.env.get("ASAAS_API_KEY");
    if (!apiKey) {
      throw new Error("ASAAS_API_KEY is not set in the environment variables");
    }
    
    // Determine if we're using sandbox mode
    const isSandbox = true; // Always use sandbox for now
    
    // Parse request body
    const { action, data } = await req.json();
    
    console.log(`Received action: ${action}`, data);
    
    let result;
    
    // Switch between different actions
    switch (action) {
      // Customer actions
      case "get-customers":
      case "get-customer":
      case "get-customer-by-cpf-cnpj":
      case "update-customer":
      case "delete-customer":
        result = await handleCustomer(action, data, apiKey);
        break;
        
      case "create-customer":
        result = await handleCreateCustomer(data, apiKey, isSandbox);
        break;
        
      // Payment actions
      case "create-charge":
        result = await handleCreateCharge(data, apiKey, isSandbox);
        break;
        
      case "get-payments":
      case "get-payment":
      case "get-payment-by-reference":
      case "check-existing-payments":
      case "create-payment":
        result = await handlePayment(action, data, apiKey);
        break;

      // Card actions
      case "create-credit-card":
        result = await handleCreateCreditCard(data, apiKey, isSandbox);
        break;
        
      case "delete-credit-card":
        result = await handleDeleteCard(data.cardId, apiKey, isSandbox);
        break;
        
      // Subscription actions
      case "create-subscription":
        result = await handleCreateSubscription(data, apiKey, isSandbox);
        break;
        
      case "cancel-subscription":
        result = await handleSubscription(action, data, apiKey);
        break;
        
      // Payment link actions
      case "get-payment-link":
        result = await handlePaymentLink(action, data, apiKey);
        break;
        
      // Refund actions
      case "request-refund":
        result = await handleRequestRefund(data, apiKey, isSandbox);
        break;
        
      // Direct customer access
      case "get-customer":
        result = await handleGetCustomer(data.customerId, apiKey, isSandbox);
        break;
      
      // Special test case for webhook customer processing  
      case "test-webhook-customer":
        console.log("Testando recuperação de cliente específico e criação de usuário");
        const customerId = data.customerId || "cus_000006606255"; // Use o ID fornecido ou o default Pedro Gaudioso
        result = await handleTestWebhookCustomer(customerId, apiKey);
        break;
        
      default:
        result = {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Error in Asaas edge function:`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
