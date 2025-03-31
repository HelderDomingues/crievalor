
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { 
  handleCreateCharge, 
  handleCreateCustomer, 
  handleCreateCreditCard, 
  handleDeleteCard,
  handleCreateSubscription,
  handleGetAllPayments,
  handleGetPayment,
  handleCancelSubscription,
  handleRequestRefund,
  handleGetCustomer
} from "./handlers.ts";
import { corsHeaders, getAsaasApiUrl } from './utils.ts';

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY') || '';
const ASAAS_WEBHOOK_TOKEN = Deno.env.get('ASAAS_WEBHOOK_TOKEN') || '';

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
      case "create-customer":
        result = await handleCreateCustomer(data, apiKey, isSandbox);
        break;
        
      case "create-charge":
        result = await handleCreateCharge(data, apiKey, isSandbox);
        break;

      case "create-credit-card":
        result = await handleCreateCreditCard(data, apiKey, isSandbox);
        break;
        
      case "delete-credit-card":
        result = await handleDeleteCard(data.cardId, apiKey, isSandbox);
        break;
        
      case "create-subscription":
        result = await handleCreateSubscription(data, apiKey, isSandbox);
        break;
        
      case "get-payments":
        result = await handleGetAllPayments(data, apiKey, isSandbox);
        break;
        
      case "get-payment":
        result = await handleGetPayment(data.paymentId, apiKey, isSandbox);
        break;
        
      case "cancel-subscription":
        result = await handleCancelSubscription(data, apiKey, isSandbox);
        break;
        
      case "request-refund":
        result = await handleRequestRefund(data, apiKey, isSandbox);
        break;
        
      case "get-customer":
        result = await handleGetCustomer(data.customerId, apiKey, isSandbox);
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
