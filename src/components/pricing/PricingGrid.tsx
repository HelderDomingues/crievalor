
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
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
  );
};

export default PricingGrid;
