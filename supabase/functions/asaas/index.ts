import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`Received action: ${action}`);

    let result;
    switch (action) {
      case 'get-customers':
        result = await getCustomers();
        break;
      case 'get-customer':
        result = await getCustomer(data.customerId);
        break;
      case 'create-customer':
        result = await createCustomer(data);
        break;
      case 'update-customer':
        result = await updateCustomer(data.customerId, data);
        break;
      case 'delete-customer':
        result = await deleteCustomer(data.customerId);
        break;
      case 'check-existing-payments':
        result = await checkExistingPayments(data);
        break;
      case 'create-payment':
        result = await createPayment(data);
        break;
      case 'get-payments':
        result = await getPayments();
        break;
      case 'get-payment':
        result = await getPayment(data.paymentId);
        break;
      case 'get-payment-by-reference':
        result = await getPaymentByReference(data.externalReference);
        break;
      case 'cancel-subscription':
        result = await cancelSubscription(data.subscriptionId);
        break;
      case 'get-payment-link':
        result = await getPaymentLink(data.linkId);
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

function getAsaasApiUrl(): string {
  const isProd = Deno.env.get('ENVIRONMENT') === 'PROD';
  return isProd ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';
}

async function getCustomers(): Promise<any> {
  try {
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/customers`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

async function getCustomer(customerId: string): Promise<any> {
  try {
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/customers/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
}

async function createCustomer(customerData: any): Promise<any> {
  try {
    console.log("Creating customer with data:", customerData);
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Asaas customer creation:", errorText);
      throw new Error(`Failed to create customer: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

async function updateCustomer(customerId: string, customerData: any): Promise<any> {
  try {
    console.log(`Updating customer ${customerId} with data:`, customerData);
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/customers/${customerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

async function deleteCustomer(customerId: string): Promise<any> {
  try {
    console.log(`Deleting customer: ${customerId}`);
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/customers/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.status}`);
    }

    return { success: true, message: `Customer ${customerId} deleted successfully` };
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}

async function checkExistingPayments(data: any): Promise<any> {
  try {
    console.log("Checking existing payments with data:", data);
    const { customerId, planId, userId, installments } = data;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar assinatura pendente no banco de dados
    const { data: dbSubscription, error: dbError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("plan_id", planId)
      .eq("status", "pending")
      .maybeSingle();

    if (dbError) {
      console.error("Erro ao buscar assinatura no banco de dados:", dbError);
      throw new Error(`Erro ao buscar assinatura: ${dbError.message}`);
    }

    if (dbSubscription && dbSubscription.asaas_payment_link) {
      console.log("Encontrada assinatura pendente com link de pagamento:", dbSubscription);
      return { paymentLink: dbSubscription.asaas_payment_link, dbSubscription: dbSubscription };
    }

    return { paymentLink: null, dbSubscription: null };
  } catch (error) {
    console.error("Error checking existing payments:", error);
    throw error;
  }
}

async function generatePaymentLink(data: any): Promise<any> {
  try {
    console.log("Generating payment link with data:", data);
    const baseUrl = getAsaasApiUrl();
    
    const installments = Number(data.installments || 1);
    console.log(`Creating payment link with ${installments} installments`);
    
    const requestBody: any = {
      billingType: data.billingType || 'CREDIT_CARD',
      chargeType: 'DETACHED',
      name: data.description,
      description: data.description,
      endDate: null,
      value: data.value,
      dueDateLimitDays: 7,
      subscriptionCycle: null,
      maxInstallmentCount: data.billingType === 'CREDIT_CARD' ? (installments > 1 ? installments : 12) : 1,
      notificationEnabled: true,
      callback: {
        autoRedirect: true,
        successUrl: data.successUrl,
        autoRedirectTime: 5
      }
    };
    
    console.log("Payment link request body:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${baseUrl}/v3/paymentLinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Asaas payment link creation:", errorText);
      throw new Error(`Failed to create payment link: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Payment link created:", result);
    
    return result;
  } catch (error) {
    console.error("Error generating payment link:", error);
    throw error;
  }
}

async function createPayment(paymentData: any): Promise<any> {
  try {
    console.log("Creating payment with data:", paymentData);
    const baseUrl = getAsaasApiUrl();
    
    const installments = Number(paymentData.installments || 1);
    
    // Base payment data
    const requestBody: any = {
      customer: paymentData.customerId,
      billingType: paymentData.billingType,
      value: paymentData.value,
      dueDate: paymentData.dueDate,
      description: paymentData.description,
      externalReference: paymentData.externalReference,
      postalService: paymentData.postalService || false,
    };
    
    if (installments > 1 && paymentData.billingType === 'CREDIT_CARD') {
      // For credit card payments with installments
      console.log(`Creating payment with ${installments} installments via credit card`);
      requestBody.installmentCount = installments;
      requestBody.installmentValue = (paymentData.value / installments).toFixed(2);
      
      console.log("Credit card installment payment data:", JSON.stringify(requestBody, null, 2));
    } else {
      console.log(`Creating single payment via ${paymentData.billingType}`);
    }
    
    const response = await fetch(`${baseUrl}/v3/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Asaas payment creation:", errorText);
      throw new Error(`Failed to create payment: ${response.status} ${errorText}`);
    }
    
    const payment = await response.json();
    console.log("Payment created:", payment);
    
    // Generate a payment link for this payment
    const linkData = {
      description: paymentData.description,
      billingType: paymentData.billingType,
      value: paymentData.value,
      successUrl: paymentData.successUrl,
      installments: installments
    };
    
    const paymentLink = await generatePaymentLink(linkData);
    console.log("Payment link for this payment:", paymentLink);
    
    return { payment, paymentLink: paymentLink.url };
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

async function getPayments(): Promise<any> {
  try {
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/payments`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
}

async function getPayment(paymentId: string): Promise<any> {
  try {
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
}

async function getPaymentByReference(externalReference: string): Promise<any> {
  try {
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/payments?externalReference=${externalReference}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment by reference: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      return data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching payment by reference:', error);
    throw error;
  }
}

async function cancelSubscription(subscriptionId: string): Promise<any> {
  try {
    console.log(`Canceling subscription: ${subscriptionId}`);
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel subscription: ${response.status}`);
    }

    return { success: true, message: `Subscription ${subscriptionId} canceled successfully` };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

async function getPaymentLink(linkId: string): Promise<any> {
  try {
    console.log(`Getting payment link: ${linkId}`);
    const baseUrl = getAsaasApiUrl();
    const response = await fetch(`${baseUrl}/paymentLinks/${linkId}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment link: ${response.status}`);
    }

    return { paymentLink: await response.json() };
  } catch (error) {
    console.error('Error getting payment link:', error);
    throw error;
  }
}
