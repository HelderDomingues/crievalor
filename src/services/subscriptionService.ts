
import { supabase } from "@/integrations/supabase/client";
import { Subscription, CreateCheckoutOptions, PaymentDetails } from "@/types/subscription";
import { PLANS } from "@/services/plansService";
import { redirectToPayment } from "@/services/marPaymentLinks";
import { PaymentType } from "@/components/pricing/PaymentOptions";

export const subscriptionService = {
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  },

  getPlanFromId(planId: string) {
    return PLANS[planId.toUpperCase()];
  },
  
  async getPayments() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // For now, just return an empty array since we're not tracking individual payments
      return [];
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  },
  
  async updateContractAcceptance(accepted: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }
      
      const subscription = await this.getCurrentSubscription();
      if (!subscription) {
        return { success: false, error: "No subscription found" };
      }
      
      const { error } = await supabase
        .from("subscriptions")
        .update({
          contract_accepted: accepted,
          contract_accepted_at: accepted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", subscription.id);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Error updating contract acceptance:", error);
      return { success: false, error: error.message };
    }
  },
  
  async requestReceipt(invoiceId: string) {
    // This is a stub since we're not handling receipts through our system anymore
    return { 
      success: false, 
      error: "Recibos são gerenciados automaticamente pela plataforma de pagamentos." 
    };
  },
  
  redirectToPayment(planId: string, paymentType: PaymentType) {
    const plan = this.getPlanFromId(planId);
    if (!plan) return;
    
    paymentType = paymentType === 'credit' ? 'installments' : 'cash';
    
    // Use the direct payment link service
    redirectToPayment(planId, paymentType);
  }
};
