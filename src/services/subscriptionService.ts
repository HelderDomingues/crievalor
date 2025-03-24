
import { supabase } from "@/integrations/supabase/client";

// Define subscription types
export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
  contract_accepted?: boolean;
  contract_accepted_at?: string | null;
}

// Pricing plans
export const PLANS = {
  ESSENCIAL: {
    id: "plano_essencial_mensal",
    name: "Plano Essencial",
    price: "R$ 49,90",
    features: ["Atendimento online", "Acesso ao material básico", "Suporte por email"],
    stripe_price_id: "price_1R6IkIP90koqLuyYam1lsLkJ", 
  },
  BASIC: {
    id: "basic_plan",
    name: "Plano Básico",
    price: "R$ 89,90",
    features: ["Consultoria inicial", "Acesso ao material básico", "Suporte por email"],
    stripe_price_id: "price_1R5XpZP90koqLuyYBKb2OTOg", 
  },
  PRO: {
    id: "pro_plan",
    name: "Plano Profissional",
    price: "R$ 299,90",
    features: ["Tudo do Plano Básico", "Mentoria mensal", "Acesso à comunidade", "Suporte prioritário"],
    stripe_price_id: "price_1R5Xq2P90koqLuyYgTcwJz7Y", 
  },
  ENTERPRISE: {
    id: "enterprise_plan",
    name: "Plano Empresarial",
    price: "R$ 799,90",
    features: ["Tudo do Plano Profissional", "Consultoria personalizada", "Mentoria semanal", "Acesso a conteúdo exclusivo"],
    stripe_price_id: "price_1R5XqQP90koqLuyYmIG7S5sz", 
  },
};

// Map plan IDs to Stripe price IDs for easy lookup
const PLAN_TO_PRICE_ID_MAP = {
  plano_essencial_mensal: "price_1R6IkIP90koqLuyYam1lsLkJ",
  basic_plan: "price_1R5XpZP90koqLuyYBKb2OTOg",
  pro_plan: "price_1R5Xq2P90koqLuyYgTcwJz7Y",
  enterprise_plan: "price_1R5XqQP90koqLuyYmIG7S5sz",
};

export const subscriptionService = {
  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string) {
    try {
      // Find the plan with the matching ID
      const plan = Object.values(PLANS).find(plan => plan.id === planId);
      
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }
      
      console.log(`Creating checkout for plan: ${planId}, with price ID: ${plan.stripe_price_id}`);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Use the stripe_price_id for the Stripe checkout
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "create-checkout-session",
          data: {
            priceId: plan.stripe_price_id,
            successUrl,
            cancelUrl,
            userId: user.id  // Explicitly pass the user ID for checkout
          },
        },
      });

      if (response.error) {
        console.error("Error invoking Stripe function:", response.error);
        throw new Error(`Error creating checkout session: ${response.error.message}`);
      }

      const sessionData = response.data;
      if (!sessionData || !sessionData.url) {
        throw new Error("No valid data returned from checkout session creation");
      }

      console.log("Checkout session created successfully:", sessionData);
      return sessionData;
    } catch (error: any) {
      console.error("Error in createCheckoutSession:", error);
      throw error;
    }
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      console.log("Fetching current subscription...");
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        return null;
      }
      
      const userId = user.id;
      console.log(`Looking up subscription for user: ${userId}`);
      
      // First approach: Get the subscription from the database directly with detailed query
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (subscriptionError) {
        console.error("Error fetching subscription from database:", subscriptionError);
      } else if (subscriptionData) {
        console.log("Subscription found in database:", subscriptionData);
        return subscriptionData;
      } else {
        console.log("No subscription found in database");
      }
      
      // Second approach: Try the functions API as fallback
      console.log("Trying functions API to get subscription...");
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "get-subscription",
          data: { userId },
        },
      });

      if (response.error) {
        console.error("Error fetching subscription from API:", response.error);
        return null;
      }

      const data = response.data;
      console.log("Subscription data received from API:", data);
      return data?.subscription || null;
    } catch (error) {
      console.error("Error in getCurrentSubscription:", error);
      return null;
    }
  },

  async cancelSubscription(subscriptionId: string) {
    try {
      console.log(`Attempting to cancel subscription: ${subscriptionId}`);
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "cancel-subscription",
          data: {
            subscriptionId,
          },
        },
      });

      if (response.error) {
        console.error("Error canceling subscription:", response.error);
        throw new Error(`Error canceling subscription: ${response.error.message}`);
      }

      console.log("Subscription canceled successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error in cancelSubscription:", error);
      throw error;
    }
  },

  // Helper function to check if user has an active subscription
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();
      const isActive = subscription !== null && ["active", "trialing"].includes(subscription.status);
      console.log(`Active subscription check: ${isActive}`, subscription);
      return isActive;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  },

  // Helper function to get plan information from Stripe price ID
  getPlanFromPriceId(priceId: string) {
    return Object.values(PLANS).find(plan => plan.stripe_price_id === priceId);
  },

  async getInvoices() {
    try {
      console.log("Fetching invoices...");
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "get-invoices",
          data: {},
        },
      });

      if (response.error) {
        console.error("Error fetching invoices:", response.error);
        return null;
      }

      const data = response.data;
      console.log("Invoices data received:", data);
      return data?.invoices || [];
    } catch (error) {
      console.error("Error in getInvoices:", error);
      return [];
    }
  },

  async getInvoice(invoiceId: string) {
    try {
      console.log(`Fetching invoice: ${invoiceId}`);
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "get-invoice",
          data: {
            invoiceId,
          },
        },
      });

      if (response.error) {
        console.error("Error fetching invoice:", response.error);
        return null;
      }

      return response.data?.invoice || null;
    } catch (error) {
      console.error("Error in getInvoice:", error);
      return null;
    }
  },

  async updateContractAcceptance(accepted: boolean) {
    try {
      console.log(`Updating contract acceptance: ${accepted}`);
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "update-contract-acceptance",
          data: {
            accepted,
            acceptedAt: new Date().toISOString(),
          },
        },
      });

      if (response.error) {
        console.error("Error updating contract acceptance:", response.error);
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error in updateContractAcceptance:", error);
      return { success: false, error: error.message };
    }
  },

  async requestReceipt(invoiceId: string) {
    try {
      console.log(`Requesting receipt for invoice: ${invoiceId}`);
      const response = await supabase.functions.invoke("stripe", {
        body: {
          action: "request-receipt",
          data: {
            invoiceId,
          },
        },
      });

      if (response.error) {
        console.error("Error requesting receipt:", response.error);
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error in requestReceipt:", error);
      return { success: false, error: error.message };
    }
  }
};
