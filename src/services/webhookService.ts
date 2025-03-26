
import { supabase } from "@/integrations/supabase/client";

export const webhookService = {
  /**
   * Registra um webhook no Asaas para receber notificações de pagamentos
   * @param webhookUrl URL completa do endpoint que receberá as notificações
   * @returns 
   */
  async registerWebhook(webhookUrl: string) {
    try {
      console.log(`Registrando webhook: ${webhookUrl}`);
      
      const response = await supabase.functions.invoke("register-webhook", {
        body: {
          webhookUrl
        },
      });
      
      if (response.error) {
        console.error("Erro ao registrar webhook:", response.error);
        throw new Error(`Erro ao registrar webhook: ${response.error.message}`);
      }
      
      console.log("Webhook registrado com sucesso:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro em registerWebhook:", error);
      throw error;
    }
  },
  
  /**
   * Retorna a URL do webhook ideal com base no ambiente atual
   */
  getRecommendedWebhookUrl() {
    // Em produção, usar a URL da Edge Function
    if (window.location.hostname === 'crievalor.com.br' || 
        window.location.hostname === 'www.crievalor.com.br') {
      return 'https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook';
    }
    
    // Para ambientes de desenvolvimento/preview
    if (window.location.hostname.includes('lovable.app')) {
      return 'https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook';
    }
    
    // Para desenvolvimento local, recomendamos usar ngrok ou similar
    return 'https://nmxfknwkhnengqqjtwru.supabase.co/functions/v1/asaas-webhook';
  }
};
