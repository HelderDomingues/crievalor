
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
    stripe_price_id: "price_basic",
  },
  PRO: {
    id: "pro_plan",
    name: "Plano Profissional",
    price: "R$ 299,90",
    features: ["Tudo do Plano Básico", "Mentoria mensal", "Acesso à comunidade", "Suporte prioritário"],
    stripe_price_id: "price_pro",
  },
  ENTERPRISE: {
    id: "enterprise_plan",
    name: "Plano Empresarial",
    price: "R$ 799,90",
    features: ["Tudo do Plano Profissional", "Consultoria personalizada", "Mentoria semanal", "Acesso a conteúdo exclusivo"],
    stripe_price_id: "price_enterprise",
  },
};

export const subscriptionService = {
  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    try {
      console.log(`Creating checkout session for plan: ${priceId}`);
      
      // Find the plan with the matching ID
      const plan = Object.values(PLANS).find(plan => plan.id === priceId);
      
      if (!plan) {
        throw new Error(`Plan with ID ${priceId} not found`);
      }
      
      console.log(`Using Stripe price ID: ${plan.stripe_price_id}`);
      
      // Use the stripe_price_id for the Stripe checkout
      const { data: sessionData, error } = await supabase.functions.invoke("stripe", {
        body: {
          action: "create-checkout-session",
          data: {
            priceId: plan.stripe_price_id,
            successUrl,
            cancelUrl,
            // Pass the actual plan ID for our internal reference
            planId: plan.id
          },
        },
      });

      if (error) {
        console.error("Error from Stripe function:", error);
        throw new Error(`Error creating checkout session: ${error.message}`);
      }

      if (!sessionData || !sessionData.url) {
        console.error("Invalid response from Stripe function:", sessionData);
        throw new Error("Invalid response from checkout session");
      }

      console.log("Checkout session created successfully:", sessionData.sessionId);
      return sessionData;
    } catch (error) {
      console.error("Error in createCheckoutSession:", error);
      throw error;
    }
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
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

    return data.subscription;
  },

  async cancelSubscription(subscriptionId: string) {
    const { data, error } = await supabase.functions.invoke("stripe", {
      body: {
        action: "cancel-subscription",
        data: {
          subscriptionId,
        },
      },
    });

    if (error) {
      throw new Error(`Error canceling subscription: ${error.message}`);
    }

    return data;
  },

  // Helper function to check if user has an active subscription
  async hasActiveSubscription(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    return subscription !== null && ["active", "trialing"].includes(subscription.status);
  },
};
