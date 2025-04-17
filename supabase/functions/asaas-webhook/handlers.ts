
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

interface WebhookPayload {
  event: string;
  payment?: {
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
  };
}

export const handlers: Record<string, (payload: WebhookPayload, supabase: SupabaseClient) => Promise<any>> = {
  // Handler for payment confirmation events
  "PAYMENT_CONFIRMED": async (payload: WebhookPayload, supabase: SupabaseClient) => {
    try {
      console.log("Payment confirmed webhook received:", payload);
      
      if (!payload.payment) {
        console.error("Payment information missing in webhook payload");
        return { success: false, error: "Payment information missing" };
      }
      
      const { payment } = payload;
      const externalReference = payment.externalReference;
      
      if (!externalReference) {
        console.error("External reference is missing, cannot link payment to subscription");
        return { success: false, error: "External reference missing" };
      }
      
      console.log(`Looking for subscription with external reference: ${externalReference}`);
      
      // Query the subscription with the external reference
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("external_reference", externalReference)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching subscription:", error);
        return { success: false, error: "Database error" };
      }
      
      if (!subscription) {
        console.log("No subscription found with that external reference");
        return { success: false, error: "Subscription not found" };
      }
      
      console.log(`Updating subscription status for ID: ${subscription.id}`);
      
      // Update the subscription status to active
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          payment_status: payment.status,
          payment_id: payment.id,
          updated_at: new Date().toISOString(),
          payment_details: {
            billingType: payment.billingType,
            value: payment.value,
            netValue: payment.netValue,
            dueDate: payment.dueDate,
            status: payment.status,
            description: payment.description
          }
        })
        .eq("id", subscription.id);
      
      if (updateError) {
        console.error("Error updating subscription:", updateError);
        return { success: false, error: "Failed to update subscription" };
      }
      
      return {
        success: true,
        message: `Subscription ${subscription.id} updated to active`
      };
    } catch (error) {
      console.error("Error handling payment confirmation:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Handler for payment received events
  "PAYMENT_RECEIVED": async (payload: WebhookPayload, supabase: SupabaseClient) => {
    // Delegate to PAYMENT_CONFIRMED handler since they do the same thing
    return handlers["PAYMENT_CONFIRMED"](payload, supabase);
  },
  
  // Handler for payment overdue events
  "PAYMENT_OVERDUE": async (payload: WebhookPayload, supabase: SupabaseClient) => {
    try {
      console.log("Payment overdue webhook received:", payload);
      
      if (!payload.payment || !payload.payment.externalReference) {
        return { success: false, error: "Invalid payload" };
      }
      
      const { externalReference } = payload.payment;
      
      // Update subscription status
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          payment_status: "OVERDUE",
          updated_at: new Date().toISOString()
        })
        .eq("external_reference", externalReference)
        .select();
      
      if (error) {
        console.error("Error updating subscription for overdue payment:", error);
        return { success: false, error: error.message };
      }
      
      return {
        success: true,
        message: `Updated payment status to OVERDUE for reference ${externalReference}`
      };
    } catch (error) {
      console.error("Error handling payment overdue:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Handler for payment refunded events
  "PAYMENT_REFUNDED": async (payload: WebhookPayload, supabase: SupabaseClient) => {
    try {
      console.log("Payment refunded webhook received:", payload);
      
      if (!payload.payment || !payload.payment.externalReference) {
        return { success: false, error: "Invalid payload" };
      }
      
      const { externalReference } = payload.payment;
      
      // Update subscription status
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          payment_status: "REFUNDED",
          updated_at: new Date().toISOString()
        })
        .eq("external_reference", externalReference)
        .select();
      
      if (error) {
        console.error("Error updating subscription for refunded payment:", error);
        return { success: false, error: error.message };
      }
      
      return {
        success: true,
        message: `Updated payment status to REFUNDED for reference ${externalReference}`
      };
    } catch (error) {
      console.error("Error handling payment refunded:", error);
      return { success: false, error: error.message };
    }
  }
};
