
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
      {Object.values(PLANS).map((plan) => (
        <SubscriptionPlan
          key={plan.id}
          id={plan.id}
          name={plan.name}
          price={plan.priceLabel}
          basePrice={plan.price}
          features={plan.features}
          isCurrentPlan={isPlanCurrent(plan.id)}
          isCheckingOut={isCheckingOut}
          onSubscribe={onSubscribe}
          installments={selectedInstallments}
        />
      ))}
    </div>
  );
};

export default SubscriptionPlans;
