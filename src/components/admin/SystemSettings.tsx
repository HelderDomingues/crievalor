
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Eye, EyeOff, KeyRound, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getSystemSetting, upsertSystemSetting } from '@/services/systemSettingsService';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SystemSettings = () => {
  const [asaasApiKey, setAsaasApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidApiKey, setIsValidApiKey] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const apiKey = await getSystemSetting('ASAAS_API_KEY');
        setAsaasApiKey(apiKey || '');
        validateApiKeyFormat(apiKey || '');
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Erro ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, []);
  
  const validateApiKeyFormat = (key: string) => {
    // Basic format validation for Asaas API keys
    if (!key) {
      setIsValidApiKey(null);
      setValidationMessage('');
      return;
    }
    
    // Check for expected format
    // Sandbox: $aact_hmlg_{64 characters}
    // Production: $aact_prd_{64 characters}
    const pattern = /^\$aac[a-z]_[a-z]{3,5}_[A-Za-z0-9+/=]{20,}$/;
    const isValid = pattern.test(key);
    
    setIsValidApiKey(isValid);
    
    if (isValid) {
      // Check environment (sandbox or production)
      if (key.includes('_hmlg_')) {
        setValidationMessage('Chave válida (Ambiente de Sandbox/Teste)');
      } else if (key.includes('_prd_')) {
        setValidationMessage('Chave válida (Ambiente de Produção)');
      } else {
        setValidationMessage('Chave válida (Ambiente desconhecido)');
      }
    } else {
      setValidationMessage('Formato de chave inválido');
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Validate the API key before saving
      if (asaasApiKey && !isValidApiKey) {
        toast.error('Chave API do Asaas em formato inválido. Verifique e tente novamente.');
        return;
      }
      
      const success = await upsertSystemSetting(
        'ASAAS_API_KEY',
        asaasApiKey,
        'API Key do Asaas para integração de pagamentos'
      );
      
      if (success) {
        toast.success('Configurações salvas com sucesso');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleShowApiKey = () => setShowApiKey(!showApiKey);
  
  const getMaskedApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 10) return '••••••';
    
    return key.substring(0, 5) + '••••••••••••••••••••••' + key.substring(key.length - 5);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as configurações globais do sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Carregando configurações...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="asaas-api-key" className="text-sm font-medium flex items-center">
                <KeyRound className="h-4 w-4 mr-1" />
                API Key do Asaas
              </label>
              
              <div className="flex relative">
                <Input
                  id="asaas-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={asaasApiKey}
                  onChange={(e) => {
                    setAsaasApiKey(e.target.value);
                    validateApiKeyFormat(e.target.value);
                  }}
                  placeholder="$aact_hmlg_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowApiKey}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {isValidApiKey !== null && (
                <div className="mt-1 text-sm">
                  {isValidApiKey ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {validationMessage}
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {validationMessage}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                Chave de API do Asaas utilizada para integrações de pagamento. 
                Formato: $aact_hmlg_... (sandbox) ou $aact_prd_... (produção)
              </p>
            </div>
            
            <Alert className="bg-blue-50">
              <AlertDescription className="text-sm text-blue-700">
                <p><strong>Ambientes do Asaas:</strong></p>
                <p className="mt-1">• <strong>Sandbox:</strong> Para testes, chaves começando com $aact_hmlg_</p>
                <p>• <strong>Produção:</strong> Para pagamentos reais, chaves começando com $aact_prd_</p>
                <p className="mt-1">A chave pode ser obtida no painel do Asaas em Configurações &gt; Integrações.</p>
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading || isSaving}
          className="ml-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
