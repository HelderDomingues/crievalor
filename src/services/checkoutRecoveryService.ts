
import { RegistrationFormData } from "@/components/checkout/form/RegistrationFormSchema";

interface RecoveryState {
  timestamp: number;
  planId: string;
  installments?: number;
  paymentType?: string;
  processId: string;
  paymentLink?: string;
  paymentId?: string;
  subscriptionId?: string;
  formData?: RegistrationFormData;
}

export const checkoutRecoveryService = {
  saveRecoveryState(state: Partial<RecoveryState>) {
    try {
      // Get existing state first
      const existingState = this.getRecoveryState() || {};
      
      // Merge with new state
      const newState = {
        ...existingState,
        ...state,
        timestamp: state.timestamp || Date.now()
      };
      
      localStorage.setItem('checkoutRecoveryState', JSON.stringify(newState));
      console.log("Saved recovery state:", newState);
      return true;
    } catch (error) {
      console.error("Failed to save recovery state:", error);
      return false;
    }
  },
  
  getRecoveryState(): RecoveryState | null {
    try {
      const stateJson = localStorage.getItem('checkoutRecoveryState');
      if (!stateJson) return null;
      
      return JSON.parse(stateJson);
    } catch (error) {
      console.error("Failed to parse recovery state:", error);
      return null;
    }
  },
  
  clearRecoveryState() {
    localStorage.removeItem('checkoutRecoveryState');
  },
  
  isStateValid(state: RecoveryState | null, currentPlanId: string): boolean {
    if (!state) return false;
    
    // Check if the state is for the current plan
    if (state.planId !== currentPlanId) return false;
    
    // Check if the state is recent (within 30 minutes)
    const isRecent = Date.now() - state.timestamp < 30 * 60 * 1000;
    if (!isRecent) return false;
    
    return true;
  },
  
  mapErrorToUserFriendlyMessage(error: any): string {
    const errorMessage = error?.message || String(error);
    
    if (errorMessage.includes("Nenhum link de checkout foi retornado")) {
      return "Não foi possível gerar o link de pagamento. Por favor, tente novamente em alguns instantes.";
    } 
    
    if (errorMessage.includes("Edge Function")) {
      return "Ocorreu um erro de comunicação com o servidor. Por favor, tente novamente em alguns instantes.";
    }
    
    if (errorMessage.includes("CPF ou CNPJ é obrigatório")) {
      return "CPF ou CNPJ é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    
    if (errorMessage.includes("Nome completo é obrigatório")) {
      return "Nome completo é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    
    if (errorMessage.includes("Telefone é obrigatório")) {
      return "Telefone é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    
    if (errorMessage.includes("No payments were created") || errorMessage.includes("Nenhum pagamento foi criado")) {
      return "Não foi possível criar o parcelamento do pagamento. Por favor, tente novamente ou escolha outro método de pagamento.";
    }
    
    // If none of the known errors, return a generic message
    return "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente mais tarde.";
  }
};
