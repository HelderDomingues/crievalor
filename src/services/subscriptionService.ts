
import { supabase } from "@/integrations/supabase/client";

// Define subscription types
export interface Subscription {
  id: string;
  user_id: string;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_payment_link: string | null;
  plan_id: string;
  status: string;
  installments: number;
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
    price: 179.90,
    priceLabel: "R$ 179,90",
    features: ["Atendimento online", "Acesso ao material básico", "Suporte por email"],
  },
  BASIC: {
    id: "basic_plan",
    name: "Plano Básico",
    price: 89.90,
    priceLabel: "R$ 89,90",
    features: ["Consultoria inicial", "Acesso ao material básico", "Suporte por email"],
  },
  PRO: {
    id: "pro_plan",
    name: "Plano Profissional",
    price: 299.90,
    priceLabel: "R$ 299,90",
    features: ["Tudo do Plano Básico", "Mentoria mensal", "Acesso à comunidade", "Suporte prioritário"],
  },
  ENTERPRISE: {
    id: "enterprise_plan",
    name: "Plano Empresarial",
    price: 799.90,
    priceLabel: "R$ 799,90",
    features: ["Tudo do Plano Profissional", "Consultoria personalizada", "Mentoria semanal", "Acesso a conteúdo exclusivo"],
  },
};

export interface CreateCheckoutOptions {
  planId: string;
  successUrl: string;
  cancelUrl: string;
  installments?: number;
}

export const subscriptionService = {
  async createCustomer(profile: any) {
    try {
      console.log("Creating Asaas customer for profile:", profile);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-customer",
          data: {
            name: profile.full_name || profile.username || "Cliente",
            email: profile.email,
            phone: profile.phone || "",
            cpfCnpj: profile.cnpj || "",
          },
        },
      });

      if (response.error) {
        console.error("Error creating Asaas customer:", response.error);
        throw new Error(`Error creating customer: ${response.error.message}`);
      }

      return response.data.customer;
    } catch (error: any) {
      console.error("Error in createCustomer:", error);
      throw error;
    }
  },

  async createCheckoutSession(options: CreateCheckoutOptions) {
    try {
      const { planId, successUrl, cancelUrl, installments = 1 } = options;
      
      // Find the plan with the matching ID
      const plan = Object.values(PLANS).find(plan => plan.id === planId);
      
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }
      
      console.log(`Creating checkout for plan: ${planId}, installments: ${installments}`);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Get user profile to create or retrieve customer
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      // Check if user already has an Asaas customer ID
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("asaas_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      let customerId = existingSub?.asaas_customer_id;
      
      // If no customer ID exists, create a new customer
      if (!customerId) {
        if (!profile) {
          throw new Error("User profile not found");
        }
        
        const customer = await this.createCustomer({
          ...profile,
          email: user.email
        });
        
        customerId = customer.id;
      }
      
      // Create subscription in Asaas
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-subscription",
          data: {
            customerId,
            planId,
            value: plan.price,
            description: `Assinatura: ${plan.name}`,
            successUrl,
            installments,
            nextDueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0], // tomorrow
          },
        },
      });

      if (response.error) {
        console.error("Error creating Asaas subscription:", response.error);
        throw new Error(`Error creating subscription: ${response.error.message}`);
      }

      console.log("Asaas subscription created successfully:", response.data);
      return {
        url: response.data.paymentLink,
        subscription: response.data.subscription,
        dbSubscription: response.data.dbSubscription
      };
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
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-subscription",
          data: {
            userId: user.id,
          },
        },
      });

      if (response.error) {
        console.error("Error fetching subscription:", response.error);
        return null;
      }

      return response.data?.subscription || null;
    } catch (error) {
      console.error("Error in getCurrentSubscription:", error);
      return null;
    }
  },

  async cancelSubscription(subscriptionId: string) {
    try {
      console.log(`Attempting to cancel subscription: ${subscriptionId}`);
      const response = await supabase.functions.invoke("asaas", {
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
      const isActive = subscription !== null && ["active", "ACTIVE"].includes(subscription.status);
      console.log(`Active subscription check: ${isActive}`, subscription);
      return isActive;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  },

  // Helper function to get plan information from plan ID
  getPlanFromId(planId: string) {
    return Object.values(PLANS).find(plan => plan.id === planId);
  },

  // Add a function to get payments that will replace getInvoices
  async getPayments() {
    try {
      console.log("Fetching payments...");
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payments",
          data: {},
        },
      });

      if (response.error) {
        console.error("Error fetching payments:", response.error);
        return [];
      }

      console.log("Payments data received:", response.data);
      return response.data?.payments || [];
    } catch (error) {
      console.error("Error in getPayments:", error);
      return [];
    }
  },

  async getPayment(paymentId: string) {
    try {
      console.log(`Fetching payment: ${paymentId}`);
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payment",
          data: {
            paymentId,
          },
        },
      });

      if (response.error) {
        console.error("Error fetching payment:", response.error);
        return null;
      }

      return response.data?.payment || null;
    } catch (error) {
      console.error("Error in getPayment:", error);
      return null;
    }
  },

  async updateContractAcceptance(accepted: boolean) {
    try {
      console.log(`Updating contract acceptance: ${accepted}`);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      const { error } = await supabase
        .from("subscriptions")
        .update({
          contract_accepted: accepted,
          contract_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
        
      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error in updateContractAcceptance:", error);
      return { success: false, error: error.message };
    }
  },

  async requestReceipt(paymentId: string) {
    try {
      console.log(`Requesting receipt for payment: ${paymentId}`);
      const payment = await this.getPayment(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      if (payment.invoiceUrl) {
        return { success: true, url: payment.invoiceUrl };
      }
      
      return { success: false, error: "Invoice not available for this payment" };
    } catch (error: any) {
      console.error("Error in requestReceipt:", error);
      return { success: false, error: error.message };
    }
  }
};
