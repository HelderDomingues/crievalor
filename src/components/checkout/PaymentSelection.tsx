
import React from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import PaymentOptions from "@/components/pricing/PaymentOptions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DirectAsaasPayment from "./DirectAsaasPayment";
import AlternativePaymentOptions from "./AlternativePaymentOptions";
import { subscriptionService } from "@/services/subscriptionService";
import { useLocation } from "react-router-dom";

interface PaymentSelectionProps {
  onPaymentTypeChange: (type: PaymentType) => void;
  onInstallmentsChange: (installments: number) => void;
  selectedPaymentType: PaymentType;
  selectedInstallments: number;
  onContinue: () => void;
  onBack: () => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  onPaymentTypeChange,
  onInstallmentsChange,
  selectedPaymentType,
  selectedInstallments,
  onContinue,
  onBack
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan") || "";
  
  const plan = subscriptionService.getPlanFromId(planId);
  const planName = plan?.name || "Plano";
  const planPrice = plan && 'price' in plan ? plan.totalPrice : 0;
  
  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Forma de pagamento</h2>
        <p className="text-muted-foreground mb-6">
          Escolha como deseja efetuar o pagamento da sua assinatura.
        </p>
        
        <PaymentOptions
          onPaymentTypeChange={onPaymentTypeChange}
          onInstallmentsChange={onInstallmentsChange}
          selectedPaymentType={selectedPaymentType}
          selectedInstallments={selectedInstallments}
        />
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Button onClick={onContinue}>
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* The contact information form for redirecting to Asaas */}
      <DirectAsaasPayment planName={planName} planPrice={planPrice} />
      
      <AlternativePaymentOptions planName={planName} planPrice={planPrice} />
    </div>
  );
};

export default PaymentSelection;
