
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubscriptionPlans from "./SubscriptionPlans";
import { useToast } from "@/hooks/use-toast";
import { redirectToPayment, PaymentType } from "@/services/marPaymentLinks";

const SubscriptionController: React.FC = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para verificar se um plano é o atual (não implementado neste exemplo)
  const isPlanCurrent = (planId: string): boolean => {
    // Implementação de verificação de plano atual seria aqui
    return false;
  };

  // Função para iniciar o processo de assinatura
  const handleSubscribe = async (planId: string): Promise<void> => {
    try {
      setIsCheckingOut(true);

      // Determinar o tipo de pagamento com base no número de parcelas
      const paymentType: PaymentType = selectedInstallments === 1 ? 'cash' : 'installments';
      
      // Log para debug
      console.log(`Iniciando assinatura do plano ${planId} com pagamento ${paymentType}`);
      
      // Redirecionar para o link de pagamento correspondente
      redirectToPayment(planId, paymentType);
      
      // Note que após o redirecionamento, o código abaixo pode não ser executado
      setIsCheckingOut(false);
      
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      setIsCheckingOut(false);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com a mudança no número de parcelas
  const handleInstallmentsChange = (installments: number) => {
    setSelectedInstallments(installments);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Escolha seu Plano</h1>
      <p className="text-muted-foreground text-center mb-8">
        Selecione o plano mais adequado para sua empresa
      </p>
      
      <SubscriptionPlans
        isCheckingOut={isCheckingOut}
        isPlanCurrent={isPlanCurrent}
        onSubscribe={handleSubscribe}
        selectedInstallments={selectedInstallments}
        onInstallmentsChange={handleInstallmentsChange}
      />
    </div>
  );
};

export default SubscriptionController;
