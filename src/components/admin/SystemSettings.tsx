
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export const SystemSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [asaasApiKey, setAsaasApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'ASAAS_API_KEY')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setAsaasApiKey(data.value);
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'ASAAS_API_KEY',
          value: asaasApiKey,
          description: 'API Key do Asaas para integração de pagamentos'
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando configurações...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as configurações e chaves de API do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="asaas-api-key">API Key do Asaas</Label>
          <Input
            id="asaas-api-key"
            type="password"
            value={asaasApiKey}
            onChange={(e) => setAsaasApiKey(e.target.value)}
            placeholder="Insira sua API Key do Asaas"
          />
          <p className="text-sm text-muted-foreground">
            Chave de API para integração com o Asaas (formato: $aact_...)
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
