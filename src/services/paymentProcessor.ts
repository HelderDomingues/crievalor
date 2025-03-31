
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { subscriptionService } from "@/services/subscriptionService";
import { paymentsService } from "@/services/paymentsService";

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

// Static payment links to use directly
const STATIC_PAYMENT_LINKS = {
  basic_plan: {
    credit: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s", 
    pix: "https://sandbox.asaas.com/c/fy15747uacorzbla"
  },
  pro_plan: {
    credit: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon", 
    pix: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq"
  },
  enterprise_plan: {
    credit: "https://sandbox.asaas.com/c/z4vate6zwonrwoft", 
    pix: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s"
  }
};

export const paymentProcessor = {
  async processPayment(options: PaymentProcessingOptions): Promise<PaymentResult> {
    try {
      const { planId, installments, paymentType, domain } = options;
      const processId = options.processId || `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      console.log(`[${processId}] Processing payment for plan: ${planId} with payment type: ${paymentType}`);
      
      // Clear any stale data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedCustomerData');
        localStorage.removeItem('lastFormSubmission');
      }
      
      // Check if it's a corporate plan (special case)
      if (planId === "corporate_plan") {
        return {
          success: true,
          url: "https://wa.me/5547992150289?text=Olá,%20gostaria%20de%20obter%20mais%20informações%20sobre%20o%20Plano%20Corporativo.",
          isCustomPlan: true
        };
      }
      
      // Get direct payment link from static mapping
      const planLinks = STATIC_PAYMENT_LINKS[planId as keyof typeof STATIC_PAYMENT_LINKS];
      if (!planLinks) {
        throw new Error(`Plano não encontrado: ${planId}`);
      }
      
      const paymentLink = planLinks[paymentType as keyof typeof planLinks];
      if (!paymentLink) {
        throw new Error(`Tipo de pagamento não suportado: ${paymentType}`);
      }
      
      console.log(`[${processId}] Using static payment link: ${paymentLink}`);
      
      // Store information in localStorage for potential recovery
      localStorage.setItem('lastPaymentUrl', paymentLink);
      localStorage.setItem('checkoutPlanId', planId);
      localStorage.setItem('checkoutPaymentType', paymentType);
      localStorage.setItem('checkoutTimestamp', Date.now().toString());
      
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
    // Save payment URL
    if (result.url) {
      localStorage.setItem('lastPaymentUrl', result.url);
    }
    
    // Save payment ID if available
    if (result.payment) {
      // Ensure we're storing a string for payment ID
      const paymentId = typeof result.payment === 'object' ? result.payment.id : result.payment;
      localStorage.setItem('checkoutPaymentId', paymentId);
      
      if (state) {
        state.paymentId = paymentId;
      }
    }
    
    // Save subscription ID if available
    if (result.dbSubscription?.id) {
      localStorage.setItem('checkoutSubscriptionId', result.dbSubscription.id);
      
      if (state) {
        state.subscriptionId = result.dbSubscription.id;
      }
    }
    
    // Save Asaas customer ID if available
    if (result.asaasCustomerId) {
      localStorage.setItem('asaasCustomerId', result.asaasCustomerId);
      
      if (state) {
        state.asaasCustomerId = result.asaasCustomerId;
      }
    }
    
    // Store timestamp for data freshness tracking
    localStorage.setItem('paymentStateTimestamp', Date.now().toString());
  }
};
