
import React from "react";
import SubscriptionPlan from "./SubscriptionPlan";
import { PLANS } from "@/services/subscriptionService";

interface SubscriptionPlansProps {
  isCheckingOut: boolean;
  isPlanCurrent: (planId: string) => boolean;
  onSubscribe: (planId: string) => Promise<void>;
}

const SubscriptionPlans = ({
  isCheckingOut,
  isPlanCurrent,
  onSubscribe,
}: SubscriptionPlansProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Object.values(PLANS).map((plan) => (
        <SubscriptionPlan
          key={plan.id}
          id={plan.id}
          name={plan.name}
          price={plan.price}
          features={plan.features}
          isCurrentPlan={isPlanCurrent(plan.id)}
          isCheckingOut={isCheckingOut}
          onSubscribe={onSubscribe}
        />
      ))}
    </div>
  );
};

export default SubscriptionPlans;
