
import { supabase } from "@/integrations/supabase/client";

export const webhookService = {
  /**
   * Testa a conexão com o webhook registrado no Asaas
   */
  async testWebhook() {
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
      
      const response = await supabase.functions.invoke("test-webhook", {
        body: { timestamp },
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
        options: response.data.options
      };
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
  getSupabaseWebhookUrl() {
    return 'https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook';
  },
  
  /**
   * Determina qual URL de webhook deve ser usada
   */
  getPreferredWebhookUrl() {
    return this.getSupabaseWebhookUrl();
  }
};
