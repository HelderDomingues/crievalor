
import React from "react";
import PricingCard from "./PricingCard";
import { PricingPlan } from "./types";

interface PricingGridProps {
  plans: PricingPlan[];
  isCheckingOut?: boolean;
  currentPlanId?: string | null;
  onSubscribe?: (planId: string) => void;
}

const PricingGrid = ({ 
  plans, 
  isCheckingOut = false, 
  currentPlanId = null,
  onSubscribe 
}: PricingGridProps) => {
  return (
    <div className="w-full">
      <div className="w-full">
        {plans.map((plan) => (
          <PricingCard 
            key={plan.id} 
            plan={plan} 
            isCheckingOut={isCheckingOut}
            isCurrent={plan.id === currentPlanId}
            onSubscribe={onSubscribe ? () => onSubscribe(plan.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingGrid;
