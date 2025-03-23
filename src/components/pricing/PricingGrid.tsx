
import React from "react";
import PricingCard from "./PricingCard";
import { PricingPlan } from "./types";

interface PricingGridProps {
  plans: PricingPlan[];
}

const PricingGrid = ({ plans }: PricingGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      {plans.map((plan, index) => (
        <PricingCard key={index} plan={plan} />
      ))}
    </div>
  );
};

export default PricingGrid;
