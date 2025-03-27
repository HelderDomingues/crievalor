
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Loader2, ExternalLink, RotateCw, ShieldCheck, AlertTriangle, InfoIcon, Shield } from "lucide-react";
import { toast } from "sonner";
import { webhookService } from '@/services/webhookService';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export const WebhookManager = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const [webhookUrl, setWebhookUrl] = useState(webhookService.getRecommendedWebhookUrl());
  const [webhookToken, setWebhookToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'active' | 'unknown'>('unknown');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [fullError, setFullError] = useState<any>(null);
  
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
      setErrorDetails(null);
      setFullError(null);
      
      if (!webhookUrl.trim()) {
        toast.error("URL do webhook é obrigatória");
        return;
      }
      
      // Check if user is authenticated and admin
      if (!user) {
        toast.error("Você precisa estar logado para testar o webhook");
        setErrorDetails("Usuário não autenticado. Faça login antes de testar o webhook.");
        return;
      }
      
      if (!isAdmin) {
        toast.error("Você precisa ser administrador para testar o webhook");
        setErrorDetails("Usuário não possui permissões de administrador.");
        return;
      }
      
      console.log("Iniciando teste de webhook com usuário:", user.id);
      const result = await webhookService.testWebhook();
      
      console.log("Resultado do teste de webhook:", result);
      
      if (result.success) {
        toast.success("Webhook funcionando corretamente!", {
          description: "A conexão com o Asaas foi estabelecida e o webhook está configurado."
        });
        setWebhookStatus('active');
      } else {
        setErrorDetails(result.error || "Erro ao verificar a conexão com o Asaas");
        setFullError(result.details || null);
        
        toast.error("Falha ao testar webhook", {
          description: result.error || "Erro ao verificar a conexão com o Asaas"
        });
      }
      
    } catch (error: any) {
      console.error("Erro ao testar webhook:", error);
      setErrorDetails(error.message || "Erro desconhecido");
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
              placeholder="https://crievalor.lovable.app/api/webhook/asaas"
              className="flex-1"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="inline-block w-4 h-4 mr-1" />
            Este webhook já está configurado manualmente no painel do Asaas
          </p>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Importante</AlertTitle>
          <AlertDescription className="text-blue-600">
            <p>Certifique-se de que você configurou o webhook no painel do Asaas apontando para a URL acima.</p>
            <p className="mt-1">A API do Asaas usada é: <strong>Sandbox</strong> (ambiente de teste)</p>
            <p className="mt-1">O domínio foi atualizado para: <strong>crievalor.lovable.app</strong></p>
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-700">Aviso de Cloudflare</AlertTitle>
          <AlertDescription className="text-amber-600">
            <p>Se o Asaas relatou erros de Cloudflare ao enviar webhooks para este endereço, não se preocupe. Fizemos atualizações para resolver esse problema.</p>
            <p className="mt-1">O webhook agora aceita requisições do user agent Java do Asaas e contorna as restrições de segurança do Cloudflare.</p>
          </AlertDescription>
        </Alert>
        
        {!user && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Autenticação necessária</AlertTitle>
            <AlertDescription>
              Você precisa estar logado como administrador para testar o webhook.
            </AlertDescription>
          </Alert>
        )}
        
        {user && !isAdmin && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Permissão negada</AlertTitle>
            <AlertDescription>
              Você precisa ter privilégios de administrador para testar o webhook.
            </AlertDescription>
          </Alert>
        )}
        
        {errorDetails && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">Erro ao testar webhook:</p>
              <p className="text-sm">{errorDetails}</p>
              
              {fullError && (
                <div className="mt-2 p-2 bg-red-950/10 rounded text-xs font-mono">
                  <pre className="whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(fullError, null, 2)}
                  </pre>
                </div>
              )}
              
              <p className="text-sm mt-2">
                Certifique-se de que:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Você está logado como administrador</li>
                <li>O Asaas está configurado corretamente</li>
                <li>A API key do Asaas é válida e está atualizada</li>
                <li>O webhook está registrado no painel do Asaas com o domínio <strong>crievalor.lovable.app</strong></li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
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
          disabled={isTestLoading || !user || !isAdmin}
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
