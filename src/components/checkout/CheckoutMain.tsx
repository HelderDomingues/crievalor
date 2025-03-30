
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import PlanSummary from "./PlanSummary";
import ProcessingPayment from "./ProcessingPayment";
import { errorUtils } from "@/utils/errorUtils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollIndicator from "@/components/ScrollIndicator";

// Step types for the checkout process
type CheckoutStep = "plan" | "payment" | "registration" | "processing";

// Updated PaymentType to include credit_cash
type CheckoutPaymentType = PaymentType | "credit_cash";

interface CheckoutMainProps {
  currentStep: CheckoutStep;
  selectedPlanId: string | null;
  selectedInstallments: number;
  selectedPaymentType: CheckoutPaymentType;
  error: string | null;
  processId: string;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  onPaymentTypeChange: (type: CheckoutPaymentType) => void;
  onInstallmentsChange: (installments: number) => void;
  proceedToPayment: () => Promise<void>;
}

const CheckoutMain: React.FC<CheckoutMainProps> = ({
  currentStep,
  selectedPlanId,
  selectedInstallments,
  selectedPaymentType,
  error,
  processId,
  goToNextStep,
  goToPreviousStep,
  onPaymentTypeChange,
  onInstallmentsChange,
  proceedToPayment
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  // Garantir que a página carregue pelo topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Esconder o indicador de rolagem após um tempo ou quando o usuário rolar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    const timeout = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 8000);

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);
  
  if (!selectedPlanId) {
    toast({
      title: "Plano não selecionado",
      description: "Por favor, escolha um plano para continuar.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }
  
  // Obter detalhes do plano
  const plan = subscriptionService.getPlanFromId(selectedPlanId);

  // If the current step is "payment", we should immediately redirect back to "plan"
  // This is a side effect, so we handle it here
  if (currentStep === "payment") {
    // We need to use setTimeout to avoid modifying state during render
    setTimeout(() => goToPreviousStep(), 0);
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Redirecionando...</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 mb-12 grid grid-cols-1 gap-8">
      <div className="max-w-4xl mx-auto w-full">
        {currentStep === "plan" && (
          <div className="space-y-8">
            {/* Único componente PlanSummary que inclui a seleção de pagamento e o formulário de contato */}
            <PlanSummary 
              planId={selectedPlanId} 
              onContinue={goToNextStep}
              onPaymentTypeChange={onPaymentTypeChange}
              selectedPaymentType={selectedPaymentType} 
            />
            
            {/* Mostrar o indicador de rolagem apenas quando necessário */}
            {showScrollIndicator && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <ScrollIndicator />
              </div>
            )}
          </div>
        )}
        
        {currentStep === "processing" && (
          <ProcessingPayment 
            error={error} 
            onRetry={() => proceedToPayment()} 
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutMain;
