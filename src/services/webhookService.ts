import { supabase } from "@/integrations/supabase/client";

// Define the return types for better TypeScript support
type WebhookTestResult = {
  success: boolean;
  error?: string;
  details?: any;
  data?: any;
  testResults?: any;
  recommendations?: any;
  options?: any;
  jwtVerificationStatus?: string;
  solution?: string;
};

type CustomerTestResult = {
  success: boolean;
  error?: string;
  details?: any;
  data?: any;
};

export const webhookService = {
  /**
   * Testa a conexão com o webhook registrado no Asaas
   */
  async testWebhook(): Promise<WebhookTestResult> {
    try {
      console.log(`Testando conexão do webhook`);
      
      // Get the current session token to pass to the edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("Erro ao testar webhook: Usuário não autenticado");
        return { 
          success: false, 
          error: "Usuário não autenticado. Faça login novamente." 
        };
      }
      
      console.log("Auth token disponível, enviando para edge function");
      
      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime();
      
      try {
        // Add test flag to explicitly mark this as a test request
        const response = await supabase.functions.invoke("test-webhook", {
          body: { 
            timestamp,
            test: true,
            // Send additional debug information to help with troubleshooting
            userAgent: navigator.userAgent,
            screenSize: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        console.log("Resposta da edge function:", response);
        
        if (response.error) {
          console.error("Erro ao testar webhook:", response.error);
          return { 
            success: false, 
            error: `Erro ao testar webhook: ${response.error.message || 'Erro desconhecido'}` 
          };
        }
        
        if (response.data && response.data.error) {
          console.error("Erro retornado pela edge function:", response.data.error);
          return { 
            success: false, 
            error: response.data.error,
            details: response.data.details,
            testResults: response.data.testResults,
            solution: response.data.solution,
            options: response.data.options
          };
        }
        
        console.log("Teste de webhook bem-sucedido:", response.data);
        return { 
          success: true, 
          data: response.data,
          testResults: response.data.testResults,
          recommendations: response.data.recommendations,
          options: response.data.options,
          jwtVerificationStatus: response.data.jwtVerificationDisabled ? 'disabled' : 'enabled'
        };
      } catch (error: any) {
        console.error("Erro na comunicação com edge function:", error);
        return { 
          success: false, 
          error: `Erro na comunicação com a edge function: ${error.message || 'Erro de comunicação'}`,
          details: {
            message: error.message,
            stack: error.stack,
          }
        };
      }
    } catch (error: any) {
      console.error("Erro em testWebhook:", error);
      return { 
        success: false, 
        error: error.message || 'Erro desconhecido durante o teste do webhook' 
      };
    }
  },
  
  /**
   * Retorna a URL do webhook do Supabase
   */
  getSupabaseWebhookUrl(): string {
    return 'https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook';
  },
  
  /**
   * Determina qual URL de webhook deve ser usada
   */
  getPreferredWebhookUrl(): string {
    return this.getSupabaseWebhookUrl();
  },

  /**
   * Verifica o estado de verificação JWT do webhook
   */
  isJwtVerificationDisabled(): boolean {
    return true; // Always disabled for Asaas webhook since they don't support it
  },

  /**
   * Teste manual para recuperar um cliente específico e criar o usuário
   */
  async testCustomerCreation(customerId: string = "cus_000006606255"): Promise<CustomerTestResult> {
    try {
      console.log(`Testando recuperação e criação do cliente ${customerId}`);
      
      // Get the current session token to pass to the edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("Erro: Usuário não autenticado");
        return { 
          success: false, 
          error: "Usuário não autenticado. Faça login como administrador." 
        };
      }
      
      try {
        const response = await supabase.functions.invoke("asaas", {
          body: { 
            action: "test-webhook-customer",
            data: {
              customerId,
              timestamp: new Date().getTime()
            }
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        console.log("Resposta da edge function:", response);
        
        if (response.error) {
          console.error("Erro ao testar criação do cliente:", response.error);
          return { 
            success: false, 
            error: `Erro ao testar criação do cliente: ${response.error.message || 'Erro desconhecido'}` 
          };
        }
        
        if (response.data && response.data.error) {
          console.error("Erro retornado pela edge function:", response.data.error);
          return { 
            success: false, 
            error: response.data.error,
            details: response.data.details
          };
        }
        
        console.log("Teste de criação de cliente bem-sucedido:", response.data);
        return { 
          success: true, 
          data: response.data
        };
      } catch (error: any) {
        console.error("Erro na comunicação com edge function:", error);
        return { 
          success: false, 
          error: `Erro na comunicação com a edge function: ${error.message || 'Erro de comunicação'}`,
          details: {
            message: error.message,
            stack: error.stack,
          }
        };
      }
    } catch (error: any) {
      console.error("Erro em testCustomerCreation:", error);
      return { 
        success: false, 
        error: error.message || 'Erro desconhecido durante o teste de criação do cliente' 
      };
    }
  }
};
