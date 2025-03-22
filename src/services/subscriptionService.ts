
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
}

// Pricing plans
export const PLANS = {
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
  basic_plan: "price_1R5XpZP90koqLuyYBKb2OTOg",
  pro_plan: "price_1R5Xq2P90koqLuyYgTcwJz7Y",
  enterprise_plan: "price_1R5XqQP90koqLuyYmIG7S5sz",
};

export const subscriptionService = {
  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string) {
    // Find the plan with the matching ID
    const plan = Object.values(PLANS).find(plan => plan.id === planId);
    
    if (!plan) {
      throw new Error(`Plan with ID ${planId} not found`);
    }
    
    console.log(`Creating checkout for plan: ${planId}, with price ID: ${plan.stripe_price_id}`);
    
    // Use the stripe_price_id for the Stripe checkout
    const { data: sessionData, error } = await supabase.functions.invoke("stripe", {
      body: {
        action: "create-checkout-session",
        data: {
          priceId: plan.stripe_price_id,
          successUrl,
          cancelUrl,
        },
      },
    });

    if (error) {
      console.error("Error invoking Stripe function:", error);
      throw new Error(`Error creating checkout session: ${error.message}`);
    }

    if (!sessionData) {
      throw new Error("No data returned from checkout session creation");
    }

    console.log("Checkout session created successfully:", sessionData);
    return sessionData;
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      console.log("Fetching current subscription...");
      const { data, error } = await supabase.functions.invoke("stripe", {
        body: {
          action: "get-subscription",
          data: {},
        },
      });

      if (error) {
        console.error("Error fetching subscription:", error);
        return null;
      }

      console.log("Subscription data received:", data);
      return data.subscription;
    } catch (error) {
      console.error("Error in getCurrentSubscription:", error);
      return null;
    }
  },

  async cancelSubscription(subscriptionId: string) {
    console.log(`Attempting to cancel subscription: ${subscriptionId}`);
    const { data, error } = await supabase.functions.invoke("stripe", {
      body: {
        action: "cancel-subscription",
        data: {
          subscriptionId,
        },
      },
    });

    if (error) {
      console.error("Error canceling subscription:", error);
      throw new Error(`Error canceling subscription: ${error.message}`);
    }

    console.log("Subscription canceled successfully:", data);
    return data;
  },

  // Helper function to check if user has an active subscription
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();
      const isActive = subscription !== null && ["active", "trialing"].includes(subscription.status);
      console.log(`Active subscription check: ${isActive}`);
      return isActive;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  },
  
  // Helper function to get plan information from Stripe price ID
  getPlanFromPriceId(priceId: string) {
    return Object.values(PLANS).find(plan => plan.stripe_price_id === priceId);
  }
};
