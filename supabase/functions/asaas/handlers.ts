import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getAsaasApiUrl, validateUrls, safeJsonParse } from './utils.ts';

// Handler for customer-related endpoints
export async function handleCustomer(action: string, data: any, apiKey: string): Promise<any> {
  try {
    if (!action) {
      throw new Error("No action specified");
    }

    const baseUrl = getAsaasApiUrl();
    
    switch (action) {
      case 'get-customers':
        return await getCustomers(baseUrl, apiKey);
      
      case 'get-customer':
        if (!data?.customerId) {
          throw new Error("Customer ID is required");
        }
        return await getCustomer(baseUrl, apiKey, data.customerId);
      
      case 'get-customer-by-cpf-cnpj':
        if (!data?.cpfCnpj) {
          throw new Error("CPF/CNPJ is required");
        }
        
        // Normalize and sanitize input
        const formattedCpfCnpj = data.cpfCnpj.replace(/\D/g, '');
        console.log(`Searching for customer with CPF/CNPJ: ${formattedCpfCnpj}`);
        
        const customer = await getCustomerByCpfCnpj(baseUrl, apiKey, formattedCpfCnpj);
        return { customer };
      
      case 'create-customer':
        // Validate and sanitize input data
        if (!data?.name) {
          throw new Error("Customer name is required");
        }
        
        // Add a request timestamp to help debug potential caching issues
        const timestamp = new Date().toISOString();
        console.log(`Processing create-customer request at ${timestamp}`, data);
        
        const result = await createCustomer(baseUrl, apiKey, data);
        return result;
      
      case 'update-customer':
        if (!data?.customerId) {
          throw new Error("Customer ID is required");
        }
        return await updateCustomer(baseUrl, apiKey, data.customerId, data);
      
      case 'delete-customer':
        if (!data?.customerId) {
          throw new Error("Customer ID is required");
        }
        return await deleteCustomer(baseUrl, apiKey, data.customerId);
      
      case 'get-customer':
        if (!data?.id) {
          throw new Error("Customer ID is required");
        }
        return await handleGetCustomer(data.id, apiKey, false);
      
      case 'get-customer-sandbox':
        if (!data?.id) {
          throw new Error("Customer ID is required");
        }
        return await handleGetCustomer(data.id, apiKey, true);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error handling customer request:', error);
    throw error;
  }
}

// Payment related functions
export async function handlePayment(action: string, data: any, apiKey: string): Promise<any> {
  const baseUrl = getAsaasApiUrl();
  
  switch (action) {
    case 'check-existing-payments':
      return await checkExistingPayments(data, apiKey);
    
    case 'create-payment':
      return await createPayment(data, apiKey);
    
    case 'get-payments':
      return await getPayments(baseUrl, apiKey);
    
    case 'get-payment':
      if (!data.paymentId) throw new Error('Payment ID is required');
      return await getPayment(baseUrl, apiKey, data.paymentId);
    
    case 'get-payment-by-reference':
      if (!data.externalReference) throw new Error('External reference is required');
      return await getPaymentByReference(baseUrl, apiKey, data.externalReference);
      
    default:
      throw new Error(`Unknown payment action: ${action}`);
  }
}

// Subscription related functions
export async function handleSubscription(action: string, data: any, apiKey: string): Promise<any> {
  const baseUrl = getAsaasApiUrl();
  
  switch (action) {
    case 'cancel-subscription':
      if (!data.subscriptionId) throw new Error('Subscription ID is required');
      return await cancelSubscription(baseUrl, apiKey, data.subscriptionId);
      
    default:
      throw new Error(`Unknown subscription action: ${action}`);
  }
}

// Payment link related functions
export async function handlePaymentLink(action: string, data: any, apiKey: string): Promise<any> {
  const baseUrl = getAsaasApiUrl();
  
  switch (action) {
    case 'get-payment-link':
      if (!data.linkId) throw new Error('Link ID is required');
      return await getPaymentLink(baseUrl, apiKey, data.linkId);
      
    default:
      throw new Error(`Unknown payment link action: ${action}`);
  }
}

// Implementation of individual handler functions
async function getCustomers(baseUrl: string, apiKey: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get customers: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { customers: data.data || [] };
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
}

async function getCustomer(baseUrl: string, apiKey: string, customerId: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get customer: ${response.status} ${errorText}`);
    }

    const customer = await response.json();
    return { customer };
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
}

async function getCustomerByCpfCnpj(baseUrl: string, apiKey: string, cpfCnpj: string): Promise<any> {
  try {
    // Format CPF/CNPJ (remove non-numeric characters)
    const formattedCpfCnpj = cpfCnpj.replace(/\D/g, '');
    
    console.log(`Verificando cliente por CPF/CNPJ: ${formattedCpfCnpj}`);
    
    const response = await fetch(`${baseUrl}/customers?cpfCnpj=${formattedCpfCnpj}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to get customer by CPF/CNPJ: ${response.status} ${errorText}`);
      return null;
    }

    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      const customer = data.data[0];
      console.log(`Found existing customer for CPF/CNPJ ${formattedCpfCnpj}:`, customer);
      return customer;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting customer by CPF/CNPJ:', error);
    return null;
  }
}

async function createCustomer(baseUrl: string, apiKey: string, customerData: any): Promise<any> {
  try {
    // Log the raw input data for debugging
    console.log("Creating customer with data:", JSON.stringify(customerData));
    
    // Clean up phone numbers - ensure they only contain digits
    if (customerData.phone) {
      customerData.phone = customerData.phone.replace(/\D/g, '');
    }
    
    if (customerData.mobilePhone) {
      customerData.mobilePhone = customerData.mobilePhone.replace(/\D/g, '');
    }
    
    // Ensure CPF/CNPJ is clean
    if (customerData.cpfCnpj) {
      customerData.cpfCnpj = customerData.cpfCnpj.replace(/\D/g, '');
    }
    
    // Validate required fields
    if (!customerData.name || !customerData.email || !customerData.cpfCnpj) {
      throw new Error("Missing required fields: name, email, and cpfCnpj are required");
    }
    
    console.log("Creating customer with cleaned data:", JSON.stringify(customerData));
    
    const response = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(customerData),
    });

    const responseText = await response.text();
    console.log(`Asaas customer creation response (${response.status}):`, responseText);
    
    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.status} - ${responseText}`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Failed to parse response: ${responseText}`);
    }

    return { customer: responseData };
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

async function updateCustomer(baseUrl: string, apiKey: string, customerId: string, customerData: any): Promise<any> {
  try {
    // Clean up phone numbers if present
    if (customerData.phone) {
      customerData.phone = customerData.phone.replace(/\D/g, '');
    }
    
    if (customerData.mobilePhone) {
      customerData.mobilePhone = customerData.mobilePhone.replace(/\D/g, '');
    }
    
    const response = await fetch(`${baseUrl}/customers/${customerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update customer: ${response.status} ${errorText}`);
    }

    return { customer: await response.json() };
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

async function deleteCustomer(baseUrl: string, apiKey: string, customerId: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}/customers/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete customer: ${response.status} ${errorText}`);
    }

    return { success: true, message: "Customer deleted successfully" };
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}

