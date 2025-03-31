
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a unique external reference for payment tracking
 */
export const generateUniqueReference = async (userId: string, planId: string): Promise<string> => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${userId.substring(0, 8)}_${planId}_${timestamp}_${random}`;
};

/**
 * Tracks payment attempts to prevent duplicate submissions
 */
export const trackPaymentAttempt = (
  attemptsRegistry: Record<string, { count: number, timestamp: number }>,
  userId: string, 
  planId: string
): boolean => {
  const key = `${userId}_${planId}`;
  const now = Date.now();
  
  if (!attemptsRegistry[key]) {
    attemptsRegistry[key] = { count: 1, timestamp: now };
    return true;
  }
  
  // Reset counter if last attempt was more than 5 minutes ago
  if (now - attemptsRegistry[key].timestamp > 5 * 60 * 1000) {
    attemptsRegistry[key] = { count: 1, timestamp: now };
    return true;
  }
  
  // Allow up to 3 attempts within 5 minutes
  if (attemptsRegistry[key].count < 3) {
    attemptsRegistry[key].count++;
    attemptsRegistry[key].timestamp = now;
    return true;
  }
  
  // Block if too many attempts
  return false;
};

/**
 * Checks if a payment link is still valid
 */
export const checkPaymentLinkValidity = async (linkUrl: string): Promise<boolean> => {
  try {
    // First check if the link exists
    if (!linkUrl) return false;
    
    // Try to fetch the payment link to verify it's still active
    const response = await fetch(linkUrl, {
      method: 'HEAD',
      redirect: 'manual'
    });
    
    // If we get a redirect to asaas.com or similar domain, the link is valid
    // If we get a 404 or other error, the link is invalid
    const isValidStatus = response.status < 400;
    const hasValidRedirect = 
      response.status === 302 && 
      response.headers.get('location')?.includes('asaas.com');
      
    return isValidStatus || hasValidRedirect;
  } catch (error) {
    console.error("Error checking payment link validity:", error);
    return false;
  }
};

/**
 * Processes payment details for storage in subscription record
 */
export const processPaymentDetailsForStorage = (paymentData: any): any => {
  // Extract only the fields we want to store
  const {
    id, customer, value, netValue, description, billingType, 
    status, dueDate, paymentDate, creditDate, invoiceUrl,
    transactionReceiptUrl, bankSlipUrl, externalReference,
    installment, installmentCount, creditCardToken,
    fine, interest, discount
  } = paymentData;
  
  const paymentDetails = {
    payment_id: id,
    status,
    value,
    net_value: netValue,
    description,
    billing_type: billingType,
    installment_number: installment,
    total_installments: installmentCount,
    due_date: dueDate,
    payment_date: paymentDate,
    credit_date: creditDate,
    invoice_url: invoiceUrl,
    receipt_url: transactionReceiptUrl,
    bank_slip_url: bankSlipUrl,
    external_reference: externalReference,
    customer: typeof customer === 'string' ? { asaas_id: customer } : customer,
    processed_at: new Date().toISOString(),
    payment_method: {
      has_card_token: !!creditCardToken,
      has_fine: !!fine,
      has_interest: !!interest,
      has_discount: !!discount
    }
  };

  return paymentDetails;
};

/**
 * Enriches payment details with additional information from webhook event
 */
export const enrichPaymentDetails = (existingDetails: any, eventData: any, eventName: string): any => {
  // Start with existing details to maintain history
  const enrichedDetails = { ...existingDetails };
  
  // Add or update with new information
  if (eventData) {
    enrichedDetails.status = eventData.status || existingDetails.status;
    enrichedDetails.payment_date = eventData.paymentDate || existingDetails.payment_date;
    enrichedDetails.value = eventData.value || existingDetails.value;
    enrichedDetails.net_value = eventData.netValue || existingDetails.net_value;
    enrichedDetails.external_reference = eventData.externalReference || existingDetails.external_reference;
    
    // Add event history if it doesn't exist
    if (!enrichedDetails.event_history) {
      enrichedDetails.event_history = [];
    }
    
    // Add the new event to the history
    enrichedDetails.event_history.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      data: {
        status: eventData.status,
        paymentDate: eventData.paymentDate
      }
    });
  }
  
  return enrichedDetails;
};

/**
 * Updates the subscription record with payment details
 */
export const updateSubscriptionWithPaymentDetails = async (
  subscriptionId: string,
  paymentId: string,
  paymentStatus: string,
  paymentDetails: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        payment_id: paymentId,
        payment_status: paymentStatus,
        payment_details: paymentDetails,
        updated_at: new Date().toISOString()
      })
      .eq("id", subscriptionId);
      
    if (error) {
      console.error("Error updating subscription with payment details:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating subscription with payment details:", error);
    return false;
  }
};
