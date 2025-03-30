
import React from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft } from "lucide-react";
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
  onBack
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-start mt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default PaymentSelection;
