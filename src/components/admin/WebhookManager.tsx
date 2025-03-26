
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Loader2, ExternalLink, RotateCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { webhookService } from '@/services/webhookService';
import { Badge } from "@/components/ui/badge";

export const WebhookManager = () => {
  const [webhookUrl, setWebhookUrl] = useState(webhookService.getRecommendedWebhookUrl());
  const [webhookToken, setWebhookToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'active' | 'unknown'>('unknown');
  
  useEffect(() => {
    // Extract token from webhook URL if present
    const url = new URL(webhookUrl);
    const token = url.searchParams.get('token');
    if (token) {
      setWebhookToken(token);
    }
  }, [webhookUrl]);
  
  const handleTestWebhook = async () => {
    try {
      setIsTestLoading(true);
      
      if (!webhookUrl.trim()) {
        toast.error("URL do webhook é obrigatória");
        return;
      }
      
      const result = await webhookService.testWebhook();
      
      if (result.success) {
        toast.success("Webhook funcionando corretamente!", {
          description: "A conexão com o Asaas foi estabelecida e o webhook está configurado."
        });
        setWebhookStatus('active');
      } else {
        toast.error("Falha ao testar webhook", {
          description: result.error || "Erro ao verificar a conexão com o Asaas"
        });
      }
      
    } catch (error: any) {
      console.error("Erro ao testar webhook:", error);
      toast.error("Erro ao testar webhook", {
        description: error.message
      });
    } finally {
      setIsTestLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Configuração de Webhook do Asaas</CardTitle>
            <CardDescription>
              Gerenciamento do webhook para receber notificações de pagamentos
            </CardDescription>
          </div>
          {webhookStatus === 'active' && (
            <Badge variant="success" className="bg-green-500 text-white flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Ativo
            </Badge>
          )}
        </div>
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
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="inline-block w-4 h-4 mr-1" />
            Este webhook já está configurado manualmente no painel do Asaas
          </p>
        </div>
        
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExternalLink className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Webhook configurado manualmente</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>O webhook foi configurado manualmente no painel do Asaas. Você pode testar a conexão para verificar se está funcionando corretamente.</p>
              </div>
              
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => window.open('https://sandbox.asaas.com/customerConfigIntegrations/webhooks', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Acessar Webhooks no Asaas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 items-stretch sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
        <Button
          variant="outline"
          onClick={handleTestWebhook}
          disabled={isTestLoading}
          className="flex-1"
        >
          {isTestLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              <RotateCw className="mr-2 h-4 w-4" />
              Testar Webhook
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
