
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

    if (dbSubscription) {
      console.log("Encontrada assinatura pendente:", dbSubscription);
      
      // Verificar se as parcelas são as mesmas
      if (dbSubscription.installments !== installments) {
        console.log(`Número de parcelas diferente: DB=${dbSubscription.installments}, Solicitado=${installments}`);
        return { paymentLink: null, dbSubscription: dbSubscription, needsNewPayment: true };
      }
      
      if (dbSubscription.asaas_payment_link) {
        console.log("Encontrada assinatura pendente com link de pagamento:", dbSubscription);
        return { paymentLink: dbSubscription.asaas_payment_link, dbSubscription: dbSubscription };
      }
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
    
    // URL para configurar callback de pagamento no Asaas
    const callbackUrl = data.successUrl;
    
    const requestBody: any = {
      billingType: data.billingType || 'CREDIT_CARD',
      chargeType: 'DETACHED',
      name: data.description,
      description: `Pagamento ${data.description}`,
      endDate: data.endDate || null,
      value: data.value, // This should be the total value
      dueDateLimitDays: 1,
      subscriptionCycle: null,
      maxInstallmentCount: data.billingType === 'CREDIT_CARD' ? installments : 1,
      installmentCount: installments > 1 ? installments : null,
      notificationEnabled: true,
      externalReference: data.externalReference,
      callback: {
        autoRedirect: true,
        successUrl: data.successUrl,
        cancelUrl: data.cancelUrl,
        autoRedirectTime: 5
      }
    };
    
    console.log("Payment link request body:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${baseUrl}/paymentLinks`, {
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
    
    // Verificar se já existe um pagamento com a mesma referência externa
    const existingPayment = await getPaymentByReference(paymentData.externalReference);
    if (existingPayment) {
      console.log("Found existing payment with same reference, returning it:", existingPayment);
      
      // Verificar se existe link de pagamento
      const { data: dbSubscription } = await checkExistingPayments({
        customerId: paymentData.customerId,
        planId: paymentData.planId,
        userId: paymentData.userId
      });
      
      if (dbSubscription && dbSubscription.asaas_payment_link) {
        return {
          payment: existingPayment,
          paymentLink: dbSubscription.asaas_payment_link
        };
      }
      
      // Se não tiver link, gerar um novo
      const linkData = {
        description: paymentData.description,
        billingType: paymentData.billingType,
        value: paymentData.value, // Use total value here
        successUrl: paymentData.successUrl,
        cancelUrl: paymentData.cancelUrl,
        endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
        externalReference: paymentData.externalReference,
        installments: installments
      };
      
      const paymentLink = await generatePaymentLink(linkData);
      return {
        payment: existingPayment,
        paymentLink: paymentLink.url
      };
    }
    
    // Se o pagamento for parcelado, usamos a API de parcelamento do Asaas
    if (installments > 1 && paymentData.billingType === 'CREDIT_CARD') {
      console.log(`Creating payment with ${installments} installments via API de parcelamento`);
      
      // Criar um novo parcelamento usando a API específica
      const installmentRequestBody = {
        customer: paymentData.customerId,
        billingType: paymentData.billingType,
        value: paymentData.value, // Total value for all installments
        description: paymentData.description,
        externalReference: paymentData.externalReference,
        postalService: paymentData.postalService || false,
        installmentCount: installments,
        dueDate: paymentData.dueDate
      };
      
      console.log("Installment request body:", JSON.stringify(installmentRequestBody, null, 2));
      
      const installmentResponse = await fetch(`${baseUrl}/installments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(installmentRequestBody),
      });
      
      if (!installmentResponse.ok) {
        const errorText = await installmentResponse.text();
        console.error("Error response from Asaas installment creation:", errorText);
        throw new Error(`Failed to create installment: ${installmentResponse.status} ${errorText}`);
      }
      
      const installmentResult = await installmentResponse.json();
      console.log("Installment created:", installmentResult);
      
      // Obter o primeiro pagamento para retornar
      if (installmentResult && installmentResult.installments && installmentResult.installments.length > 0) {
        const firstPayment = installmentResult.installments[0];
        
        // Gerar link de pagamento
        const linkData = {
          description: paymentData.description,
          billingType: paymentData.billingType,
          value: paymentData.value, // Total value
          successUrl: paymentData.successUrl,
          cancelUrl: paymentData.cancelUrl,
          endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
          externalReference: paymentData.externalReference,
          installments: installments
        };
        
        const paymentLink = await generatePaymentLink(linkData);
        
        return {
          payment: firstPayment,
          paymentLink: paymentLink.url,
          installmentId: installmentResult.id
        };
      } else {
        throw new Error("No payments were created in the installment");
      }
    } else {
      // Para pagamentos à vista, usar a API regular
      console.log(`Creating single payment via ${paymentData.billingType}`);
      
      // Base payment data
      const requestBody: any = {
        customer: paymentData.customerId,
        billingType: paymentData.billingType,
        value: paymentData.value, // Total value
        dueDate: paymentData.dueDate,
        description: paymentData.description,
        externalReference: paymentData.externalReference,
        postalService: paymentData.postalService || false,
      };
      
      console.log("Single payment request body:", JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${baseUrl}/payments`, {
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
        value: paymentData.value, // Total value
        successUrl: paymentData.successUrl,
        cancelUrl: paymentData.cancelUrl,
        endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
        externalReference: paymentData.externalReference,
        installments: installments
      };
      
      const paymentLink = await generatePaymentLink(linkData);
      console.log("Payment link for this payment:", paymentLink);
      
      return { payment, paymentLink: paymentLink.url };
    }
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
