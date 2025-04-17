
import { useToast } from "@/hooks/use-toast";
import { PLANS } from "@/services/plansService";

export type PaymentType = 'installments' | 'cash' | 'corporate' | 'credit' | 'pix';

/**
 * Direct payment links for each plan and payment type
 */
export const PAYMENT_LINKS = {
  basic_plan: {
    installments: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s", // Parcelado
    cash: "https://sandbox.asaas.com/c/fy15747uacorzbla"         // À vista
  },
  pro_plan: {
    installments: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon", // Parcelado
    cash: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq"          // À vista
  },
  enterprise_plan: {
    installments: "https://sandbox.asaas.com/c/z4vate6zwonrwoft", // Parcelado
    cash: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s"          // À vista
  },
  corporate_plan: {
    corporate: "https://wa.me/+5547992150289"                     // Whatsapp
  }
};

/**
 * Map legacy payment types to new payment types
 */
export function mapPaymentType(type: string): PaymentType {
  const mapping: Record<string, PaymentType> = {
    'credit': 'installments',
    'pix': 'cash',
    'cash': 'cash'
  };
  
  return mapping[type] || 'installments';
}

/**
 * Redirect to the appropriate payment link based on plan and payment type
 */
export function redirectToPayment(planId: string, paymentType: PaymentType): void {
  // Map legacy payment types if needed
  const mappedType = mapPaymentType(paymentType);
  
  const linkMap = PAYMENT_LINKS[planId as keyof typeof PAYMENT_LINKS];
  
  if (!linkMap) {
    console.error(`No payment links configured for plan: ${planId}`);
    return;
  }
  
  const paymentLink = linkMap[mappedType as keyof typeof linkMap];
  
  if (!paymentLink) {
    console.error(`No ${mappedType} payment link found for plan: ${planId}`);
    return;
  }
  
  // Store purchase intent in localStorage
  localStorage.setItem('checkoutPlanId', planId);
  localStorage.setItem('checkoutPaymentType', mappedType);
  localStorage.setItem('checkoutTimestamp', String(Date.now()));
  
  // Redirect to the payment link
  window.open(paymentLink, '_blank');
}

/**
 * Get payment link for a specific plan and payment type
 */
export function getPaymentLink(planId: string, paymentType: PaymentType): string | null {
  // Map legacy payment types if needed
  const mappedType = mapPaymentType(paymentType);
  
  const linkMap = PAYMENT_LINKS[planId as keyof typeof PAYMENT_LINKS];
  
  if (!linkMap) {
    return null;
  }
  
  return linkMap[mappedType as keyof typeof linkMap] || null;
}

/**
 * Simplified payload tracking service
 */
export const paymentTrackingService = {
  trackPaymentIntent(planId: string, paymentType: PaymentType): void {
    const plan = PLANS[planId.toUpperCase()];
    if (!plan) return;
    
    // Store basic payment intent info
    localStorage.setItem('paymentIntent', JSON.stringify({
      planId: planId,
      planName: plan.name,
      paymentType: paymentType,
      timestamp: Date.now()
    }));
    
    console.log(`Payment intent tracked for ${plan.name} with ${paymentType} payment`);
  },
  
  getLastPaymentIntent(): any {
    const intentData = localStorage.getItem('paymentIntent');
    if (!intentData) return null;
    
    try {
      return JSON.parse(intentData);
    } catch (err) {
      console.error('Failed to parse payment intent data:', err);
      return null;
    }
  },
  
  clearPaymentIntent(): void {
    localStorage.removeItem('paymentIntent');
  }
};
