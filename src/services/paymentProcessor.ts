
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { subscriptionService } from "@/services/subscriptionService";
import { paymentsService } from "@/services/paymentsService";
import { RegistrationFormData } from "@/components/checkout/form/RegistrationFormSchema";
import { asaasCustomerService } from "@/services/asaasCustomerService";

export interface PaymentProcessingOptions {
  planId: string;
  installments: number;
  paymentType: PaymentType;
  formData?: RegistrationFormData;
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
      const { planId, installments, paymentType, formData, domain } = options;
      const processId = options.processId || `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Use the exact domain configured in Asaas
      const paymentDomain = domain || "https://crievalor.lovable.app";
      
      console.log(`[${processId}] Making checkout request with:`, {
        planId,
        installments,
        paymentType,
        successUrl: `${paymentDomain}/checkout/success`,
        cancelUrl: `${paymentDomain}/checkout/canceled`
      });
      
      // Clear any stale data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedCustomerData');
        localStorage.removeItem('lastFormSubmission');
      }
      
      // Store form data for later retrieval (if needed)
      let customerId = null;
      
      if (formData) {
        console.log(`[${processId}] Processing with form data:`, {
          name: formData.fullName,
          email: formData.email
        });
        
        // Store fresh form data locally for later use with a timestamp
        const timestamp = Date.now();
        localStorage.setItem('customerEmail', formData.email);
        localStorage.setItem('customerPhone', formData.phone);
        localStorage.setItem('customerName', formData.fullName);
        localStorage.setItem('customerCPF', formData.cpf);
        localStorage.setItem('formDataTimestamp', timestamp.toString());
      }
      
      // Simplified approach: Generate checkout session with static link
      const result = await subscriptionService.createCheckoutSession({
        planId,
        successUrl: `${paymentDomain}/checkout/success`,
        cancelUrl: `${paymentDomain}/checkout/canceled`,
        installments,
        paymentType,
        customerId, // This can be null, we'll get customer data from Asaas after payment
        timestamp: Date.now()
      });
      
      console.log(`[${processId}] Checkout result:`, result);
      
      if (result.isCustomPlan) {
        return {
          success: true,
          url: result.url,
          isCustomPlan: true
        };
      }
      
      if (!result.url) {
        throw new Error("Nenhum link de checkout foi retornado");
      }
      
      console.log(`[${processId}] Redirecting to checkout: ${result.url}`);
      
      return {
        success: true,
        url: result.url,
        payment: result.payment,
        dbSubscription: result.dbSubscription
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
