import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";
let ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") || "";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar a chave da API Asaas da tabela system_settings, se não estiver disponível como variável de ambiente
    if (!ASAAS_API_KEY) {
      console.log("Buscando ASAAS_API_KEY da tabela system_settings");
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'ASAAS_API_KEY')
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar ASAAS_API_KEY:", error);
        throw new Error("Não foi possível obter a chave da API Asaas do banco de dados");
      }

      if (data && data.value) {
        ASAAS_API_KEY = data.value;
        console.log(`ASAAS_API_KEY obtida da tabela system_settings`);
      }
    }

    // Verificar se a chave da API Asaas está configurada
    if (!ASAAS_API_KEY) {
      throw new Error("ASAAS_API_KEY não está configurada");
    }
    
    // Verificar autenticação do usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token de autenticação não fornecido");
    }
    
    // Verificar o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    
    if (userError || !user) {
      throw new Error("Usuário não autenticado");
    }
    
    console.log("Usuário autenticado:", user.id);
    
    // Extrair ação e dados do corpo da requisição
    const { action, data } = await req.json();
    console.log(`Processando ação: ${action}`, data);
    
    // Processar a ação solicitada
    switch (action) {
      case "create-customer":
        return await createCustomer(req, data, user.id);
        
      case "get-customer":
        return await getCustomer(req, data, user.id);
        
      case "get-customer-by-cpf-cnpj":
        return await getCustomerByCpfCnpj(req, data, user.id);
        
      case "create-payment":
        return await createPayment(req, data, user.id, supabase);
        
      case "get-payment":
        return await getPayment(req, data, user.id);
        
      case "get-payment-by-reference":
        return await getPaymentByReference(req, data, user.id);
        
      case "get-payment-link":
        return await getPaymentLink(req, data, user.id);
        
      case "get-payments":
        return await getPayments(req, data, user.id);
        
      case "check-existing-payments":
        return await checkExistingPayments(req, data, user.id, supabase);
        
      case "get-subscription":
        return await getSubscription(req, data, user.id, supabase);
        
      case "cancel-subscription":
        return await cancelSubscription(req, data, user.id);
      
      case "delete-customer":
        return await deleteCustomer(req, data, user.id, supabase);
        
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função auxiliar para fazer requisições à API Asaas
async function asaasRequest(endpoint: string, method: string, body?: any) {
  console.log(`Fazendo requisição ${method} para API Asaas: ${ASAAS_API_URL}${endpoint}`);
  
  const options: RequestInit = {
    method,
    headers: {
      "access_token": ASAAS_API_KEY,
      "Content-Type": "application/json"
    }
  };
  
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
    console.log("Request payload:", JSON.stringify(body, null, 2));
  }
  
  const response = await fetch(`${ASAAS_API_URL}${endpoint}`, options);
  console.log("Asaas API response status:", response.status);
  
  const data = await response.json();
  console.log("Asaas API response data:", JSON.stringify(data, null, 2));
  
  return { status: response.status, data };
}

// Função auxiliar para gerar links de pagamento
async function generatePaymentLink(data: any) {
  try {
    // Remover as propriedades de callback que estão causando o erro de domínio
    const { callback, ...safeData } = data;
    
    // Usar configurações simplificadas para evitar erros de domínio
    let paymentLinkData = {
      ...safeData,
      callback: {
        autoRedirect: true,
        successUrl: `https://crievalor.lovable.app/checkout/success`,
        cancelUrl: `https://crievalor.lovable.app/checkout/canceled`
      }
    };
    
    // Garantir que o maxInstallmentCount seja definido corretamente
    if (paymentLinkData.billingType === "CREDIT_CARD" && !paymentLinkData.maxInstallmentCount && data.installmentCount) {
      paymentLinkData.maxInstallmentCount = data.installmentCount;
    }
    
    console.log("Gerando link de pagamento com dados:", JSON.stringify(paymentLinkData, null, 2));
    
    const { status, data: paymentLink } = await asaasRequest("/paymentLinks", "POST", paymentLinkData);
    
    if (status !== 200 || !paymentLink) {
      console.error("Erro ao gerar link de pagamento:", paymentLink);
      throw new Error("Erro ao gerar link de pagamento");
    }
    
    return paymentLink;
  } catch (error) {
    console.error("Erro em generatePaymentLink:", error);
    throw error;
  }
}

