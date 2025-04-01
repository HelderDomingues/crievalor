
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AuroraButton } from "@/components/ui/aurora-button";

interface SubscriptionPlanProps {
  id: string;
  name: string;
  price?: string;
  customPrice?: string;
  basePrice?: number;
  features: string[];
  onSubscribe: (planId: string) => Promise<void>;
  isCurrentPlan?: boolean;
  isCheckingOut?: boolean;
  installments?: number;
  buttonLabel?: string;
  priceFormat?: string;
}

const SubscriptionPlan = ({
  id,
  name,
  price,
  customPrice,
  features,
  basePrice,
  isCurrentPlan = false,
  isCheckingOut = false,
  onSubscribe,
  installments = 1,
  buttonLabel = "Assinar",
  priceFormat
}: SubscriptionPlanProps) => {
  const handleSubscribe = () => {
    onSubscribe(id);
  };

  const isPopular = id === "pro_plan"; // Set the Pro Plan as the popular plan

  return (
    <Card className={`flex h-full flex-col transition-all duration-300 hover:shadow-md bg-card text-card-foreground ${isPopular ? "border-primary shadow-lg relative" : "border-border"}`}>
      {isPopular && (
        <div className="absolute top-0 left-0 w-full flex justify-center">
          <Badge variant="default" className="transform -translate-y-1/2">
            Mais Vendido
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2">
          {isCurrentPlan && (
            <Badge variant="secondary" className="self-start">
              Plano Atual
            </Badge>
          )}
        </div>
        
        <h3 className="mt-2 font-bold text-2xl">{name}</h3>
        
        {price && (
          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-nowrap">{price}</span>
            </div>
            {priceFormat && (
              <div className="text-sm text-muted-foreground mt-1">{priceFormat}</div>
            )}
          </div>
        )}
        
        {customPrice && (
          <div className="text-3xl font-bold mt-4">
            {customPrice}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="mr-2 text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-4 pb-6 px-6">
        {id === "corporate_plan" || isCurrentPlan ? (
          <Button
            className="w-full"
            variant={isCurrentPlan ? "secondary" : "default"}
            onClick={handleSubscribe}
            disabled={isCurrentPlan || isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : isCurrentPlan ? (
              "Plano Atual"
            ) : (
              buttonLabel
            )}
          </Button>
        ) : (
          <AuroraButton
            onClick={handleSubscribe}
            disabled={isCurrentPlan || isCheckingOut}
            className="w-full font-medium bg-blue-700 hover:bg-blue-800"
            glowClassName="from-blue-700 via-blue-600 to-blue-500"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              buttonLabel
            )}
          </AuroraButton>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlan;
