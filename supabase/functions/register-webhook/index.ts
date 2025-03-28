
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configurações
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") || "";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar se as chaves estão configuradas
    if (!ASAAS_API_KEY) {
      throw new Error("ASAAS_API_KEY não está configurada");
    }

    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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
    
    // Define a URL do webhook do Supabase
    const webhookUrl = "https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook";
    
    console.log("Registrando webhook no Asaas:", webhookUrl);
    
    // Verificar se já existe webhook configurado
    const existingWebhooks = await getWebhooks();
    
    for (const webhook of existingWebhooks) {
      // Se encontrar um webhook com a mesma URL base, atualizar
      if (webhook.url && webhook.url.includes("supabase.co/functions/v1/asaas-webhook")) {
        console.log("Webhook existente encontrado, atualizando...");
        const updateResult = await updateWebhook(webhook.id, webhookUrl);
        
        return new Response(
          JSON.stringify({ success: true, message: "Webhook atualizado com sucesso", webhook: updateResult }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
    
    // Se não encontrou webhook existente, criar novo
    console.log("Criando novo webhook...");
    const newWebhook = await createWebhook(webhookUrl);
    
    return new Response(
      JSON.stringify({ success: true, message: "Webhook registrado com sucesso", webhook: newWebhook }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Função auxiliar para obter webhooks existentes
async function getWebhooks() {
  console.log("Verificando webhooks existentes");
  
  const response = await fetch(`${ASAAS_API_URL}/webhook`, {
    method: "GET",
    headers: {
      "access_token": ASAAS_API_KEY,
      "Content-Type": "application/json"
    }
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao obter webhooks: ${response.status}`);
  }
  
  const data = await response.json();
  console.log("Webhooks existentes:", JSON.stringify(data, null, 2));
  
  return data.data || [];
}

// Função auxiliar para criar novo webhook
async function createWebhook(url) {
  console.log("Criando webhook:", url);
  
  const webhookData = {
    url,
    email: "webhook@crievalor.lovable.app",
    apiVersion: 3,
    enabled: true,
    interrupted: false,
    types: [
      "PAYMENT_CREATED",
      "PAYMENT_UPDATED",
      "PAYMENT_CONFIRMED",
      "PAYMENT_RECEIVED",
      "PAYMENT_OVERDUE",
      "PAYMENT_DELETED",
      "PAYMENT_REFUNDED",
      "PAYMENT_RECEIVED_IN_CASH",
      "PAYMENT_CHARGEBACK_REQUESTED",
      "PAYMENT_CHARGEBACK_DISPUTE",
      "PAYMENT_AWAITING_CHARGEBACK_REVERSAL"
    ]
  };
  
  const response = await fetch(`${ASAAS_API_URL}/webhook`, {
    method: "POST",
    headers: {
      "access_token": ASAAS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(webhookData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro ao criar webhook: ${JSON.stringify(errorData)}`);
  }
  
  const data = await response.json();
  console.log("Webhook criado:", JSON.stringify(data, null, 2));
  
  return data;
}

// Função auxiliar para atualizar webhook existente
async function updateWebhook(webhookId, url) {
  console.log(`Atualizando webhook ${webhookId} para ${url}`);
  
  const webhookData = {
    url,
    email: "webhook@crievalor.lovable.app",
    apiVersion: 3,
    enabled: true,
    interrupted: false,
    types: [
      "PAYMENT_CREATED",
      "PAYMENT_UPDATED",
      "PAYMENT_CONFIRMED",
      "PAYMENT_RECEIVED",
      "PAYMENT_OVERDUE",
      "PAYMENT_DELETED",
      "PAYMENT_REFUNDED",
      "PAYMENT_RECEIVED_IN_CASH",
      "PAYMENT_CHARGEBACK_REQUESTED",
      "PAYMENT_CHARGEBACK_DISPUTE",
      "PAYMENT_AWAITING_CHARGEBACK_REVERSAL"
    ]
  };
  
  const response = await fetch(`${ASAAS_API_URL}/webhook/${webhookId}`, {
    method: "PUT",
    headers: {
      "access_token": ASAAS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(webhookData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro ao atualizar webhook: ${JSON.stringify(errorData)}`);
  }
  
  const data = await response.json();
  console.log("Webhook atualizado:", JSON.stringify(data, null, 2));
  
  return data;
}
