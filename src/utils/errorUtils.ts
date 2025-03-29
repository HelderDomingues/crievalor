
/**
 * Utility to help with error handling, logging, and user-friendly messages
 */

// Interface for structured error logging
export interface ErrorLogData {
  message: string;
  code?: string;
  originalError?: any;
  context?: Record<string, any>;
  timestamp: number;
  processId?: string;
}

// Track the last few errors for debugging
const errorHistory: ErrorLogData[] = [];
const MAX_ERROR_HISTORY = 10;

export const errorUtils = {
  /**
   * Log an error with structured data
   */
  logError(error: any, context: Record<string, any> = {}, processId?: string): ErrorLogData {
    const errorData: ErrorLogData = {
      message: error?.message || String(error),
      code: error?.code,
      originalError: error,
      context,
      timestamp: Date.now(),
      processId
    };
    
    // Add to error history
    errorHistory.unshift(errorData);
    if (errorHistory.length > MAX_ERROR_HISTORY) {
      errorHistory.pop();
    }
    
    // Log to console
    console.error(
      `[ERROR${processId ? ' ' + processId : ''}]`, 
      errorData.message, 
      {
        code: errorData.code,
        context: errorData.context,
        error
      }
    );
    
    return errorData;
  },
  
  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: any): string {
    const errorMessage = error?.message || String(error);
    
    // Common error mappings
    const errorMappings: Record<string, string> = {
      "NetworkError": "Erro de conexão com o servidor. Verifique sua conexão com a internet.",
      "AbortError": "A operação foi cancelada. Por favor, tente novamente.",
      "TypeError": "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
      "SyntaxError": "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
    };
    
    // Payment specific errors
    if (errorMessage.includes("Nenhum link de checkout foi retornado")) {
      return "Não foi possível gerar o link de pagamento. Por favor, tente novamente em alguns instantes.";
    }
    
    if (errorMessage.includes("Edge Function")) {
      return "Ocorreu um erro de comunicação com o servidor. Por favor, tente novamente em alguns instantes.";
    }
    
    if (errorMessage.includes("CPF ou CNPJ")) {
      return "CPF ou CNPJ é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    
    if (errorMessage.includes("Nome completo")) {
      return "Nome completo é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    
    if (errorMessage.includes("Telefone")) {
      return "Telefone é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    
    if (errorMessage.includes("No payments were created") || errorMessage.includes("Nenhum pagamento foi criado")) {
      return "Não foi possível criar o parcelamento do pagamento. Por favor, tente novamente ou escolha outro método de pagamento.";
    }
    
    // Check if we have a specific mapping for this error
    for (const [errorType, message] of Object.entries(errorMappings)) {
      if (errorMessage.includes(errorType)) {
        return message;
      }
    }
    
    // Default message
    return "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";
  },
  
  /**
   * Get error history
   */
  getErrorHistory(): ErrorLogData[] {
    return [...errorHistory];
  },
  
  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    errorHistory.length = 0;
  }
};
