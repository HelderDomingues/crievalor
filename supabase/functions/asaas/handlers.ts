
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getAsaasApiUrl, validateUrls, safeJsonParse } from './utils.ts';

// Handler para operações relacionadas a clientes
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

// Handler para operações relacionadas a pagamentos
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

// Handler para operações relacionadas a assinaturas
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

// Handler para operações relacionadas a links de pagamento
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

// Implementação de funções individuais de handler
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

// Handler para operações gerais de clientes e criação/verificação de clientes/usuários
export async function handleCreateCustomer(data: any, apiKey: string, isSandbox: boolean = false): Promise<any> {
  try {
    // Validation
    if (!data.name) return { success: false, error: "Nome do cliente é obrigatório" };
    if (!data.email) return { success: false, error: "Email do cliente é obrigatório" };
    if (!data.cpfCnpj) return { success: false, error: "CPF/CNPJ do cliente é obrigatório" };
    
    // Normalize CPF/CNPJ
    data.cpfCnpj = data.cpfCnpj.replace(/\D/g, '');
    
    // Get the base URL for Asaas API
    const asaasApiUrl = getAsaasApiUrl(isSandbox);
    
    // First, check if customer already exists by CPF/CNPJ
    const existingCustomer = await getCustomerByCpfCnpj(asaasApiUrl, apiKey, data.cpfCnpj);
    
    if (existingCustomer) {
      console.log("Cliente já existe no Asaas:", existingCustomer);
      
      // If needed, update customer data
      if (data.updateIfExists) {
        const updatedCustomer = await updateCustomer(asaasApiUrl, apiKey, existingCustomer.id, data);
        return {
          success: true,
          customer: updatedCustomer.customer,
          isNew: false,
          message: "Cliente atualizado com sucesso"
        };
      }
      
      return {
        success: true,
        customer: existingCustomer,
        isNew: false,
        message: "Cliente já existe no Asaas"
      };
    }
    
    // Customer doesn't exist, so create a new one
    console.log("Criando novo cliente no Asaas:", data);
    const result = await createCustomer(asaasApiUrl, apiKey, data);
    
    return {
      success: true,
      customer: result.customer,
      isNew: true,
      message: "Cliente criado com sucesso"
    };
  } catch (error) {
    console.error("Erro ao criar/recuperar cliente:", error);
    return {
      success: false,
      error: `Erro ao criar/recuperar cliente: ${error.message || "Erro desconhecido"}`
    };
  }
}

// Funções relacionadas a cobrança
export async function handleCreateCharge(data: any, apiKey: string, isSandbox: boolean = false): Promise<any> {
  try {
    // Add implementation for creating charges
    console.log("Creating charge for customer:", data);
    
    return {
      success: true,
      message: "Not implemented yet"
    };
  } catch (error) {
    console.error("Error creating charge:", error);
    return {
      success: false,
      error: `Error creating charge: ${error.message}`
    };
  }
}

/**
 * Buscar dados do cliente no Asaas
 */
