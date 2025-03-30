
import React from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft } from "lucide-react";

interface PaymentSelectionProps {
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
