
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface AsaasPayment {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  description: string;
  billingType: string;
  status: string;
  dueDate: string;
  originalDueDate: string;
  paymentDate: string | null;
  clientPaymentDate: string | null;
  invoiceUrl: string | null;
  invoiceNumber: string | null;
  externalReference: string | null;
  installment: number | null;
  installmentCount: number | null;
  creditCardHolderName?: string | null;
  creditCardNumber?: string | null;
  creditCardExpiryMonth?: string | null;
  creditCardExpiryYear?: string | null;
  creditCardCcv?: string | null;
  creditCardToken?: string | null;
  fine?: number | null;
  interest?: number | null;
  postalService?: boolean | null;
}

export interface AsaasPaymentLink {
  id: string;
  name: string;
  description: string;
  value: number;
  billingType: string;
  chargeType: string;
  url: string;
  dueDateLimitDays: number;
  maxInstallmentCount: number;
  externalReference: string | null;
}

export interface PaymentCreationOptions {
  customerId: string;
  planId: string;
  userId: string;
  value: number;
  description: string;
  successUrl: string;
  cancelUrl: string;
  installments: number;
  billingType: string; // UNDEFINED, CREDIT_CARD, PIX, BOLETO
  dueDate: string;
  externalReference: string;
  postalService?: boolean;
}

export interface PaymentCheckResult {
  dbSubscription: any;
  payment: AsaasPayment | null;
  paymentLink: string | null;
  needsCreation: boolean;
}

