
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { checkoutTestUtils } from "@/utils/checkoutTestUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANS } from "@/services/plansService";
import { X } from "lucide-react";

interface CheckoutDebugPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const CheckoutDebugPanel: React.FC<CheckoutDebugPanelProps> = ({
  isVisible = false,
  onClose
}) => {
  const [scenario, setScenario] = useState<'new-user' | 'existing-user' | 'recovery' | 'abandoned' | 'clear'>('new-user');
  const [planId, setPlanId] = useState('pro_plan');
  const [consoleOutput, setConsoleOutput] = useState<string>('');

  if (!isVisible) return null;

  const handleScenarioChange = (value: string) => {
    setScenario(value as any);
  };

  const handleSetupScenario = () => {
    try {
      checkoutTestUtils.simulateCheckoutState(scenario, { planId });
      setConsoleOutput(`Cenário "${scenario}" configurado com sucesso para o plano ${planId}`);
    } catch (error) {
      setConsoleOutput(`Erro ao configurar cenário: ${error}`);
    }
  };

  const handleVerifyData = () => {
    try {
      const result = checkoutTestUtils.verifyDataConsistency();
      setConsoleOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setConsoleOutput(`Erro ao verificar dados: ${error}`);
    }
  };

  const handleSimulateError = (errorType: 'payment-failed' | 'validation-error' | 'network-error' | 'server-error') => {
    try {
      const error = checkoutTestUtils.simulateError(errorType);
      setConsoleOutput(`Erro simulado: ${error.message}`);
    } catch (error) {
      setConsoleOutput(`Erro ao simular erro: ${error}`);
    }
  };

  // Obter as opções de plano dos planos definidos no sistema
  const planOptions = Object.values(PLANS).map(plan => ({
    id: plan.id,
    name: plan.name
  }));

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg border-red-300 opacity-80 hover:opacity-100 transition-opacity">
      <CardHeader className="bg-red-100 py-2 flex flex-row justify-between items-center">
        <CardTitle className="text-red-800 text-base">Painel de Testes de Checkout</CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-800 hover:bg-red-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <Tabs defaultValue="scenarios">
        <TabsList className="w-full">
          <TabsTrigger value="scenarios" className="flex-1">Cenários</TabsTrigger>
          <TabsTrigger value="verification" className="flex-1">Verificação</TabsTrigger>
          <TabsTrigger value="errors" className="flex-1">Erros</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios">
          <CardContent className="py-3 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="scenario">Cenário</Label>
              <Select value={scenario} onValueChange={handleScenarioChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cenário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-user">Novo usuário</SelectItem>
                  <SelectItem value="existing-user">Usuário existente</SelectItem>
                  <SelectItem value="recovery">Recuperação</SelectItem>
                  <SelectItem value="abandoned">Abandonado</SelectItem>
                  <SelectItem value="clear">Limpar dados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="planId">Plano</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Button onClick={handleSetupScenario} variant="outline" className="w-full">
              Configurar Cenário
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="verification">
          <CardContent className="py-3">
            <Button onClick={handleVerifyData} variant="outline" className="w-full">
              Verificar Dados
            </Button>

            {consoleOutput && (
              <div className="mt-3">
                <Label>Resultado:</Label>
                <pre className="bg-black text-green-400 p-2 rounded text-xs mt-1 overflow-auto max-h-32">
                  {consoleOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="errors">
          <CardContent className="py-3 space-y-3">
            <Button
              onClick={() => handleSimulateError('payment-failed')}
              variant="outline"
              className="w-full"
            >
              Simular Falha no Pagamento
            </Button>

            <Button
              onClick={() => handleSimulateError('validation-error')}
              variant="outline"
              className="w-full"
            >
              Simular Erro de Validação
            </Button>

            <Button
              onClick={() => handleSimulateError('network-error')}
              variant="outline"
              className="w-full"
            >
              Simular Erro de Conexão
            </Button>

            <Button
              onClick={() => handleSimulateError('server-error')}
              variant="outline"
              className="w-full"
            >
              Simular Erro de Servidor
            </Button>

            {consoleOutput && (
              <div className="mt-3">
                <Label>Resultado:</Label>
                <pre className="bg-black text-red-400 p-2 rounded text-xs mt-1 overflow-auto max-h-32">
                  {consoleOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CheckoutDebugPanel;
