
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, ExternalLink, RotateCw, ShieldCheck, AlertTriangle, InfoIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { webhookService } from '@/services/webhookService';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export const WebhookManager = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const { toast: uiToast } = useToast(); // Use Shadcn toast for more consistent UI
  const [webhookUrl, setWebhookUrl] = useState(webhookService.getPreferredWebhookUrl());
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'active' | 'unknown'>('unknown');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [fullError, setFullError] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  
  const handleTestWebhook = async () => {
    try {
      setIsTestLoading(true);
      setErrorDetails(null);
      setFullError(null);
      setTestResults(null);
      
      // Check if user is authenticated and admin
      if (!user) {
        toast.error("Você precisa estar logado para testar o webhook");
        uiToast({
          variant: "destructive",
          title: "Autenticação necessária",
          description: "Você precisa estar logado para testar o webhook"
        });
        setErrorDetails("Usuário não autenticado. Faça login antes de testar o webhook.");
        return;
      }
      
      if (!isAdmin) {
        toast.error("Você precisa ser administrador para testar o webhook");
        uiToast({
          variant: "destructive",
          title: "Permissão negada",
          description: "Você precisa ter privilégios de administrador para testar o webhook"
        });
        setErrorDetails("Usuário não possui permissões de administrador.");
        return;
      }
      
      console.log("Iniciando teste de webhook com usuário:", user.id);
      const result = await webhookService.testWebhook();
      
      console.log("Resultado do teste de webhook:", result);
      
      if (result.success) {
        toast.success("Teste de webhook concluído", {
          description: "Conexão verificada com o endpoint do Supabase"
        });
        
        uiToast({
          variant: "default",
          title: "Teste de webhook concluído",
          description: "Conexão verificada com o endpoint do Supabase"
        });
        
        setTestResults(result.testResults);
        
        if (result.testResults?.webhookEndpoint?.success) {
          setWebhookStatus('active');
          toast.success("Webhook respondendo corretamente", {
            description: "O webhook está configurado e respondendo adequadamente"
          });
          
          uiToast({
            variant: "default",
            title: "Webhook respondendo corretamente",
            description: "O webhook está configurado e respondendo adequadamente"
          });
        } else {
          setErrorDetails("Webhook disponível, mas com resposta inesperada");
          toast.warning("Webhook com resposta inesperada", {
            description: "Verifique a configuração do webhook no painel do Asaas"
          });
          
          uiToast({
            // Changed from "warning" to "default" as shadcn/ui toast only supports "default" or "destructive"
            variant: "default",
            title: "Webhook com resposta inesperada",
            description: "Verifique a configuração do webhook no painel do Asaas"
          });
        }
      } else {
        setErrorDetails(result.error || "Erro ao verificar a conexão com o Asaas");
        setFullError(result.details || null);
        
        toast.error("Falha ao testar webhook", {
          description: result.error || "Erro ao verificar a conexão com o Asaas"
        });
        
        uiToast({
          variant: "destructive",
          title: "Falha ao testar webhook",
          description: result.error || "Erro ao verificar a conexão com o Asaas"
        });
      }
      
    } catch (error: any) {
      console.error("Erro ao testar webhook:", error);
      setErrorDetails(error.message || "Erro desconhecido");
      toast.error("Erro ao testar webhook", {
        description: error.message
      });
      
      uiToast({
        variant: "destructive",
        title: "Erro ao testar webhook",
        description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
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
            URL do Webhook (Supabase)
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="webhook-url"
              value={webhookUrl}
              readOnly
              className="flex-1"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <AlertCircle className="inline-block w-4 h-4 mr-1" />
            Este webhook deve estar configurado no painel do Asaas
          </p>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-700">Informação importante sobre autenticação</AlertTitle>
          <AlertDescription className="text-sm text-amber-700">
            <p>O Asaas <strong>Sandbox</strong> envia requisições com um User-Agent "Java", e <strong>não requer</strong> o header <strong>access_token</strong> neste ambiente.</p>
            <p className="mt-1">Para o ambiente de teste, o webhook foi configurado para aceitar requisições do Asaas Sandbox mesmo sem o token.</p>
            <p className="mt-1">Para o ambiente de produção, será necessário configurar o <strong>access_token</strong> contendo a chave de API do Asaas.</p>
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Configuração do Webhook</AlertTitle>
          <AlertDescription className="text-sm text-blue-700">
            <p>Certifique-se de que você configurou o webhook no painel do Asaas apontando para a URL acima.</p>
            <p className="mt-1">A API do Asaas usada é: <strong>Sandbox</strong> (ambiente de teste)</p>
            <div className="mt-2 flex flex-col space-y-1">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                <span>URL do webhook: <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">{webhookUrl}</code></span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                <span>Método HTTP: <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">POST</code></span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                <span>Header: <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">access_token</code> contendo a Chave de API do Asaas (opcional no ambiente Sandbox)</span>
              </div>
            </div>
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
        
        {testResults && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resultados do teste</h3>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-md ${testResults.webhookEndpoint?.success ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <h4 className="font-medium flex items-center gap-2">
                  {testResults.webhookEndpoint?.success ? (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  Endpoint do Webhook
                </h4>
                <p className="text-sm mt-1">
                  Status: {testResults.webhookEndpoint?.status} 
                  ({testResults.webhookEndpoint?.success ? 'Sucesso' : 'Falha'})
                </p>
                {testResults.webhookEndpoint?.error && (
                  <p className="text-sm text-red-600 mt-1">{testResults.webhookEndpoint.error}</p>
                )}
              </div>
              
              <div className={`p-3 rounded-md ${testResults.asaasAccount?.success ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <h4 className="font-medium flex items-center gap-2">
                  {testResults.asaasAccount?.success ? (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  Conta Asaas
                </h4>
                <p className="text-sm mt-1">
                  Status: {testResults.asaasAccount?.status}
                  ({testResults.asaasAccount?.success ? 'Válida' : 'Inválida'})
                </p>
                {testResults.asaasAccount?.error && (
                  <p className="text-sm text-red-600 mt-1">{testResults.asaasAccount.error}</p>
                )}
              </div>
            </div>
          </div>
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
                <li>O webhook está registrado no painel do Asaas com a URL do Supabase</li>
                <li>A configuração no Asaas está correta (URL e método POST)</li>
                <li>No ambiente de produção, a API key do Asaas deve ser configurada como header <strong>access_token</strong></li>
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
              <h3 className="text-sm font-medium text-blue-800">Webhook configuração manual</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>O webhook precisa ser configurado manualmente no painel do Asaas. Você pode testar a conexão para verificar se está funcionando corretamente.</p>
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