// Criar novo cliente no Asaas
async function createCustomer(req: Request, data: any, userId: string) {
  const customerData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    mobilePhone: data.mobilePhone,
    cpfCnpj: data.cpfCnpj,
    address: data.address,
    postalCode: data.postalCode,
    externalReference: data.externalReference,
    notificationDisabled: false
  };
  
  console.log("Criando cliente com dados:", customerData);
  
  const { status, data: customer } = await asaasRequest("/customers", "POST", customerData);
  
  return new Response(
    JSON.stringify({ customer }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Buscar cliente por ID
async function getCustomer(req: Request, data: any, userId: string) {
  const { customerId } = data;
  
  if (!customerId) {
    throw new Error("ID do cliente não fornecido");
  }
  
  const { status, data: customer } = await asaasRequest(`/customers/${customerId}`, "GET");
  
  return new Response(
    JSON.stringify({ customer }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Buscar cliente por CPF/CNPJ
async function getCustomerByCpfCnpj(req: Request, data: any, userId: string) {
  const { cpfCnpj } = data;
  
  if (!cpfCnpj) {
    throw new Error("CPF/CNPJ não fornecido");
  }
  
  // Remover formatação para garantir consistência
  const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
  
  // Buscar todos os clientes com este CPF/CNPJ
  const { status, data: response } = await asaasRequest(`/customers?cpfCnpj=${cleanCpfCnpj}`, "GET");
  
  // Retornar o primeiro cliente encontrado, se houver
  const customer = response.data && response.data.length > 0 ? response.data[0] : null;
  
  return new Response(
    JSON.stringify({ customer }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Criar novo pagamento
async function createPayment(req: Request, data: any, userId: string, supabase: any) {
  const {
    customerId,
    planId,
    value,
    description,
    successUrl,
    cancelUrl,
    installments,
    billingType,
    dueDate,
    externalReference,
    postalService = false
  } = data;
  
  // Primeiro, verificar se já existe um pagamento pendente com esta referência
  const { status: checkStatus, data: existingPayments } = await asaasRequest(
    `/payments?externalReference=${externalReference}`,
    "GET"
  );
  
  if (existingPayments.data && existingPayments.data.length > 0) {
    const existingPayment = existingPayments.data[0];
    if (existingPayment.status === "PENDING") {
      console.log("Pagamento pendente encontrado:", existingPayment);
      
      // Gerar link de pagamento para o pagamento existente
      const paymentLink = await generatePaymentLink({
        name: description,
        description: `Pagamento ${description}`,
        endDate: "2025-04-02", // Data limite bem no futuro
        value: value,
        billingType,
        chargeType: "DETACHED",
        dueDateLimitDays: 1,
        externalReference,
        maxInstallmentCount: billingType === "CREDIT_CARD" ? installments : 1,
        installmentCount: billingType === "CREDIT_CARD" ? installments : 1
      });
      
      return new Response(
        JSON.stringify({
          payment: existingPayment,
          paymentLink: paymentLink.url
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  }
  
  // Verificar links de pagamento existentes
  const { status: linkCheckStatus, data: existingLinks } = await asaasRequest(
    `/paymentLinks?externalReference=${externalReference}`,
    "GET"
  );
  
  if (existingLinks.data && existingLinks.data.length > 0) {
    const existingLink = existingLinks.data[0];
    if (existingLink.active) {
      console.log("Link de pagamento ativo encontrado:", existingLink);
      return new Response(
        JSON.stringify({
          paymentLink: existingLink.url
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  }
  
  // Criar novo pagamento
  const paymentData: any = {
    customer: customerId,
    billingType,
    value,
    description,
    dueDate,
    externalReference
  };
  
  // Adicionar configuração de parcelamento para cartão de crédito
  if (billingType === "CREDIT_CARD" && installments > 1) {
    paymentData.installmentCount = installments;
    paymentData.installmentValue = value / installments;
  }
  
  console.log("Criando pagamento com dados:", paymentData);
  
  const { status, data: payment } = await asaasRequest("/payments", "POST", paymentData);
  
  if (status !== 200 || !payment) {
    throw new Error("Erro ao criar pagamento");
  }
  
  console.log("Gerando link de pagamento para pagamento");
  
  // Gerar link de pagamento
  const paymentLink = await generatePaymentLink({
    name: description,
    description: `Pagamento ${description}`,
    endDate: "2025-04-02", // Data limite bem no futuro
    value: value,
    billingType,
    chargeType: "DETACHED",
    dueDateLimitDays: 1,
    externalReference,
    maxInstallmentCount: billingType === "CREDIT_CARD" ? installments : 1,
    installmentCount: billingType === "CREDIT_CARD" ? installments : 1
  });
  
  console.log("Link de pagamento criado:", paymentLink);
  
  // Criar ou atualizar registro de assinatura
  try {
    const subscriptionData = {
      user_id: userId,
      plan_id: planId,
      status: "pending",
      asaas_customer_id: customerId,
      asaas_payment_link: paymentLink.url,
      payment_id: payment.id,
      external_reference: externalReference,
      payment_status: "PENDING",
      installments
    };
    
    // Verificar se já existe registro para atualizar
    const { data: existingSubscription, error: selectError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("plan_id", planId)
      .maybeSingle();
    
    if (selectError) {
      console.error("Erro ao buscar assinatura existente:", selectError);
      throw new Error("Erro ao buscar assinatura existente");
    }
    
    let dbSubscription;
    
    if (existingSubscription) {
      // Atualizar registro existente
      const { data, error } = await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("id", existingSubscription.id)
        .select()
        .single();
        
      if (error) {
        console.error("Erro ao atualizar assinatura:", error);
        throw new Error("Erro ao atualizar assinatura");
      }
      
      dbSubscription = data;
    } else {
      // Criar novo registro
      const { data, error } = await supabase
        .from("subscriptions")
        .insert(subscriptionData)
        .select()
        .single();
        
      if (error) {
        console.error("Erro ao inserir assinatura:", error);
        throw new Error("Erro inserindo assinatura: " + error.message);
      }
      
      dbSubscription = data;
    }
    
    console.log("Registro de assinatura criado/atualizado:", dbSubscription);
    
    return new Response(
      JSON.stringify({
        payment,
        paymentLink: paymentLink.url,
        dbSubscription
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    throw error;
  }
}

// Buscar pagamento por ID
async function getPayment(req: Request, data: any, userId: string) {
  const { paymentId } = data;
  
  if (!paymentId) {
    throw new Error("ID do pagamento não fornecido");
  }
  
  const { status, data: payment } = await asaasRequest(`/payments/${paymentId}`, "GET");
  
  return new Response(
    JSON.stringify({ payment }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Buscar pagamento por referência externa
async function getPaymentByReference(req: Request, data: any, userId: string) {
  const { externalReference } = data;
  
  if (!externalReference) {
    throw new Error("Referência externa não fornecida");
  }
  
  const { status, data: response } = await asaasRequest(
    `/payments?externalReference=${externalReference}`,
    "GET"
  );
  
  // Retornar o primeiro pagamento encontrado, se houver
  const payment = response.data && response.data.length > 0 ? response.data[0] : null;
  
  return new Response(
    JSON.stringify({ payment }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Buscar link de pagamento por ID
async function getPaymentLink(req: Request, data: any, userId: string) {
  const { linkId } = data;
  
  if (!linkId) {
    throw new Error("ID do link de pagamento não fornecido");
  }
  
  const { status, data: paymentLink } = await asaasRequest(`/paymentLinks/${linkId}`, "GET");
  
  return new Response(
    JSON.stringify({ paymentLink }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Buscar todos os pagamentos
async function getPayments(req: Request, data: any, userId: string) {
  const { status, data: response } = await asaasRequest("/payments", "GET");
  
  return new Response(
    JSON.stringify({ payments: response.data }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Verificar pagamentos existentes
async function checkExistingPayments(req: Request, data: any, userId: string, supabase: any) {
  const { customerId, planId } = data;
  
  // Primeiro buscar assinaturas existentes no banco local
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("plan_id", planId)
    .eq("status", "pending")
    .maybeSingle();
  
  if (subscriptionError) {
    console.error("Erro ao buscar assinatura:", subscriptionError);
    throw new Error("Erro ao buscar assinatura existente");
  }
  
  if (subscription?.asaas_payment_link) {
    // Verificar se o link ainda é válido
    const paymentLinkId = subscription.asaas_payment_link.split('/').pop();
    
    if (paymentLinkId) {
      const { status, data: linkData } = await asaasRequest(`/paymentLinks/${paymentLinkId}`, "GET");
      
      if (status === 200 && linkData.active) {
        return new Response(
          JSON.stringify({
            payment: null,
            paymentLink: subscription.asaas_payment_link,
            dbSubscription: subscription
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
  }
  
  // Se não encontrou link válido, verificar pagamentos pendentes
  if (subscription?.payment_id) {
    const { status, data: payment } = await asaasRequest(`/payments/${subscription.payment_id}`, "GET");
    
    if (status === 200 && payment.status === "PENDING") {
      return new Response(
        JSON.stringify({
          payment,
          paymentLink: null,
          dbSubscription: subscription
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  }
  
  // Se não encontrou nada, retornar nulo
  return new Response(
    JSON.stringify({
      payment: null,
      paymentLink: null,
      dbSubscription: null
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Buscar assinatura
async function getSubscription(req: Request, data: any, userId: string, supabase: any) {
  try {
    console.log(`Buscando assinatura para usuário: ${userId}`);
    
    // Buscar assinatura no banco local
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .maybeSingle();
    
    if (subscriptionError) {
      console.error("Erro ao buscar assinatura:", subscriptionError);
      throw subscriptionError;
    }
    
    if (!subscription) {
      return new Response(
        JSON.stringify({ subscription: null }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Se for assinatura pendente, verificar status do pagamento
    if (subscription.status === "pending" && subscription.payment_id) {
      const { status, data: payment } = await asaasRequest(`/payments/${subscription.payment_id}`, "GET");
      
      if (status === 200) {
        // Se o pagamento foi aprovado mas o status da assinatura ainda está pendente, atualizar
        if (["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(payment.status)) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ 
              status: "active",
              payment_status: payment.status,
              updated_at: new Date().toISOString()
            })
            .eq("id", subscription.id);
          
          if (updateError) {
            console.error("Erro ao atualizar status da assinatura:", updateError);
          } else {
            subscription.status = "active";
            subscription.payment_status = payment.status;
          }
        }
        // Se o pagamento foi recusado ou teve problema, atualizar status
        else if (["OVERDUE", "REFUNDED", "REFUND_REQUESTED", "CHARGEBACK_REQUESTED", 
                  "CHARGEBACK_DISPUTE", "AWAITING_CHARGEBACK_REVERSAL"].includes(payment.status)) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ 
              status: "past_due",
              payment_status: payment.status,
              updated_at: new Date().toISOString()
            })
            .eq("id", subscription.id);
          
          if (updateError) {
            console.error("Erro ao atualizar status da assinatura:", updateError);
          } else {
            subscription.status = "past_due";
            subscription.payment_status = payment.status;
          }
        }
      }
    }
    
    return new Response(
      JSON.stringify({ subscription }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Erro em getSubscription:", error);
    throw error;
  }
}

// Cancelar assinatura
async function cancelSubscription(req: Request, data: any, userId: string) {
  const { subscriptionId } = data;
  
  if (!subscriptionId) {
    throw new Error("ID da assinatura não fornecido");
  }
  
  const { status, data: response } = await asaasRequest(
    `/subscriptions/${subscriptionId}/cancel`,
    "POST"
  );
  
  return new Response(
    JSON.stringify({ success: status === 200, data: response }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Nova função para excluir cliente no Asaas
async function deleteCustomer(req: Request, data: any, userId: string, supabase: any) {
  try {
    const { customerId } = data;
    
    if (!customerId) {
      throw new Error("ID do cliente não fornecido");
    }
    
    console.log(`Tentando excluir cliente Asaas: ${customerId}`);
    
    // Verificar se o cliente existe no Asaas
    const { status: checkStatus, data: customer } = await asaasRequest(`/customers/${customerId}`, "GET");
    
    if (checkStatus !== 200 || !customer) {
      throw new Error("Cliente não encontrado no Asaas");
    }
    
    // Buscar as assinaturas e pagamentos do cliente para cancelar/excluir
    const { status: paymentsStatus, data: paymentsResponse } = await asaasRequest(
      `/payments?customer=${customerId}`,
      "GET"
    );
    
    // Cancelar/excluir todos os pagamentos pendentes
    if (paymentsStatus === 200 && paymentsResponse.data && paymentsResponse.data.length > 0) {
      console.log(`Encontrados ${paymentsResponse.data.length} pagamentos para excluir`);
      
      for (const payment of paymentsResponse.data) {
        if (payment.status === "PENDING") {
          const { status: deleteStatus } = await asaasRequest(`/payments/${payment.id}`, "DELETE");
          console.log(`Pagamento ${payment.id} excluído, status: ${deleteStatus}`);
        }
      }
    }
    
    // Excluir cliente no Asaas
    const { status: deleteStatus, data: deleteResponse } = await asaasRequest(`/customers/${customerId}`, "DELETE");
    
    if (deleteStatus !== 200) {
      throw new Error(`Erro ao excluir cliente: ${JSON.stringify(deleteResponse)}`);
    }
    
    console.log("Cliente excluído do Asaas com sucesso");
    
    // Excluir registro local do cliente no banco de dados
    const { error: deleteError } = await supabase
      .from("asaas_customers")
      .delete()
      .eq("asaas_id", customerId);
    
    if (deleteError) {
      console.error("Erro ao excluir registro local do cliente:", deleteError);
      throw new Error(`Erro ao excluir registro local: ${deleteError.message}`);
    }
    
    console.log("Registro local do cliente excluído com sucesso");
    
    // Excluir assinaturas associadas a este cliente
    const { error: subDeleteError } = await supabase
      .from("subscriptions")
      .delete()
      .eq("asaas_customer_id", customerId);
    
    if (subDeleteError) {
      console.error("Erro ao excluir assinaturas associadas:", subDeleteError);
    } else {
      console.log("Assinaturas associadas excluídas com sucesso");
    }
    
    // Atualizar flag no perfil do usuário
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ has_asaas_customer: false })
      .eq("id", userId);
    
    if (updateError) {
      console.error("Erro ao atualizar flag no perfil:", updateError);
    } else {
      console.log("Flag de cliente no perfil atualizada com sucesso");
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Cliente excluído com sucesso" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Erro ao excluir cliente:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
