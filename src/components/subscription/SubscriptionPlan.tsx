
import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionPlanProps {
  id: string;
  name: string;
  price?: string;
  basePrice?: number;
  features: string[];
  isCurrentPlan: boolean;
  isCheckingOut: boolean;
  onSubscribe: (planId: string) => Promise<void>;
  installments?: number;
  buttonLabel?: string;
}

const SubscriptionPlan = ({
  id,
  name,
  price,
  basePrice,
  features,
  isCurrentPlan,
  isCheckingOut,
  onSubscribe,
  installments = 1,
  buttonLabel = "Assinar"
}: SubscriptionPlanProps) => {
  return (
    <div 
      className={`bg-card border rounded-xl p-6 flex flex-col transition-all h-full
        ${isCurrentPlan ? "border-primary/50 shadow-md shadow-primary/10" : "border-border hover:border-primary/30 hover:shadow-sm"}`}
    >
      <div className="mb-4">
        {isCurrentPlan && (
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-2">
            Seu plano atual
          </span>
        )}
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <div className="flex items-baseline mb-4">
          {price && (
            <>
              {price === "Sob Consulta" ? (
                <span className="text-2xl font-bold">{price}</span>
              ) : (
                <>
                  <span className="text-2xl font-bold">{price}</span>
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="flex-grow">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        {isCurrentPlan ? (
          <Button variant="outline" disabled className="w-full">
            Plano Atual
          </Button>
        ) : (
          <Button
            onClick={() => onSubscribe(id)}
            disabled={isCheckingOut}
            className="w-full"
          >
            {isCheckingOut ? "Processando..." : buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
