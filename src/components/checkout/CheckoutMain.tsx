
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import PlanSummary from "./PlanSummary";
import PaymentSelection from "./PaymentSelection";
import UserRegistration from "./UserRegistration";
import ProcessingPayment from "./ProcessingPayment";
import { errorUtils } from "@/utils/errorUtils";

// Step types for the checkout process
type CheckoutStep = "plan" | "payment" | "registration" | "processing";

interface CheckoutMainProps {
  currentStep: CheckoutStep;
  selectedPlanId: string | null;
  selectedInstallments: number;
  selectedPaymentType: PaymentType;
  error: string | null;
  processId: string;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  onPaymentTypeChange: (type: PaymentType) => void;
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
  
  // Efeito para garantir que a página carregue pelo topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  
  if (!selectedPlanId) {
    toast({
      title: "Plano não selecionado",
      description: "Por favor, escolha um plano para continuar.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }
  
  return (
    <div className="mt-8 mb-12 grid grid-cols-1 gap-8">
      <div>
        {currentStep === "plan" && (
          <PlanSummary 
            planId={selectedPlanId} 
            onContinue={goToNextStep} 
          />
        )}
        
        {currentStep === "payment" && (
          <PaymentSelection
            onBack={goToPreviousStep}
            selectedPaymentType={selectedPaymentType}
            onPaymentTypeChange={onPaymentTypeChange}
            onContinue={goToNextStep}
          />
        )}
        
        {currentStep === "registration" && (
          <UserRegistration 
            onContinue={goToNextStep} 
            onBack={goToPreviousStep}
          />
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
