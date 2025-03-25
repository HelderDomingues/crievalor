
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
    <div className="flex justify-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
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
