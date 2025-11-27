import React from "react";
import SubscriptionPlan from "./SubscriptionPlan";
import { plans } from "@/components/pricing/pricingData";

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
      {plans.map((plan) => (
        <SubscriptionPlan
          key={plan.id}
          id={plan.id}
          name={plan.name}
          price={plan.monthlyPrice}
          cashPrice={plan.annualPrice !== "Condições sob consulta" ? plan.annualPrice : undefined}
          customPrice={plan.annualPrice === "Condições sob consulta" ? plan.annualPrice : undefined}
          description={plan.description}
          features={plan.features}
          isCurrentPlan={isPlanCurrent(plan.id)}
          isCheckingOut={isCheckingOut}
          onSubscribe={onSubscribe}
          buttonLabel={plan.cta}
          popular={plan.popular}
        />
      ))}
    </div>
  );
};

export default SubscriptionPlans;
