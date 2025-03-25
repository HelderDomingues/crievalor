
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubscriptionPlanProps {
  id: string;
  name: string;
  price: string;
  basePrice: number;
  features: string[];
  isCurrentPlan: boolean;
  isCheckingOut: boolean;
  onSubscribe: (planId: string) => Promise<void>;
  installments?: number;
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
}: SubscriptionPlanProps) => {
  // Calculate installment price
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const installmentPrice = basePrice / installments;
  const formattedInstallmentPrice = formatCurrency(installmentPrice);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="flex flex-col mt-2">
          <span className="text-2xl font-bold">{price}</span>
          {installments > 1 && (
            <div className="mt-1">
              <Badge variant="outline" className="font-normal">
                {installments}x de {formattedInstallmentPrice}
              </Badge>
            </div>
          )}
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
