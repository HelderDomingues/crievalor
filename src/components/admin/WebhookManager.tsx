
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { webhookService } from '@/services/webhookService';

export const WebhookManager = () => {
  const [webhookUrl, setWebhookUrl] = useState(webhookService.getRecommendedWebhookUrl());
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegisterWebhook = async () => {
    try {
      setIsLoading(true);
      
      if (!webhookUrl.trim()) {
        toast.error("URL do webhook é obrigatória");
        return;
      }
      
      const result = await webhookService.registerWebhook(webhookUrl);
      
      toast.success("Webhook registrado com sucesso!", {
        description: "O Asaas agora notificará sua aplicação sobre eventos de pagamento."
      });
      
      console.log("Resultado do registro:", result);
    } catch (error: any) {
      console.error("Erro ao registrar webhook:", error);
      toast.error("Erro ao registrar webhook", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Configuração de Webhook do Asaas</CardTitle>
        <CardDescription>
          Configure o webhook para receber notificações de pagamentos em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="webhook-url" className="text-sm font-medium">
            URL do Webhook
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://sua-url-de-webhook.com/asaas-webhook"
              className="flex-1"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="inline-block w-4 h-4 mr-1" />
            Esta URL deve ser acessível publicamente pelo Asaas
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRegisterWebhook} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Registrar Webhook
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
