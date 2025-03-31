
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { 
  handleCustomer, 
  handlePayment, 
  handleSubscription, 
  handlePaymentLink 
} from './handlers.ts';
import { corsHeaders, getAsaasApiUrl } from './utils.ts';

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY') || '';
const ASAAS_WEBHOOK_TOKEN = Deno.env.get('ASAAS_WEBHOOK_TOKEN') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    if (!action) {
      throw new Error('No action specified');
    }

    console.log(`Received action: ${action}`, data);

    let result;
    switch (action) {
      // Customer related actions
      case 'get-customers':
      case 'get-customer':
      case 'get-customer-by-cpf-cnpj':
      case 'create-customer':
      case 'update-customer':
      case 'delete-customer':
        result = await handleCustomer(action, data, ASAAS_API_KEY);
        break;

      // Payment related actions
      case 'check-existing-payments':
      case 'create-payment':
      case 'get-payments':
      case 'get-payment':
      case 'get-payment-by-reference':
        result = await handlePayment(action, data, ASAAS_API_KEY);
        break;

      // Subscription related actions
      case 'cancel-subscription':
        result = await handleSubscription(action, data, ASAAS_API_KEY);
        break;

      // Payment link related actions
      case 'get-payment-link':
        result = await handlePaymentLink(action, data, ASAAS_API_KEY);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
