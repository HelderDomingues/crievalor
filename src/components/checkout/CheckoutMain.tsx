
import React from "react";
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
    <div className="mt-8 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 order-2 lg:order-1">
        {currentStep === "plan" && (
          <PlanSummary 
            planId={selectedPlanId} 
            onContinue={goToNextStep} 
          />
        )}
        
        {currentStep === "payment" && (
          <PaymentSelection
            onPaymentTypeChange={onPaymentTypeChange}
            onInstallmentsChange={onInstallmentsChange}
            selectedPaymentType={selectedPaymentType}
            selectedInstallments={selectedInstallments}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
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
      
      {currentStep !== "plan" && (
        <div className="lg:col-span-1 order-1 lg:order-2">
          {selectedPlanId && (
            <div className="bg-card border rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Resumo do pedido</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium">
                    {subscriptionService.getPlanFromId(selectedPlanId)?.name || "Plano selecionado"}
                  </span>
                </div>
                
                {selectedPaymentType === "credit" && selectedInstallments > 1 ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagamento</span>
                    <span className="font-medium">
                      {selectedInstallments}x no cartão
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagamento</span>
                    <span className="font-medium">
                      {selectedPaymentType === "credit" ? "Cartão de crédito" : 
                      selectedPaymentType === "pix" ? "PIX" : "Boleto bancário"}
                    </span>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      {(() => {
                        const plan = subscriptionService.getPlanFromId(selectedPlanId);
                        if (!plan || !('price' in plan)) return "Sob consulta";
                        
                        const totalPrice = selectedInstallments === 1 ? plan.cashPrice : plan.totalPrice;
                        
                        if (selectedInstallments > 1) {
                          const installmentValue = totalPrice / selectedInstallments;
                          return `${selectedInstallments}x de R$ ${installmentValue.toFixed(2).replace('.', ',')}`;
                        } else {
                          return `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutMain;
