
import React from "react";
import SubscriptionPlan from "./SubscriptionPlan";
import { PLANS } from "@/services/subscriptionService";

interface SubscriptionPlansProps {
  isCheckingOut: boolean;
  isPlanCurrent: (planId: string) => boolean;
  onSubscribe: (planId: string) => Promise<void>;
  selectedInstallments?: number;
  onInstallmentsChange?: (installments: number) => void;
}

const SubscriptionPlans = ({
  isCheckingOut,
  isPlanCurrent,
  onSubscribe,
  selectedInstallments = 1,
  onInstallmentsChange,
}: SubscriptionPlansProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.values(PLANS).map((plan) => {
        // Always show installment prices
        let priceLabel: string | undefined = undefined;
        
        if ('customPrice' in plan && plan.customPrice) {
          priceLabel = "Sob Consulta";
        } else if ('priceLabel' in plan) {
          // Always show monthly price instead of cash price
          priceLabel = `12x de R$ ${(plan.price).toFixed(2).replace('.', ',')}`;
        }
        
        // Determine base price for calculations
        let basePrice: number | undefined = undefined;
        if ('price' in plan) {
          basePrice = plan.price;
        }
        
        // Corporate plan needs special handling for the button label
        const buttonLabel = ('customPrice' in plan && plan.customPrice) ? 
          "Consultar" : 
          "Assinar";
        
        return (
          <SubscriptionPlan
            key={plan.id}
            id={plan.id}
            name={plan.name}
            price={priceLabel}
            basePrice={basePrice}
            features={plan.features}
            isCurrentPlan={isPlanCurrent(plan.id)}
            isCheckingOut={isCheckingOut}
            onSubscribe={onSubscribe}
            installments={12} // Set default to 12
            buttonLabel={buttonLabel}
          />
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
