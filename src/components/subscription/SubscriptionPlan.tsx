
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  priceFormat?: string;
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
  buttonLabel = "Assinar",
  priceFormat = ""
}: SubscriptionPlanProps) => {
  const handleSubscribe = () => {
    onSubscribe(id);
  };
  
  const isHighlighted = id === "pro_plan";
  
  return (
    <div 
      className={cn(
        "flex flex-col p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all",
        isHighlighted ? "border-primary" : "border-gray-200"
      )}
    >
      <div className="flex-1">
        <h3 className={cn(
          "text-xl font-bold mb-1",
          isHighlighted ? "text-primary" : "text-gray-900"
        )}>
          {name}
        </h3>
        
        {price && (
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{price}</span>
              {priceFormat && (
                <span className="ml-1 text-sm text-muted-foreground">{priceFormat}</span>
              )}
            </div>
            
            {basePrice && (
              <div className="mt-1 text-sm text-muted-foreground">
                Total: R$ {basePrice.toFixed(2).replace('.', ',')}
              </div>
            )}
          </div>
        )}
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button
        onClick={handleSubscribe}
        className={cn(
          "w-full mt-auto",
          isHighlighted ? "bg-primary hover:bg-primary/90" : "",
          isCurrentPlan ? "bg-green-600 hover:bg-green-700" : ""
        )}
        variant={isHighlighted ? "default" : "outline"}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Plano Atual" : buttonLabel}
      </Button>
    </div>
  );
};

export default SubscriptionPlan;
