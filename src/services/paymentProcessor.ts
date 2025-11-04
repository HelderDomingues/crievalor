
import { MAR_PAYMENT_LINKS, getPaymentLink, isCorporatePlan, PaymentType } from "@/services/marPaymentLinks";

export interface PaymentProcessingOptions {
  planId: string;
  installments: number;
  paymentType: PaymentType;
  formData?: any;
  domain?: string;
  processId?: string;
  recoveryState?: any;
}

export interface PaymentResult {
  success: boolean;
  url?: string;
  payment?: any;
  dbSubscription?: any;
  isCustomPlan?: boolean;
  error?: string;
  asaasCustomerId?: string;
}

export const paymentProcessor = {
  async processPayment(options: PaymentProcessingOptions): Promise<PaymentResult> {
    try {
      const { planId, paymentType } = options;
      const processId = options.processId || `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      console.log(`[${processId}] Processing payment for plan: ${planId} with payment type: ${paymentType}`);
      
      // Clear any stale data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedCustomerData');
        localStorage.removeItem('lastFormSubmission');
      }
      
      // Check if it's a corporate plan (special case for WhatsApp)
      if (isCorporatePlan(planId)) {
        const whatsappUrl = "https://wa.me/5547992150289?text=Olá,%20gostaria%20de%20obter%20mais%20informações%20sobre%20o%20Plano%20Corporativo.";
        return {
          success: true,
          url: whatsappUrl,
          isCustomPlan: true
        };
      }
      
      // Get payment link from marPaymentLinks service
      const paymentLink = getPaymentLink(planId, paymentType);
      
      if (!paymentLink) {
        throw new Error(`Link de pagamento não encontrado para plano: ${planId}`);
      }
      
      console.log(`[${processId}] Using payment link: ${paymentLink}`);
      
      // Store information in localStorage for potential recovery
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastPaymentUrl', paymentLink);
        localStorage.setItem('checkoutPlanId', planId);
        localStorage.setItem('checkoutPaymentType', paymentType);
        localStorage.setItem('checkoutTimestamp', Date.now().toString());
      }
      
      return {
        success: true,
        url: paymentLink
      };
    } catch (error: any) {
      console.error(`Error during payment processing:`, error);
      
      return {
        success: false,
        error: error.message || "Não foi possível iniciar o processo de pagamento."
      };
    }
  },
  
  storePaymentState(result: PaymentResult, state: any): void {
    if (typeof window === 'undefined') return;
    
    // Save payment URL
    if (result.url) {
      localStorage.setItem('lastPaymentUrl', result.url);
    }
    
    // Store timestamp for data freshness tracking
    localStorage.setItem('paymentStateTimestamp', Date.now().toString());
  }
};
