
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubscriptionPlanProps {
  id: string;
  name: string;
  price: string | undefined;
  basePrice?: number;
  features: string[];
  isCurrentPlan: boolean;
  isCheckingOut: boolean;
  onSubscribe: (planId: string) => Promise<void>;
  installments?: number;
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({
  id,
  name,
  price,
  basePrice,
  features,
  isCurrentPlan,
  isCheckingOut,
  onSubscribe,
  installments = 1,
}) => {
  // Plano corporativo "sob consulta"
  const isCorporate = id === "corporate_plan";
  
  // Button states
  const buttonDisabled = isCurrentPlan || isCheckingOut;
  
  const handleSubscribe = () => {
    if (isCorporate) {
      // Redirecionar para página de contato
      window.location.href = "/contato?assunto=plano-corporativo";
      return;
    }
    
    onSubscribe(id);
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <span>{name}</span>
          {isCurrentPlan && (
            <Badge variant="outline" className="self-start">Plano Atual</Badge>
          )}
        </CardTitle>
        
        <div className="text-2xl font-bold mt-2">
          {isCorporate ? (
            <span>Sob Consulta</span>
          ) : (
            <span>{price}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={buttonDisabled}
        >
          {isCurrentPlan ? (
            "Plano Atual"
          ) : isCheckingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : isCorporate ? (
            "Falar com Consultor"
          ) : (
            "Assinar"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlan;
