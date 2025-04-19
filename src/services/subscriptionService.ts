import { supabase } from "@/integrations/supabase/client";
import { Subscription, CreateCheckoutOptions, PaymentDetails, Plan, RegularPlan, CustomPricePlan } from "@/types/subscription";
import { plansService } from "./plansService";
import { asaasCustomerService } from "./asaasCustomerService";
import { paymentsService } from "./paymentsService";

export { PLANS } from "./plansService";

// Re-export types for easier importing by components
export type { Subscription, CreateCheckoutOptions, Plan, RegularPlan, CustomPricePlan, PaymentDetails };

export const subscriptionService = {
  async createCheckoutSession(options: CreateCheckoutOptions) {
    try {
      const { planId, successUrl, cancelUrl, installments = 1, paymentType = "credit" } = options;
      
      // Find the plan with the corresponding ID
      const plan = plansService.getPlanById(planId);
      
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }
      
      if (plansService.isCustomPricePlan(plan)) {
        // For custom price plans, redirect to the contact page
        return {
          url: "/contato?subject=Plano Corporativo",
          isCustomPlan: true
        };
      }
      
      // Now we can safely cast to RegularPlan
      const regularPlan = plan as any;
      
      console.log(`Creating checkout for plan: ${planId} with ${installments} installments, payment type: ${paymentType}`);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
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
      
      // Process social_media object correctly
      const socialMediaObj = typeof profileData.social_media === 'object' && profileData.social_media !== null
        ? profileData.social_media
        : {};
        
      // Create a structured social_media object with defaults
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
      
      // Add email to profile for customer creation
      const profileWithEmail = {
        ...profileData,
        email: user.email,
        social_media: social_media
      };
      
      // Validate required fields based on Asaas documentation
      if (!profileWithEmail.full_name) {
        throw new Error("Full name is required");
      }
      
      if (!profileWithEmail.phone) {
        throw new Error("Phone is required");
      }
      
      if (!profileWithEmail.cnpj && !profileWithEmail.cpf) {
        throw new Error("CPF or CNPJ is required");
      }
      
      // Create or retrieve Asaas customer
      const { customerId, isNew } = await asaasCustomerService.createOrRetrieveCustomer(profileWithEmail);
      
      if (!customerId) {
        throw new Error("Could not obtain Asaas customer ID");
      }
      
      console.log(`Asaas customer ${isNew ? 'created' : 'retrieved'}: ${customerId}`);
      
      // Calculate payment amount based on installments - using the TOTAL to be paid, not the per-installment value
      const totalPaymentValue = installments === 1 ? regularPlan.cashPrice : regularPlan.totalPrice;
      
      // Generate a unique external reference to prevent duplicate payments
      const externalReference = await paymentsService.generateUniqueReference(user.id, planId);
      
      // Check if there's already a pending payment for this plan and user
      const existingPaymentCheck = await paymentsService.checkExistingPayment(customerId, planId, user.id, installments);
      
      // If we already have a pending payment with a link, return that link instead of creating a new one
      if (!existingPaymentCheck.needsCreation && existingPaymentCheck.paymentLink) {
        console.log("Found existing payment, returning link:", existingPaymentCheck.paymentLink);
        return {
          url: existingPaymentCheck.paymentLink,
          payment: existingPaymentCheck.payment,
          dbSubscription: existingPaymentCheck.dbSubscription,
          directRedirect: true,
          isExisting: true
        };
      }
      
      // Prepare payment data according to Asaas API requirements
      const nextDueDate = new Date(Date.now() + 3600 * 1000 * 24);
      const dueDate = nextDueDate.toISOString().split('T')[0]; // format YYYY-MM-DD
      
      // Determine billing type based on selected payment method
      const billingType = paymentType === "credit" 
        ? "CREDIT_CARD" 
        : paymentType === "pix" 
          ? "PIX" 
          : "BOLETO";
      
      // Create payment in Asaas
      const { paymentId, paymentLink } = await paymentsService.createPayment({
        customerId,
        planId,
        userId: user.id,
        value: totalPaymentValue, // We pass the total payment value, not per installment
        description: `Compra: ${regularPlan.name}`,
        successUrl,
        cancelUrl,
        installments,
        billingType,
        paymentType,
        dueDate,
        externalReference,
        postalService: false
      });
      
      // Create or update local subscription record
      const subscriptionData = {
        user_id: user.id,
        plan_id: planId,
        status: "pending",
        asaas_customer_id: customerId,
        asaas_payment_link: paymentLink,
        payment_id: paymentId,
        external_reference: externalReference,
        payment_status: "PENDING",
        installments
      };
      
      // Check if a record already exists to update
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("plan_id", planId)
        .maybeSingle();
      
      let subscriptionResult;
      
      if (existingSubscription) {
        // Update existing record
        const { data, error } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("id", existingSubscription.id)
          .select()
          .single();
          
        if (error) throw error;
        subscriptionResult = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from("subscriptions")
          .insert(subscriptionData)
          .select()
          .single();
          
        if (error) throw error;
        subscriptionResult = data;
      }
      
      console.log("Subscription record created/updated:", subscriptionResult);
      
      // Important: Redirect directly to the payment link URL
      if (paymentLink) {
        // Save current state to localStorage before redirecting
        localStorage.setItem('checkoutPlanId', planId);
        localStorage.setItem('checkoutInstallments', String(installments));
        localStorage.setItem('checkoutTimestamp', String(Date.now()));
        localStorage.setItem('checkoutReference', externalReference);
        localStorage.setItem('checkoutPaymentType', paymentType);
        
        return {
          url: paymentLink,
          payment: paymentId,
          dbSubscription: subscriptionResult,
          directRedirect: true
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
      console.log("Buscando assinatura atual...");
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("Nenhum usuário autenticado encontrado");
        return null;
      }
      
      // Search for subscription directly in the local table
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao buscar assinatura:", error);
        return null;
      }
      
      // If no subscription is found, return null
      if (!data) {
        return null;
      }
      
      // Properly cast the payment_details from Json to PaymentDetails type
      const subscription: Subscription = {
        ...data,
        // Ensure payment_details is properly typed
        payment_details: data.payment_details as unknown as PaymentDetails
      };
      
      // Verify payment status if the subscription is pending
      if (subscription.status === "pending" && subscription.payment_id) {
        const payment = await paymentsService.getPayment(subscription.payment_id);
        
        // If the payment was approved but the subscription status is still pending, update
        if (payment && ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(payment.status)) {
          await this.updateSubscriptionStatus(subscription.id, "active");
          subscription.status = "active";
        } else if (payment && ["OVERDUE", "REFUNDED", "REFUND_REQUESTED", "CHARGEBACK_REQUESTED", 
                               "CHARGEBACK_DISPUTE", "AWAITING_CHARGEBACK_REVERSAL"].includes(payment.status)) {
          await this.updateSubscriptionStatus(subscription.id, "past_due");
          subscription.status = "past_due";
        }
      }
      
      return subscription;
    } catch (error) {
      console.error("Erro em getCurrentSubscription:", error);
      return null;
    }
  },

  async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<void> {
    try {
      console.log(`Atualizando status da assinatura ${subscriptionId} para: ${status}`);
      
      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          status: status, 
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Erro em updateSubscriptionStatus:", error);
      throw error;
    }
  },

  async cancelSubscription(subscriptionId: string) {
    try {
      console.log(`Tentando cancelar assinatura: ${subscriptionId}`);
      
      // First, get the subscription to verify the Asaas subscription ID
      const { data: subscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", subscriptionId)
        .single();
      
      if (fetchError) {
        console.error("Erro ao buscar assinatura:", fetchError);
        return { 
          success: false, 
          message: "Não foi possível encontrar a assinatura"
        };
      }
      
      if (!subscription) {
        return { 
          success: false, 
          message: "Assinatura não encontrada" 
        };
      }
      
      // If there's an Asaas subscription ID, cancel it in Asaas
      if (subscription.asaas_subscription_id) {
        const response = await supabase.functions.invoke("asaas", {
          body: {
            action: "cancel-subscription",
            data: {
              subscriptionId: subscription.asaas_subscription_id,
            },
          },
        });
  
        if (response.error) {
          console.error("Erro ao cancelar assinatura no Asaas:", response.error);
          return { 
            success: false, 
            message: `Erro ao cancelar assinatura: ${response.error.message}`
          };
        }
      }
  
      // Update the local subscription status, regardless of whether there's an ID in Asaas
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          status: "canceled", 
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);
      
      if (updateError) {
        console.error("Erro ao atualizar status da assinatura:", updateError);
        return { 
          success: false, 
          message: `Erro ao atualizar status: ${updateError.message}`
        };
      }
  
      return { success: true, message: "Assinatura cancelada com sucesso" };
    } catch (error: any) {
      console.error("Erro em cancelSubscription:", error);
      return { 
        success: false, 
        message: error.message || "Ocorreu um erro ao cancelar a assinatura"
      };
    }
  },

  async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();
      const isActive = subscription !== null && ["active", "ACTIVE", "trialing"].includes(subscription.status);
      console.log(`Verificação de assinatura ativa: ${isActive}`, subscription);
      return isActive;
    } catch (error) {
      console.error("Erro ao verificar status da assinatura:", error);
      return false;
    }
  },

  getPlanFromId(planId: string): any {
    return plansService.getPlanById(planId);
  },

  async getPayments() {
    return paymentsService.getPayments();
  },

  async getPayment(paymentId: string) {
    return paymentsService.getPayment(paymentId);
  },

  async updateContractAcceptance(accepted: boolean) {
    try {
      console.log(`Atualizando aceitação do contrato: ${accepted}`);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Nenhum usuário autenticado encontrado");
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
      console.error("Erro em updateContractAcceptance:", error);
      return { success: false, error: error.message };
    }
  },

  async requestReceipt(paymentId: string) {
    return paymentsService.requestReceipt(paymentId);
  }
};
