
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

// Define plan types more explicitly
interface RegularPlan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  totalPrice: number;
  cashPrice: number;
  features: string[];
}

interface CustomPricePlan {
  id: string;
  name: string;
  customPrice: boolean;
  features: string[];
}

export type Plan = RegularPlan | CustomPricePlan;

// Pricing plans
export const PLANS: Record<string, Plan> = {
  BASIC: {
    id: "basic_plan",
    name: "Plano Essencial",
    price: 179.90,
    priceLabel: "12x de R$ 179,90",
    totalPrice: 2158.80, // 12 * 179.90
    cashPrice: 1942.92, // 10% discount on total
    features: ["Plano Estratégico simplificado", "Workshop de implantação", "Suporte por e-mail", "Acesso à comunidade"],
  },
  PRO: {
    id: "pro_plan",
    name: "Plano Profissional",
    price: 299.90,
    priceLabel: "12x de R$ 299,90",
    totalPrice: 3598.80, // 12 * 299.90
    cashPrice: 3238.92, // 10% discount on total
    features: ["Plano Estratégico detalhado", "Relatórios completos", "Workshop de implantação", "Sessão estratégica exclusiva", "Suporte via Whatsapp"],
  },
  ENTERPRISE: {
    id: "enterprise_plan",
    name: "Plano Empresarial",
    price: 799.90,
    priceLabel: "12x de R$ 799,90",
    totalPrice: 9598.80, // 12 * 799.90
    cashPrice: 8638.92, // 10% discount on total
    features: ["Plano Estratégico completo", "Relatórios completos", "Mentoria estratégica", "Acesso VIP a conteúdos exclusivos", "Suporte prioritário"],
  },
  CORPORATE: {
    id: "corporate_plan",
    name: "Plano Corporativo",
    customPrice: true,
    features: ["Plano Estratégico personalizado", "Consultoria dedicada", "Mentoria para equipe completa", "Acesso prioritário ao CEO", "Implementação assistida"],
  }
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
      
      // Make sure either CPF or CNPJ is provided
      const cpfCnpj = profile.cnpj || profile.cpf || "";
      
      if (!cpfCnpj) {
        throw new Error("CPF ou CNPJ é obrigatório");
      }
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-customer",
          data: {
            name: profile.full_name || profile.username || "Cliente",
            email: profile.email,
            phone: profile.phone || "",
            cpfCnpj: cpfCnpj,
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
      
      if ('customPrice' in plan && plan.customPrice) {
        // For custom price plans, redirect to contact page
        return {
          url: "/contato?subject=Plano Corporativo",
          isCustomPlan: true
        };
      }
      
      // Now we can safely cast plan to RegularPlan since we've checked customPrice above
      const regularPlan = plan as RegularPlan;
      
      console.log(`Creating checkout for plan: ${planId} with ${installments} installments`);
      
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
        
      if (!profile) {
        throw new Error("User profile not found");
      }
      
      // Validate required fields
      if (!profile.full_name) {
        throw new Error("Nome completo é obrigatório");
      }
      
      if (!profile.phone) {
        throw new Error("Telefone é obrigatório");
      }
      
      if (!profile.cpf && !profile.cnpj) {
        throw new Error("CPF ou CNPJ é obrigatório");
      }
      
      // Check if user already has an Asaas customer ID
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("asaas_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      // Initialize customerId as null
      let customerId = null;
      
      // Only try to access asaas_customer_id if data exists
      if (existingSub?.asaas_customer_id) {
        customerId = existingSub.asaas_customer_id;
      }
      
      // If no customer ID exists, create a new customer
      if (!customerId) {
        const customer = await this.createCustomer({
          ...profile,
          email: user.email
        });
        
        customerId = customer.id;
      }
      
      // Calculate the payment value based on installments
      const paymentValue = installments === 1 ? regularPlan.cashPrice : regularPlan.totalPrice;
      
      // Create payment in Asaas for one-time purchase with installments
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-payment",
          data: {
            customerId,
            planId,
            value: paymentValue,
            description: `Compra: ${regularPlan.name}`,
            successUrl,
            cancelUrl,
            installments,
            nextDueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0], // tomorrow
            generateLink: true
          },
        },
      });

      if (response.error) {
        console.error("Error creating Asaas payment:", response.error);
        throw new Error(`Error creating payment: ${response.error.message}`);
      }

      console.log("Asaas payment created successfully:", response.data);
      return {
        url: response.data.paymentLink,
        payment: response.data.payment,
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
  getPlanFromId(planId: string): Plan | undefined {
    return Object.values(PLANS).find(plan => plan.id === planId);
  },

  // Add a function to get payments
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
