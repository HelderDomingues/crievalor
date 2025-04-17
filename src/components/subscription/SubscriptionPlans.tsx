
import React from "react";
import { PLANS } from "@/services/plansService";
import { PlanCard } from "@/components/pricing/PlanCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentType } from "@/services/marPaymentLinks";

interface SubscriptionPlansProps {
  isCheckingOut: boolean;
  isPlanCurrent: (planId: string) => boolean;
  onSubscribe: (planId: string) => Promise<void>;
  selectedInstallments: number;
  onInstallmentsChange: (installments: number) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  isCheckingOut,
  isPlanCurrent,
  onSubscribe,
  selectedInstallments,
  onInstallmentsChange,
}) => {
  // Convert PLANS object to array for rendering
  const plansArray = Object.values(PLANS);

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <div className="bg-background border rounded-lg p-4 max-w-sm w-full">
          <Label htmlFor="installments" className="block text-sm font-medium mb-2">
            Opções de Pagamento
          </Label>
          <Select
            value={String(selectedInstallments)}
            onValueChange={(value) => onInstallmentsChange(Number(value))}
          >
            <SelectTrigger id="installments" className="w-full">
              <SelectValue placeholder="Selecione o número de parcelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">À Vista (10% de desconto)</SelectItem>
              <SelectItem value="12">Parcelado em 12x</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedInstallments === 1
              ? "Pagamento à vista com 10% de desconto"
              : "Pagamento parcelado no cartão de crédito"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plansArray.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isLoading={isCheckingOut}
            isCurrent={isPlanCurrent(plan.id)}
            onSubscribe={() => onSubscribe(plan.id)}
            installments={selectedInstallments}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
