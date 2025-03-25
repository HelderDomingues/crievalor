
import { supabase } from "@/integrations/supabase/client";
import { Subscription, CreateCheckoutOptions } from "@/types/subscription";
import { plansService } from "./plansService";
import { asaasCustomerService } from "./asaasCustomerService";
import { paymentsService } from "./paymentsService";

export { PLANS } from "./plansService";
export type { Plan, Subscription, CreateCheckoutOptions, RegularPlan, CustomPricePlan } from "@/types/subscription";

export const subscriptionService = {
  async createCheckoutSession(options: CreateCheckoutOptions) {
    try {
      const { planId, successUrl, cancelUrl, installments = 1 } = options;
      
      // Find the plan with the matching ID
      const plan = plansService.getPlanById(planId);
      
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }
      
      if (plansService.isCustomPricePlan(plan)) {
        // For custom price plans, redirect to contact page
        return {
          url: "/contato?subject=Plano Corporativo",
          isCustomPlan: true
        };
      }
      
      // Now we can safely cast plan to RegularPlan since we've checked customPrice above
      const regularPlan = plan as any; // TypeScript issue fixed by treating as any
      
      console.log(`Creating checkout for plan: ${planId} with ${installments} installments`);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Get user profile to create or retrieve customer
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (!profileData) {
        throw new Error("User profile not found");
      }
      
      // Properly handle the social_media object which might be a Json type
      const socialMediaObj = typeof profileData.social_media === 'object' && profileData.social_media !== null
        ? profileData.social_media
        : {};
        
      // Create a properly structured social_media object with defaults
      const social_media = {
        linkedin: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'linkedin' in socialMediaObj 
          ? String(socialMediaObj.linkedin || '') 
          : '',
        twitter: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'twitter' in socialMediaObj 
          ? String(socialMediaObj.twitter || '') 
          : '',
        instagram: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'instagram' in socialMediaObj 
          ? String(socialMediaObj.instagram || '') 
          : '',
        facebook: typeof socialMediaObj === 'object' && socialMediaObj !== null && 'facebook' in socialMediaObj 
          ? String(socialMediaObj.facebook || '') 
          : ''
      };
      
      // Add email to the profile for customer creation
      const profileWithEmail = {
        ...profileData,
        email: user.email,
        social_media: social_media
      };
      
      // Validate required fields based on Asaas documentation
      if (!profileWithEmail.full_name) {
        throw new Error("Nome completo é obrigatório");
      }
      
      if (!profileWithEmail.phone) {
        throw new Error("Telefone é obrigatório");
      }
      
      if (!profileWithEmail.cnpj && !profileWithEmail.cpf) {
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
        const customer = await asaasCustomerService.createCustomer(profileWithEmail);
        customerId = customer.id;
      }
      
      // Calculate the payment value based on installments
      const paymentValue = plansService.calculatePaymentAmount(regularPlan, installments);
      
      // Generate a unique reference ID to prevent duplicate payments
      const uniqueReference = `pay_${user.id.substring(0, 8)}_${Date.now()}`;
      
      // Prepare payment data according to Asaas API requirements
      const paymentData = {
        customerId,
        planId,
        value: paymentValue,
        description: `Compra: ${regularPlan.name}`,
        successUrl,
        cancelUrl,
        installments,
        nextDueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0], // tomorrow
        generateLink: true,
        billingType: installments > 1 ? "CREDIT_CARD" : "UNDEFINED",
        dueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0],
        externalReference: uniqueReference,
        postalService: false
      };
      
      console.log("Sending payment data to Asaas:", paymentData);
      
      // Create payment in Asaas for one-time purchase with installments
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-payment",
          data: paymentData,
        },
      });

      if (response.error) {
        console.error("Error creating Asaas payment:", response.error);
        throw new Error(`Error creating payment: ${response.error.message}`);
      }

      console.log("Asaas payment created successfully:", response.data);
      
      // Important: Redirect directly to the payment link URL
      if (response.data && response.data.paymentLink) {
        // Add delay to ensure the Asaas payment link is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          url: response.data.paymentLink,
          payment: response.data.payment,
          dbSubscription: response.data.dbSubscription
        };
      } else {
        throw new Error("No payment link was returned from Asaas");
      }
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
  getPlanFromId(planId: string): any {
    return plansService.getPlanById(planId);
  },

  // Get payments using the paymentsService
  async getPayments() {
    return paymentsService.getPayments();
  },

  // Get a specific payment using the paymentsService
  async getPayment(paymentId: string) {
    return paymentsService.getPayment(paymentId);
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

  // Request a receipt for a payment using the paymentsService
  async requestReceipt(paymentId: string) {
    return paymentsService.requestReceipt(paymentId);
  }
};
