
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Plan } from "@/types/subscription";

interface PlanCardProps {
  plan: Plan;
  isLoading?: boolean;
  isCurrent?: boolean;
  onSubscribe?: () => void;
  installments?: number;
}

export const PlanCard = ({
  plan,
  isLoading = false,
  isCurrent = false,
  onSubscribe,
  installments = 12
}: PlanCardProps) => {
  const isCustomPlan = 'customPrice' in plan && plan.customPrice;
  const isPlanInSubscriptions = 'paymentOptions' in plan || isCustomPlan;
  
  const getDisplayPrice = () => {
    if (isCustomPlan) {
      return <div className="text-xl font-bold">Sob Consulta</div>;
    }
    
    if ('price' in plan) {
      const showCashPrice = installments === 1;
      return (
        <div>
          <div className="flex items-baseline">
            <span className="text-sm mr-1">{showCashPrice ? "" : "até 12x de"}</span>
            <span className="text-2xl font-bold">
              R$ {(showCashPrice ? plan.cashPrice / 12 : plan.price).toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span>total: R$ {(showCashPrice ? plan.cashPrice : plan.totalPrice).toFixed(2).replace('.', ',')}</span>
          </div>
          {showCashPrice && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Com 10% de desconto!
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  const buttonLabel = isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Processando...
    </>
  ) : isCurrent ? (
    "Plano Atual"
  ) : isCustomPlan ? (
    "Consultar"
  ) : (
    "Escolher Plano"
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {isCurrent && <Badge className="mt-2 self-start">Plano Atual</Badge>}
        <div className="mt-3">
          {getDisplayPrice()}
        </div>
      </CardHeader>
      
      <CardContent className="pb-0 flex-grow">
        <h4 className="font-medium mb-3">O que está incluído:</h4>
        {isPlanInSubscriptions && 'features' in plan && (
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="mr-2 text-green-500">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          onClick={onSubscribe} 
          disabled={isLoading || isCurrent} 
          className="w-full"
          variant={isCurrent ? "outline" : "default"}
        >
          {buttonLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