export const paymentsService = {
  async generateUniqueReference(userId: string, planId: string): Promise<string> {
    // Garantir que referências sejam únicas mesmo com muitas tentativas rápidas
    return `${userId}_${planId}_${Date.now()}_${uuidv4().substring(0, 8)}`;
  },
  
  async checkExistingPayment(customerId: string, planId: string, userId: string): Promise<PaymentCheckResult> {
    try {
      console.log(`Verificando pagamentos existentes - customerId: ${customerId}, planId: ${planId}, userId: ${userId}`);
      
      // Primeiro, verificar se existe uma assinatura pendente no banco local
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("plan_id", planId)
        .eq("status", "pending")
        .maybeSingle();
      
      if (existingSubscription && existingSubscription.asaas_payment_link) {
        console.log("Encontrada assinatura pendente com link de pagamento:", existingSubscription);
        
        // Verificar se o pagamento ainda existe no Asaas e está pendente
        let payment = null;
        if (existingSubscription.payment_id) {
          payment = await this.getPayment(existingSubscription.payment_id);
          
          // Se o pagamento foi concluído, retornar que precisamos de um novo
          if (payment && payment.status !== "PENDING") {
            console.log("Pagamento existente não está mais pendente:", payment);
            return { 
              dbSubscription: existingSubscription,
              payment: payment,
              paymentLink: null,
              needsCreation: true
            };
          }
        }
        
        // Verificar se o link de pagamento ainda é válido
        const isValidLink = await this.checkPaymentLinkValidity(existingSubscription.asaas_payment_link);
        
        if (isValidLink) {
          return {
            dbSubscription: existingSubscription,
            payment: payment,
            paymentLink: existingSubscription.asaas_payment_link,
            needsCreation: false
          };
        }
        
        console.log("Link de pagamento existente não é mais válido");
      }
      
      // Verificar diretamente no Asaas
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "check-existing-payments",
          data: {
            customerId,
            planId,
            userId
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao verificar pagamentos existentes:", response.error);
        throw new Error(`Erro ao verificar pagamentos: ${response.error.message}`);
      }
      
      if (response.data?.paymentLink) {
        console.log("Encontrado pagamento pendente no Asaas:", response.data);
        return {
          dbSubscription: response.data.dbSubscription,
          payment: response.data.payment,
          paymentLink: response.data.paymentLink,
          needsCreation: false
        };
      }
      
      return {
        dbSubscription: null,
        payment: null,
        paymentLink: null,
        needsCreation: true
      };
    } catch (error) {
      console.error("Erro em checkExistingPayment:", error);
      // Se houver erro na verificação, é mais seguro criar um novo pagamento
      return {
        dbSubscription: null,
        payment: null,
        paymentLink: null,
        needsCreation: true
      };
    }
  },
  
  async checkPaymentLinkValidity(linkUrl: string): Promise<boolean> {
    try {
      // Extrair o ID do link da URL completa
      const linkId = linkUrl.split('/').pop();
      
      if (!linkId) {
        console.error("ID do link de pagamento não encontrado na URL:", linkUrl);
        return false;
      }
      
      console.log(`Verificando validade do link de pagamento: ${linkId}`);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payment-link",
          data: {
            linkId
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao verificar link de pagamento:", response.error);
        return false;
      }
      
      const linkData = response.data?.paymentLink;
      
      if (!linkData) {
        console.log("Link de pagamento não encontrado");
        return false;
      }
      
      // Verificar se o link está ativo e ainda é válido
      const isValid = linkData.active === true;
      
      console.log(`Link de pagamento ${isValid ? 'é válido' : 'não é válido'}:`, linkData);
      return isValid;
    } catch (error) {
      console.error("Erro ao verificar validade do link de pagamento:", error);
      return false;
    }
  },
  
  async createPayment(options: PaymentCreationOptions): Promise<{ paymentId: string, paymentLink: string }> {
    try {
      console.log("Criando pagamento com opções:", options);
      
      // Verificar se já existe um pagamento pendente
      const existingPayment = await this.checkExistingPayment(
        options.customerId,
        options.planId,
        options.userId
      );
      
      if (!existingPayment.needsCreation && existingPayment.paymentLink) {
        console.log("Usando link de pagamento existente:", existingPayment.paymentLink);
        return {
          paymentId: existingPayment.payment?.id || "",
          paymentLink: existingPayment.paymentLink
        };
      }
      
      // Criar novo pagamento
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-payment",
          data: options,
        },
      });
      
      if (response.error) {
        console.error("Erro ao criar pagamento:", response.error);
        throw new Error(`Erro ao criar pagamento: ${response.error.message}`);
      }
      
      console.log("Pagamento criado com sucesso:", response.data);
      
      if (!response.data.paymentLink) {
        throw new Error("Nenhum link de pagamento foi retornado");
      }
      
      return {
        paymentId: response.data.payment?.id || "",
        paymentLink: response.data.paymentLink
      };
    } catch (error: any) {
      console.error("Erro em createPayment:", error);
      throw error;
    }
  },
  
  async getPayments(): Promise<AsaasPayment[]> {
    try {
      console.log("Buscando pagamentos...");
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payments",
          data: {},
        },
      });
      
      if (response.error) {
        console.error("Erro ao buscar pagamentos:", response.error);
        return [];
      }
      
      return response.data?.payments || [];
    } catch (error) {
      console.error("Erro em getPayments:", error);
      return [];
    }
  },
  
  async getPayment(paymentId: string): Promise<AsaasPayment | null> {
    try {
      if (!paymentId) {
        console.error("ID do pagamento não fornecido");
        return null;
      }
      
      console.log(`Buscando pagamento: ${paymentId}`);
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payment",
          data: {
            paymentId,
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao buscar pagamento:", response.error);
        return null;
      }
      
      return response.data?.payment || null;
    } catch (error) {
      console.error("Erro em getPayment:", error);
      return null;
    }
  },
  
  async getPaymentByReference(externalReference: string): Promise<AsaasPayment | null> {
    try {
      console.log(`Buscando pagamento pela referência: ${externalReference}`);
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payment-by-reference",
          data: {
            externalReference,
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao buscar pagamento por referência:", response.error);
        return null;
      }
      
      return response.data?.payment || null;
    } catch (error) {
      console.error("Erro em getPaymentByReference:", error);
      return null;
    }
  },
  
  async requestReceipt(paymentId: string): Promise<{ success: boolean, url?: string, error?: string }> {
    try {
      console.log(`Solicitando comprovante para pagamento: ${paymentId}`);
      const payment = await this.getPayment(paymentId);
      
      if (!payment) {
        return { success: false, error: "Pagamento não encontrado" };
      }
      
      if (payment.invoiceUrl) {
        return { success: true, url: payment.invoiceUrl };
      }
      
      return { success: false, error: "Comprovante não disponível para este pagamento" };
    } catch (error: any) {
      console.error("Erro em requestReceipt:", error);
      return { success: false, error: error.message };
    }
  },
  
  async updateSubscriptionPaymentStatus(subscriptionId: string, status: string): Promise<void> {
    try {
      console.log(`Atualizando status de pagamento para assinatura ${subscriptionId}:`, status);
      
      const { error } = await supabase
        .from("subscriptions")
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq("id", subscriptionId);
      
      if (error) {
        console.error("Erro ao atualizar status de pagamento da assinatura:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em updateSubscriptionPaymentStatus:", error);
    }
  }
};
