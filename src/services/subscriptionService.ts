import { supabase } from "@/integrations/supabase/client";
import { Subscription, CreateCheckoutOptions } from "@/types/subscription";
import { plansService } from "./plansService";
import { asaasCustomerService } from "./asaasCustomerService";
import { paymentsService } from "./paymentsService";

export { PLANS } from "./plansService";
export type { Plan, Subscription, CreateCheckoutOptions, RegularPlan, CustomPricePlan } from "@/types/subscription";

export const subscriptionService = {
  async createCheckoutSession(options: CreateCheckoutOptions) {
    try {
      const { planId, successUrl, cancelUrl, installments = 1, paymentType = "credit" } = options;
      
      // Encontrar o plano com o ID correspondente
      const plan = plansService.getPlanById(planId);
      
      if (!plan) {
        throw new Error(`Plano com ID ${planId} não encontrado`);
      }
      
      if (plansService.isCustomPricePlan(plan)) {
        // Para planos de preço personalizado, redirecionar para página de contato
        return {
          url: "/contato?subject=Plano Corporativo",
          isCustomPlan: true
        };
      }
      
      // Agora podemos fazer cast para RegularPlan com segurança
      const regularPlan = plan as any;
      
      console.log(`Criando checkout para plano: ${planId} com ${installments} parcelas, tipo de pagamento: ${paymentType}`);
      
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Obter perfil do usuário para criar ou recuperar cliente
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (!profileData) {
        throw new Error("Perfil de usuário não encontrado");
      }
      
      // Tratar corretamente o objeto social_media que pode ser um tipo Json
      const socialMediaObj = typeof profileData.social_media === 'object' && profileData.social_media !== null
        ? profileData.social_media
        : {};
        
      // Criar um objeto social_media estruturado adequadamente com padrões
      const social_media = {
        linkedin: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'linkedin' in socialMediaObj 
          ? String(socialMediaObj.linkedin || '') 
          : '',
        twitter: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'twitter' in socialMediaObj 
          ? String(socialMediaObj.twitter || '') 
          : '',
        instagram: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'instagram' in socialMediaObj 
          ? String(socialMediaObj.instagram || '') 
          : '',
        facebook: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'facebook' in socialMediaObj 
          ? String(socialMediaObj.facebook || '') 
          : ''
      };
      
      // Adicionar email ao perfil para criação de cliente
      const profileWithEmail = {
        ...profileData,
        email: user.email,
        social_media: social_media
      };
      
      // Validar campos obrigatórios com base na documentação do Asaas
      if (!profileWithEmail.full_name) {
        throw new Error("Nome completo é obrigatório");
      }
      
      if (!profileWithEmail.phone) {
        throw new Error("Telefone é obrigatório");
      }
      
      if (!profileWithEmail.cnpj && !profileWithEmail.cpf) {
        throw new Error("CPF ou CNPJ é obrigatório");
      }
      
      // Criar ou recuperar cliente Asaas
      const { customerId, isNew } = await asaasCustomerService.createOrRetrieveCustomer(profileWithEmail);
      
      if (!customerId) {
        throw new Error("Não foi possível obter ID do cliente no Asaas");
      }
      
      console.log(`Cliente Asaas ${isNew ? 'criado' : 'recuperado'}: ${customerId}`);
      
      // Calcular o valor do pagamento com base nas parcelas
      const paymentValue = plansService.calculatePaymentAmount(regularPlan, installments);
      
      // Gerar uma referência externa única para prevenir pagamentos duplicados
      const externalReference = await paymentsService.generateUniqueReference(user.id, planId);
      
      // Verificar se já existe um pagamento pendente para esta combinação de plano e usuário
      const existingPaymentCheck = await paymentsService.checkExistingPayment(customerId, planId, user.id);
      
      // Se já temos um pagamento pendente com link, retornar esse link em vez de criar um novo
      if (!existingPaymentCheck.needsCreation && existingPaymentCheck.paymentLink) {
        console.log("Encontrado pagamento existente, retornando link:", existingPaymentCheck.paymentLink);
        return {
          url: existingPaymentCheck.paymentLink,
          payment: existingPaymentCheck.payment,
          dbSubscription: existingPaymentCheck.dbSubscription,
          directRedirect: true,
          isExisting: true
        };
      }
      
      // Preparar dados de pagamento de acordo com os requisitos da API Asaas
      const nextDueDate = new Date(Date.now() + 3600 * 1000 * 24);
      const dueDate = nextDueDate.toISOString().split('T')[0]; // formato YYYY-MM-DD
      
      // Determinar o tipo de cobrança com base no método de pagamento selecionado
      const billingType = paymentType === "credit" 
        ? (installments > 1 ? "CREDIT_CARD" : "CREDIT_CARD") 
        : paymentType === "pix" 
          ? "PIX" 
          : "BOLETO";
      
      // Criar pagamento no Asaas
      const { paymentId, paymentLink } = await paymentsService.createPayment({
        customerId,
        planId,
        userId: user.id,
        value: paymentValue,
        description: `Compra: ${regularPlan.name}`,
        successUrl,
        cancelUrl,
        installments,
        billingType,
        paymentType,
        dueDate,
        externalReference,
        postalService: false
      });
      
      // Criar ou atualizar registro de assinatura local
      const subscriptionData = {
        user_id: user.id,
        plan_id: planId,
        status: "pending",
        asaas_customer_id: customerId,
        asaas_payment_link: paymentLink,
        payment_id: paymentId,
        external_reference: externalReference,
        payment_status: "PENDING",
        installments
      };
      
      // Verificar se já existe registro para atualizar
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("plan_id", planId)
        .maybeSingle();
      
      let subscriptionResult;
      
      if (existingSubscription) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("id", existingSubscription.id)
          .select()
          .single();
          
        if (error) throw error;
        subscriptionResult = data;
      } else {
        // Criar novo registro
        const { data, error } = await supabase
          .from("subscriptions")
          .insert(subscriptionData)
          .select()
          .single();
          
        if (error) throw error;
        subscriptionResult = data;
      }
      
      console.log("Registro de assinatura criado/atualizado:", subscriptionResult);
      
      // Importante: Redirecionar diretamente para a URL do link de pagamento
      if (paymentLink) {
        // Salvar estado atual em localStorage antes de redirecionar
        localStorage.setItem('checkoutPlanId', planId);
        localStorage.setItem('checkoutInstallments', String(installments));
        localStorage.setItem('checkoutTimestamp', String(Date.now()));
        localStorage.setItem('checkoutReference', externalReference);
        
        return {
          url: paymentLink,
          payment: paymentId,
          dbSubscription: subscriptionResult,
          directRedirect: true
        };
      } else {
        throw new Error("Nenhum link de pagamento foi retornado do Asaas");
      }
    } catch (error: any) {
      console.error("Erro em createCheckoutSession:", error);
      throw error;
    }
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      console.log("Buscando assinatura atual...");
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("Nenhum usuário autenticado encontrado");
        return null;
      }
      
      // Buscar assinatura diretamente na tabela local
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao buscar assinatura:", error);
        return null;
      }
      
      // Se não encontrou assinatura, retornar null
      if (!data) {
        return null;
      }
      
      // Verificar status do pagamento se for assinatura pendente
      if (data.status === "pending" && data.payment_id) {
        const payment = await paymentsService.getPayment(data.payment_id);
        
        // Se o pagamento foi aprovado mas o status da assinatura ainda está pendente, atualizar
        if (payment && ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(payment.status)) {
          await this.updateSubscriptionStatus(data.id, "active");
          data.status = "active";
        } else if (payment && ["OVERDUE", "REFUNDED", "REFUND_REQUESTED", "CHARGEBACK_REQUESTED", 
                               "CHARGEBACK_DISPUTE", "AWAITING_CHARGEBACK_REVERSAL"].includes(payment.status)) {
          await this.updateSubscriptionStatus(data.id, "past_due");
          data.status = "past_due";
        }
      }
      
      return data;
    } catch (error) {
      console.error("Erro em getCurrentSubscription:", error);
      return null;
    }
  },

  async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<void> {
    try {
      console.log(`Atualizando status da assinatura ${subscriptionId} para: ${status}`);
      
      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          status: status, 
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Erro em updateSubscriptionStatus:", error);
      throw error;
    }
  },

  async cancelSubscription(subscriptionId: string) {
    try {
      console.log(`Tentando cancelar assinatura: ${subscriptionId}`);
      
      // Primeiro obter a assinatura para verificar o ID de assinatura do Asaas
      const { data: subscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", subscriptionId)
        .single();
      
      if (fetchError) {
        console.error("Erro ao buscar assinatura:", fetchError);
        return { 
          success: false, 
          message: "Não foi possível encontrar a assinatura"
        };
      }
      
      if (!subscription) {
        return { 
          success: false, 
          message: "Assinatura não encontrada" 
        };
      }
      
      // Se houver um ID de assinatura do Asaas, cancelar no Asaas
      if (subscription.asaas_subscription_id) {
        const response = await supabase.functions.invoke("asaas", {
          body: {
            action: "cancel-subscription",
            data: {
              subscriptionId: subscription.asaas_subscription_id,
            },
          },
        });
  
        if (response.error) {
          console.error("Erro ao cancelar assinatura no Asaas:", response.error);
          return { 
            success: false, 
            message: `Erro ao cancelar assinatura: ${response.error.message}`
          };
        }
      }
  
      // Atualizar o status da assinatura localmente, independente de haver ID no Asaas
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          status: "canceled", 
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);
      
      if (updateError) {
        console.error("Erro ao atualizar status da assinatura:", updateError);
        return { 
          success: false, 
          message: `Erro ao atualizar status: ${updateError.message}`
        };
      }
  
      return { success: true, message: "Assinatura cancelada com sucesso" };
    } catch (error: any) {
      console.error("Erro em cancelSubscription:", error);
      return { 
        success: false, 
        message: error.message || "Ocorreu um erro ao cancelar a assinatura"
      };
    }
  },

  async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();
      const isActive = subscription !== null && ["active", "ACTIVE", "trialing"].includes(subscription.status);
      console.log(`Verificação de assinatura ativa: ${isActive}`, subscription);
      return isActive;
    } catch (error) {
      console.error("Erro ao verificar status da assinatura:", error);
      return false;
    }
  },

  getPlanFromId(planId: string): any {
    return plansService.getPlanById(planId);
  },

  async getPayments() {
    return paymentsService.getPayments();
  },

  async getPayment(paymentId: string) {
    return paymentsService.getPayment(paymentId);
  },

  async updateContractAcceptance(accepted: boolean) {
    try {
      console.log(`Atualizando aceitação do contrato: ${accepted}`);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Nenhum usuário autenticado encontrado");
      }
      
      const { error } = await supabase
        .from("subscriptions")
        .update({
          contract_accepted: accepted,
          contract_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
        
      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error("Erro em updateContractAcceptance:", error);
      return { success: false, error: error.message };
    }
  },

  async requestReceipt(paymentId: string) {
    return paymentsService.requestReceipt(paymentId);
  }
};
