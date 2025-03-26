
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN") || "";

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
    const requestUrl = new URL(req.url);
    const token = requestUrl.searchParams.get("token");

    // Verificar token de segurança para autenticar o webhook
    if (!ASAAS_WEBHOOK_TOKEN || token !== ASAAS_WEBHOOK_TOKEN) {
      console.error("Token de webhook inválido ou não configurado");
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Obter dados do webhook
    const webhookData = await req.json();
    console.log("Dados recebidos do webhook Asaas:", JSON.stringify(webhookData, null, 2));

    // Inicializar cliente Supabase com chave de serviço
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Processar eventos de pagamento do Asaas
    const event = webhookData.event;
    const payment = webhookData.payment;

    if (!event || !payment) {
      throw new Error("Dados de evento ou pagamento ausentes");
    }

    console.log(`Processando evento ${event} para pagamento ${payment.id}`);

    // Buscar assinatura relacionada a este pagamento
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Erro ao buscar assinatura:", subscriptionError);
      throw subscriptionError;
    }

    if (!subscription) {
      console.log(`Nenhuma assinatura encontrada para o pagamento ${payment.id}`);
      return new Response(
        JSON.stringify({ success: true, message: "Evento recebido, mas nenhuma assinatura encontrada" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Atualizar status da assinatura com base no evento de pagamento
    let newStatus = subscription.status;
    
    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED_IN_CASH":
        newStatus = "active";
        break;
      
      case "PAYMENT_OVERDUE":
        newStatus = "past_due";
        break;
      
      case "PAYMENT_DELETED":
      case "PAYMENT_REFUNDED":
      case "PAYMENT_CHARGEBACK_REQUESTED":
      case "PAYMENT_CHARGEBACK_DISPUTE":
        newStatus = "canceled";
        break;
      
      default:
        console.log(`Evento ${event} não exige atualização de status`);
        break;
    }

    // Atualizar assinatura se o status precisa mudar
    if (newStatus !== subscription.status) {
      console.log(`Atualizando status da assinatura ${subscription.id} de ${subscription.status} para ${newStatus}`);
      
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          status: newStatus, 
          payment_status: payment.status,
          updated_at: new Date().toISOString() 
        })
        .eq("id", subscription.id);
      
      if (updateError) {
        console.error("Erro ao atualizar assinatura:", updateError);
        throw updateError;
      }
    } else {
      // Atualizar apenas o status do pagamento
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          payment_status: payment.status,
          updated_at: new Date().toISOString() 
        })
        .eq("id", subscription.id);
      
      if (updateError) {
        console.error("Erro ao atualizar status de pagamento:", updateError);
        throw updateError;
      }
    }

    console.log("Webhook processado com sucesso");
    
    return new Response(
      JSON.stringify({ success: true, message: "Webhook processado com sucesso" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Erro ao processar webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
