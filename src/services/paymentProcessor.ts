
import { RegistrationFormData } from "@/components/checkout/form/RegistrationFormSchema";
import { redirectToPayment, paymentTrackingService } from "@/services/marPaymentLinks";
import { PaymentType } from "@/services/marPaymentLinks";
import { PLANS } from "@/services/plansService";
import { plansService } from "@/services/plansService";

export interface ProcessPaymentOptions {
  planId: string;
  installments: number;
  paymentType: PaymentType;
  formData?: RegistrationFormData;
  processId: string;
  recoveryState?: any;
}

export interface ProcessPaymentResult {
  success: boolean;
  url?: string;
  error?: string;
  isCustomPlan?: boolean;
}

export const paymentProcessor = {
  async processPayment(options: ProcessPaymentOptions): Promise<ProcessPaymentResult> {
    const { planId, installments, paymentType, formData, processId } = options;
    
    try {
      console.log(`[${processId}] Starting payment process for plan ${planId}`);
      
      // Store customer information if available
      if (formData) {
        localStorage.setItem('customerEmail', formData.email);
        localStorage.setItem('customerPhone', formData.phone);
        localStorage.setItem('customerName', formData.fullName);
        localStorage.setItem('customerCPF', formData.cpf);
      }
      
      // Get plan details
      const plan = PLANS[planId.toUpperCase()];
      if (!plan) {
        throw new Error(`Plan ${planId} does not exist`);
      }
      
      // Check if it's a custom price plan
      if (plansService.isCustomPricePlan(plan)) {
        console.log(`[${processId}] Custom price plan ${planId} detected`);
        
        // Track payment intent
        paymentTrackingService.trackPaymentIntent(planId, 'corporate');
        
        return {
          success: true,
          url: plan.contactOptions.whatsappUrl,
          isCustomPlan: true
        };
      }
      
      if (!plansService.isRegularPlan(plan)) {
        throw new Error(`Plan ${planId} is not properly configured`);
      }
      
      // Determine the payment URL based on payment type
      const effectivePaymentType = paymentType === 'cash' || installments === 1 ? 'cash' : 'installments';
      const paymentUrl = effectivePaymentType === 'cash' 
        ? plan.paymentOptions.cashPaymentUrl 
        : plan.paymentOptions.creditPaymentUrl;
      
      if (!paymentUrl) {
        throw new Error(`No payment URL found for plan ${planId} with payment type ${effectivePaymentType}`);
      }
      
      console.log(`[${processId}] Redirecting to payment URL: ${paymentUrl}`);
      
      // Track payment intent
      paymentTrackingService.trackPaymentIntent(planId, effectivePaymentType);
      
      return {
        success: true,
        url: paymentUrl
      };
    } catch (error) {
      console.error(`[${processId}] Error processing payment:`, error);
      return {
        success: false,
        error: error.message || 'Unknown error processing payment'
      };
    }
  },
  
  storePaymentState(result: ProcessPaymentResult, state: any): void {
    // Store the result and state for recovery purposes
    localStorage.setItem('lastPaymentResult', JSON.stringify(result));
    localStorage.setItem('lastPaymentState', JSON.stringify(state));
  }
};
