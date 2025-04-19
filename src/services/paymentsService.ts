import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { PaymentType } from './marPaymentLinks';

interface CreatePaymentOptions {
  customerId: string;
  planId: string;
  userId: string;
  value: number;
  description: string;
  successUrl?: string;
  cancelUrl?: string;
  installments: number;
  billingType: string;
  paymentType: PaymentType;
  dueDate: string;
  externalReference: string;
  postalService: boolean;
}

interface Payment {
  id: string;
  customer: string;
  value: number;
  dueDate: string;
  status: string;
  billingType: string;
  installmentCount?: number;
  installmentValue?: number;
  description: string;
  externalReference: string;
  interestValue?: number;
  originalValue?: number;
  paymentLink?: string;
  invoiceUrl?: string;
  transactionReceiptUrl?: string;
  confirmed?: boolean;
  deleted?: boolean;
  postalService?: boolean;
  anticipated?: boolean;
  discount?: {
    value: number;
    dueDateLimitDays: number;
  };
  creditCard?: {
    creditCardBrand: string;
    creditCardNumber: string;
    creditCardToken: string;
  };
  pixTransactionId?: string;
  bankSlipUrl?: string;
  discountValue?: number;
  netValue?: number;
  sqlId?: string;
}

export const paymentsService = {
  async createPayment(options: CreatePaymentOptions): Promise<{ paymentId: string; paymentLink: string }> {
    try {
      const {
        customerId,
        planId,
        userId,
        value,
        description,
        successUrl,
        cancelUrl,
        installments,
        billingType,
        paymentType,
        dueDate,
        externalReference,
        postalService
      } = options;

      console.log(`Criando pagamento para o cliente ${customerId} no valor de ${value} com vencimento em ${dueDate}`);

      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-payment",
          data: {
            customerId,
            planId,
            userId,
            value,
            description,
            successUrl,
            cancelUrl,
            installments,
            billingType,
            paymentType,
            dueDate,
            externalReference,
            postalService
          },
        },
      });

      if (response.error) {
        console.error("Erro ao criar pagamento no Asaas:", response.error);
        throw new Error(`Erro ao criar pagamento: ${response.error.message}`);
      }

      const paymentId = response.data?.id;
      const paymentLink = response.data?.invoiceUrl;

      console.log(`Pagamento criado com ID: ${paymentId} e link: ${paymentLink}`);

      return { paymentId, paymentLink };
    } catch (error: any) {
      console.error("Erro em createPayment:", error);
      throw error;
    }
  },

  async getPayments(): Promise<Payment[]> {
    try {
      console.log("Buscando pagamentos...");

      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payments",
          data: {}
        },
      });

      if (response.error) {
        console.error("Erro ao buscar pagamentos no Asaas:", response.error);
        throw new Error(`Erro ao buscar pagamentos: ${response.error.message}`);
      }

      const payments = response.data;

      console.log("Pagamentos encontrados:", payments);

      return payments;
    } catch (error: any) {
      console.error("Erro em getPayments:", error);
      throw error;
    }
  },

  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      console.log(`Buscando pagamento com ID: ${paymentId}`);

      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payment",
          data: {
            paymentId
          },
        },
      });

      if (response.error) {
        console.error(`Erro ao buscar pagamento ${paymentId} no Asaas:`, response.error);
        return null;
      }

      const payment = response.data;

      console.log(`Pagamento ${paymentId} encontrado:`, payment);

      return payment;
    } catch (error: any) {
      console.error("Erro em getPayment:", error);
      return null;
    }
  },

  async generateUniqueReference(userId: string, planId: string): Promise<string> {
    const uuid = uuidv4();
    const reference = `user_${userId}_plan_${planId}_${uuid}`;
    return reference;
  },

  async checkExistingPayment(customerId: string, planId: string, userId: string, installments: number): Promise<{ needsCreation: boolean; paymentLink?: string; payment?: any; dbSubscription?: any }> {
    try {
      console.log(`Verificando pagamentos existentes para customerId: ${customerId}, planId: ${planId}, userId: ${userId}, installments: ${installments}`);

      // Search for a pending payment in the local table
      const { data: existingSubscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("plan_id", planId)
        .eq("installments", installments)
        .eq("payment_status", "PENDING")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Erro ao buscar assinatura local:", error);
        return { needsCreation: true };
      }

      if (existingSubscription && existingSubscription.asaas_payment_link) {
        console.log("Pagamento pendente encontrado:", existingSubscription);
        return {
          needsCreation: false,
          paymentLink: existingSubscription.asaas_payment_link,
          payment: existingSubscription.payment_id,
          dbSubscription: existingSubscription
        };
      }

      console.log("Nenhum pagamento pendente encontrado, precisa criar um novo.");
      return { needsCreation: true };
    } catch (error) {
      console.error("Erro ao verificar pagamento existente:", error);
      return { needsCreation: true };
    }
  },

  async requestReceipt(paymentId: string) {
    try {
      console.log(`Requisitando recibo para o pagamento: ${paymentId}`);

      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "request-receipt",
          data: {
            paymentId
          },
        },
      });

      if (response.error) {
        console.error(`Erro ao requisitar recibo para o pagamento ${paymentId} no Asaas:`, response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`Recibo requisitado com sucesso para o pagamento: ${paymentId}`);
      return { success: true, message: "Recibo requisitado com sucesso." };
    } catch (error: any) {
      console.error("Erro em requestReceipt:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Checks if a payment link is still valid
   * @param linkUrl The URL to check
   * @returns Boolean indicating if link is still valid
   */
  async checkPaymentLinkValidity(linkUrl: string): Promise<boolean> {
    try {
      if (!linkUrl) return false;
      
      // Simple validation: Check if URL is properly formatted and contains expected domain
      if (!linkUrl.startsWith('https://')) return false;
      if (!linkUrl.includes('asaas.com')) return false;
      
      // For Asaas static payment links, we can assume they're valid as they don't expire
      if (linkUrl.includes('sandbox.asaas.com/c/')) {
        return true;
      }
      
      // For dynamic payment links, we could do a more complex check, but for now
      // we'll assume they're valid to avoid unnecessary API calls
      console.log(`Validating payment link: ${linkUrl}`);
      return true;
    } catch (error) {
      console.error("Error checking payment link validity:", error);
      return false; // Consider invalid if there's an error
    }
  }
};
