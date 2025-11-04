
import { supabase } from "@/integrations/supabase/client";
import { Subscription, CreateCheckoutOptions, PaymentDetails, Plan, RegularPlan, CustomPricePlan } from "@/types/subscription";
import { plansService } from "./plansService";

export { PLANS } from "./plansService";

// Re-export types for easier importing by components
export type { Subscription, CreateCheckoutOptions, Plan, RegularPlan, CustomPricePlan, PaymentDetails };
export type { PaymentType } from "./marPaymentLinks";

export const subscriptionService = {
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
        payment_details: data.payment_details as unknown as PaymentDetails
      };
      
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
      
      // Update the local subscription status
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

  async getPayments() {
    console.log("getPayments: Funcionalidade não disponível (API Asaas removida)");
    return [];
  },

  async requestReceipt(paymentId: string) {
    console.log("requestReceipt: Funcionalidade não disponível (API Asaas removida)");
    return { 
      success: false, 
      message: "Funcionalidade de recibos não disponível nesta versão",
      error: "Funcionalidade não disponível"
    };
  }
};