export async function handleGetCustomer(customerId: string, apiKey: string, isSandbox: boolean = false) {
  try {
    if (!customerId) {
      return {
        success: false,
        error: "ID do cliente não fornecido"
      };
    }

    const asaasApiUrl = getAsaasApiUrl(isSandbox);
    const url = `${asaasApiUrl}/customers/${customerId}`;
    
    console.log(`Buscando cliente com ID: ${customerId}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      console.error("Erro ao buscar cliente:", errorData);
      return {
        success: false,
        error: `Erro ao buscar cliente: ${errorData.errors?.[0]?.description || response.statusText}`,
        details: errorData
      };
    }
    
    const customer = await response.json();
    
    return {
      success: true,
      customer
    };
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return {
      success: false,
      error: `Erro ao buscar cliente: ${error.message}`
    };
  }
}

// Funções relacionadas a cartões de crédito
export async function handleCreateCreditCard(data: any, apiKey: string, isSandbox: boolean = false): Promise<any> {
  // Implementação simulada
  return { success: true, message: "Credit card function not implemented yet" };
}

export async function handleDeleteCard(cardId: string, apiKey: string, isSandbox: boolean = false): Promise<any> {
  // Implementação simulada
  return { success: true, message: "Card deletion function not implemented yet" };
}

// Funções relacionadas a assinaturas
export async function handleCreateSubscription(data: any, apiKey: string, isSandbox: boolean = false): Promise<any> {
  // Implementação simulada
  return { success: true, message: "Subscription creation not implemented yet" };
}

// Funções relacionadas a pagamentos
export async function handleGetAllPayments(data: any, apiKey: string, isSandbox: boolean = false): Promise<any> {
  // Implementação simulada
  return { success: true, message: "Get all payments function not implemented yet" };
}

export async function handleRequestRefund(data: any, apiKey: string, isSandbox: boolean = false): Promise<any> {
  // Implementação simulada
  return { success: true, message: "Refund request function not implemented yet" };
}

// Implementação teste do webhook para cliente específico
export async function handleTestWebhookCustomer(customerId: string, apiKey: string): Promise<any> {
  try {
    // Primeiro, recupera os dados do cliente
    const customerResult = await handleGetCustomer(customerId, apiKey, true);
    
    if (!customerResult.success || !customerResult.customer) {
      return customerResult; // Retorna o erro
    }
    
    const customer = customerResult.customer;
    console.log("Cliente recuperado com sucesso:", customer);
    
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: "Variáveis de ambiente do Supabase não configuradas"
      };
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
      // Verificar se o cliente já existe localmente
      const { data: existingCustomer, error: findError } = await supabase
        .from("asaas_customers")
        .select("*")
        .eq("asaas_id", customer.id)
        .maybeSingle();
        
      if (findError) {
        console.error("Erro ao buscar cliente existente:", findError);
        return { 
          success: false, 
          error: "Erro ao buscar cliente existente", 
          details: findError 
        };
      }
      
      if (existingCustomer) {
        console.log("Cliente já existe no sistema:", existingCustomer);
        
        // Verificar se já existe um usuário associado
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", existingCustomer.user_id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Erro ao buscar perfil do usuário:", profileError);
          return {
            success: false,
            error: "Erro ao buscar perfil do usuário",
            details: profileError
          };
        }
        
        if (userProfile) {
          console.log("Perfil de usuário encontrado:", userProfile);
          
          // Enviar email de redefinição de senha
          const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: customer.email,
            options: {
              redirectTo: 'https://app.crievalor.com.br/auth?action=reset_password'
            }
          });
          
          if (resetError) {
            console.error("Erro ao enviar email de redefinição de senha:", resetError);
            return { 
              success: false, 
              error: "Erro ao enviar email de redefinição de senha", 
              details: resetError 
            };
          }
          
          console.log("Email de redefinição de senha enviado com sucesso");
          return { 
            success: true, 
            message: "Cliente já existe, email de redefinição de senha enviado", 
            customer: existingCustomer,
            userProfile,
            resetEmailSent: true
          };
        } else {
          console.log("Cliente existe mas não tem perfil de usuário. Criando novo perfil...");
          
          // Criar novo perfil de usuário
          const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
            email: customer.email,
            email_confirm: true,
            user_metadata: {
              full_name: customer.name,
              phone: customer.phone || customer.mobilePhone,
              cpf: customer.cpfCnpj
            }
          });
          
          if (userError) {
            console.error("Erro ao criar usuário:", userError);
            return { 
              success: false, 
              error: "Erro ao criar usuário", 
              details: userError 
            };
          }
          
          console.log("Novo usuário criado:", newUser);
          
          // Atualizar o registro do cliente com o ID do usuário
          const { error: updateError } = await supabase
            .from("asaas_customers")
            .update({ user_id: newUser.user.id })
            .eq("asaas_id", customer.id);
            
          if (updateError) {
            console.error("Erro ao atualizar cliente com ID do usuário:", updateError);
            return {
              success: false,
              error: "Erro ao atualizar cliente com ID do usuário",
              details: updateError
            };
          }
          
          // Enviar email de redefinição de senha
          const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: customer.email,
            options: {
              redirectTo: 'https://app.crievalor.com.br/auth?action=reset_password'
            }
          });
          
          if (resetError) {
            console.error("Erro ao enviar email de redefinição de senha:", resetError);
          } else {
            console.log("Email de redefinição de senha enviado com sucesso");
          }
          
          return { 
            success: true, 
            message: "Novo usuário criado e vinculado ao cliente existente", 
            customer: existingCustomer,
            newUser: newUser.user,
            resetEmailSent: !resetError
          };
        }
      } else {
        console.log("Cliente não existe no sistema. Criando novo usuário e registro de cliente...");
        
        // Criar novo usuário
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: customer.email,
          email_confirm: true,
          user_metadata: {
            full_name: customer.name,
            phone: customer.phone || customer.mobilePhone,
            cpf: customer.cpfCnpj
          }
        });
        
        if (userError) {
          console.error("Erro ao criar usuário:", userError);
          return { 
            success: false, 
            error: "Erro ao criar usuário", 
            details: userError 
          };
        }
        
        console.log("Novo usuário criado:", newUser);
        
        // Criar registro de cliente
        const { data: newCustomerRecord, error: customerError } = await supabase
          .from("asaas_customers")
          .insert({
            asaas_id: customer.id,
            user_id: newUser.user.id,
            email: customer.email,
            cpf_cnpj: customer.cpfCnpj
          })
          .select()
          .single();
          
        if (customerError) {
          console.error("Erro ao criar registro de cliente:", customerError);
          return { 
            success: false, 
            error: "Erro ao criar registro de cliente", 
            details: customerError 
          };
        }
        
        console.log("Novo registro de cliente criado:", newCustomerRecord);
        
        // Enviar email de redefinição de senha
        const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: customer.email,
          options: {
            redirectTo: 'https://app.crievalor.com.br/auth?action=reset_password'
          }
        });
        
        if (resetError) {
          console.error("Erro ao enviar email de redefinição de senha:", resetError);
        } else {
          console.log("Email de redefinição de senha enviado com sucesso");
        }
        
        return { 
          success: true, 
          message: "Novo usuário e registro de cliente criados com sucesso", 
          customer: newCustomerRecord,
          newUser: newUser.user,
          resetEmailSent: !resetError
        };
      }
    } catch (error) {
      console.error("Erro durante o teste de webhook:", error);
      return { 
        success: false, 
        error: "Erro durante o teste de webhook", 
        details: error.message 
      };
    }
  } catch (error) {
    console.error("Erro durante o teste de webhook:", error);
    return { 
      success: false, 
      error: "Erro durante o teste de webhook", 
      details: error.message 
    };
  }
}
