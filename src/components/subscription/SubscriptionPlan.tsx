
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

interface PlanFeature {
  feature: string;
}

interface SubscriptionPlanProps {
  id: string;
  name: string;
  price: string;
  features: string[];
  isCurrentPlan: boolean;
  isCheckingOut: boolean;
  onSubscribe: (planId: string) => Promise<void>;
}

const SubscriptionPlan = ({
  id,
  name,
  price,
  features,
  isCurrentPlan,
  isCheckingOut,
  onSubscribe,
}: SubscriptionPlanProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <span className="text-2xl font-bold">{price}</span> /mês
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onSubscribe(id)}
          disabled={isCheckingOut || isCurrentPlan}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : isCurrentPlan ? (
            "Plano Atual"
          ) : (
            "Assinar"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlan;
