
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { PaymentType } from "@/components/pricing/PaymentOptions";

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
  value: number; // This should be the TOTAL payment amount
  description: string;
  successUrl: string;
  cancelUrl: string;
  installments: number;
  billingType: string; // UNDEFINED, CREDIT_CARD, PIX, BOLETO
  paymentType: PaymentType; // Our internal payment type designation
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

// Import these functions from the new payment utils file
import { 
  generateUniqueReference,
  trackPaymentAttempt,
  checkPaymentLinkValidity
} from "./paymentUtils";

export const paymentsService = {
  _paymentAttempts: {} as Record<string, { count: number, timestamp: number }>,
  
  async generateUniqueReference(userId: string, planId: string): Promise<string> {
    return generateUniqueReference(userId, planId);
  },
  
  _trackPaymentAttempt(userId: string, planId: string): boolean {
    return trackPaymentAttempt(this._paymentAttempts, userId, planId);
  },
  
  async checkExistingPayment(customerId: string, planId: string, userId: string, installments: number = 1): Promise<PaymentCheckResult> {
    try {
      console.log(`Verificando pagamentos existentes - customerId: ${customerId}, planId: ${planId}, userId: ${userId}, installments: ${installments}`);
      
      // Buscar assinatura pendente no banco de dados
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("plan_id", planId)
        .eq("status", "pending")
        .maybeSingle();
      
      // Se encontrou uma assinatura pendente com número de parcelas diferente, considere inválida
      if (existingSubscription && existingSubscription.installments !== installments) {
        console.log(`Assinatura pendente encontrada com parcelas diferentes: ${existingSubscription.installments} vs ${installments}`);
        return { 
          dbSubscription: existingSubscription,
          payment: null,
          paymentLink: null,
          needsCreation: true
        };
      }
      
      if (existingSubscription && existingSubscription.asaas_payment_link) {
        console.log("Encontrada assinatura pendente com link de pagamento:", existingSubscription);
        
        let payment = null;
        if (existingSubscription.payment_id) {
          payment = await this.getPayment(existingSubscription.payment_id);
          
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
        
        const isValidLink = await checkPaymentLinkValidity(existingSubscription.asaas_payment_link);
        
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
      
      // Verificar no Asaas
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "check-existing-payments",
          data: {
            customerId,
            planId,
            userId,
            installments
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
      return {
        dbSubscription: null,
        payment: null,
        paymentLink: null,
        needsCreation: true
      };
    }
  },
  
  async checkPaymentLinkValidity(linkUrl: string): Promise<boolean> {
    return checkPaymentLinkValidity(linkUrl);
  },
  
  async createPayment(options: PaymentCreationOptions): Promise<{ paymentId: string, paymentLink: string }> {
    try {
      console.log("Criando pagamento com opções:", options);
      
      if (!this._trackPaymentAttempt(options.userId, options.planId)) {
        console.warn("Múltiplas tentativas de pagamento detectadas. Bloqueando para evitar duplicação.");
        throw new Error("Muitas tentativas de pagamento em um curto período. Aguarde alguns segundos e tente novamente.");
      }
      
      const installments = Number(options.installments) || 1;
      
      const existingPayment = await this.checkExistingPayment(
        options.customerId,
        options.planId,
        options.userId,
        installments
      );
      
      if (!existingPayment.needsCreation && existingPayment.paymentLink) {
        console.log("Usando link de pagamento existente:", existingPayment.paymentLink);
        return {
          paymentId: existingPayment.payment?.id || "",
          paymentLink: existingPayment.paymentLink
        };
      }
      
      console.log("Criando novo pagamento com installments:", installments);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-payment",
          data: {
            ...options,
            installments: installments
          },
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
  
  // Simple API methods
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