async function checkExistingPayments(data: any, apiKey: string): Promise<any> {
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
        
        // Verificar se o link de pagamento ainda é válido
        try {
          if (dbSubscription.asaas_payment_link.includes('/') && dbSubscription.asaas_payment_link.split('/').pop()) {
            const linkId = dbSubscription.asaas_payment_link.split('/').pop();
            const baseUrl = getAsaasApiUrl();
            const response = await fetch(`${baseUrl}/paymentLinks/${linkId}`, {
              headers: {
                'Content-Type': 'application/json',
                'access_token': apiKey,
              },
            });
            
            if (response.ok) {
              const linkData = await response.json();
              if (linkData && linkData.active !== false) {
                console.log("Link de pagamento ainda válido:", dbSubscription.asaas_payment_link);
                return { paymentLink: dbSubscription.asaas_payment_link, dbSubscription: dbSubscription };
              } else {
                console.log("Link de pagamento expirado ou inválido, gerando novo link");
              }
            }
          }
        } catch (e) {
          console.error("Erro ao verificar link de pagamento:", e);
          // Continue para criar um novo link
        }
      }
    }

    return { paymentLink: null, dbSubscription: null };
  } catch (error) {
    console.error("Error checking existing payments:", error);
    throw error;
  }
}

async function generatePaymentLink(baseUrl: string, apiKey: string, data: any): Promise<any> {
  try {
    console.log("Generating payment link with data:", data);
    
    const installments = Number(data.installments || 1);
    console.log(`Creating payment link with ${installments} installments`);
    
    // Validate callback URLs
    validateUrls(data.successUrl, data.cancelUrl);
    
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
        'access_token': apiKey,
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

async function createPayment(paymentData: any, apiKey: string): Promise<any> {
  try {
    console.log("Creating payment with data:", paymentData);
    const baseUrl = getAsaasApiUrl();
    
    // Validate callback URLs if they exist
    if (paymentData.successUrl && paymentData.cancelUrl) {
      validateUrls(paymentData.successUrl, paymentData.cancelUrl);
    }
    
    const installments = Number(paymentData.installments || 1);
    
    // Verificar se já existe um pagamento com a mesma referência externa
    const existingPayment = await getPaymentByReference(baseUrl, apiKey, paymentData.externalReference);
    if (existingPayment) {
      console.log("Found existing payment with same reference, returning it:", existingPayment);
      
      // Verificar se existe link de pagamento
      const existingPayments = await checkExistingPayments({
        customerId: paymentData.customerId,
        planId: paymentData.planId,
        userId: paymentData.userId,
        installments: installments
      }, apiKey);
      
      if (existingPayments.dbSubscription && existingPayments.paymentLink) {
        return {
          payment: existingPayment,
          paymentLink: existingPayments.paymentLink
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
      
      const paymentLink = await generatePaymentLink(baseUrl, apiKey, linkData);
      return {
        payment: existingPayment,
        paymentLink: paymentLink.url
      };
    }
    
    // IMPORTANT: For simplicity, we'll just create a direct payment link without attempting to create an installment
    // This avoids the "No payments were created in the installment" error by skipping the complex installment logic
    console.log(`Creating payment link directly for ${installments} installments`);
    
    // Create a payment link directly
    const linkData = {
      description: paymentData.description,
      billingType: paymentData.billingType,
      value: paymentData.value,
      successUrl: paymentData.successUrl,
      cancelUrl: paymentData.cancelUrl,
      endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
      externalReference: paymentData.externalReference,
      installments: installments
    };
    
    const paymentLink = await generatePaymentLink(baseUrl, apiKey, linkData);
    
    // Create a single payment to track in the system - this is optional but helps with tracking
    const paymentResponse = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      body: JSON.stringify({
        customer: paymentData.customerId,
        billingType: paymentData.billingType,
        value: paymentData.value,
        dueDate: paymentData.dueDate,
        description: paymentData.description,
        externalReference: paymentData.externalReference,
        postalService: paymentData.postalService || false,
      }),
    });
    
    let payment = null;
    if (paymentResponse.ok) {
      payment = await paymentResponse.json();
      console.log("Single payment record created:", payment);
    } else {
      console.log("Could not create payment record, but payment link was generated");
    }
    
    return { 
      payment: payment, 
      paymentLink: paymentLink.url 
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

async function getPayments(baseUrl: string, apiKey: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}/payments`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
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

async function getPayment(baseUrl: string, apiKey: string, paymentId: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
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

async function getPaymentByReference(baseUrl: string, apiKey: string, externalReference: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}/payments?externalReference=${externalReference}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
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

async function cancelSubscription(baseUrl: string, apiKey: string, subscriptionId: string): Promise<any> {
  try {
    console.log(`Canceling subscription: ${subscriptionId}`);
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
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

async function getPaymentLink(baseUrl: string, apiKey: string, linkId: string): Promise<any> {
  try {
    console.log(`Getting payment link: ${linkId}`);
    const response = await fetch(`${baseUrl}/paymentLinks/${linkId}`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
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

async function handleGetCustomer(id, apiKey, isSandbox) {
  try {
    // Construct API endpoint
    const apiUrl = `${isSandbox ? 'https://sandbox.asaas.com/api/v3' : 'https://www.asaas.com/api/v3'}/customers/${id}`;
    
    console.log(`Getting customer info from: ${apiUrl}`);
    
    // Make the request to Asaas API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });
    
    // Parse the JSON response
    const data = await response.json();
    
    console.log(`Customer data response:`, data);
    
    if (response.ok) {
      return {
        success: true,
        customer: data
      };
    } else {
      return {
        success: false,
        error: data.errors ? data.errors[0].description : 'Failed to get customer information',
        details: data
      };
    }
  } catch (error) {
    console.error(`Error in handleGetCustomer:`, error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      details: error
    };
  }
}
