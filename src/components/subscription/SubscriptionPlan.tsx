
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BadgePercent } from "lucide-react";
import { AuroraButton } from "@/components/ui/aurora-button";

interface SubscriptionPlanProps {
  id: string;
  name: string;
  price?: string;
  cashPrice?: string;
  customPrice?: string;
  description?: string;
  features: string[];
  onSubscribe: (planId: string) => Promise<void>;
  isCurrentPlan?: boolean;
  isCheckingOut?: boolean;
  buttonLabel?: string;
  popular?: boolean;
}

const SubscriptionPlan = ({
  id,
  name,
  price,
  cashPrice,
  customPrice,
  description,
  features,
  isCurrentPlan = false,
  isCheckingOut = false,
  onSubscribe,
  buttonLabel = "Quero este plano",
  popular = false,
}: SubscriptionPlanProps) => {
  const handleSubscribe = () => {
    onSubscribe(id);
  };

  return (
    <Card className={`flex h-full flex-col transition-all duration-300 hover:shadow-md bg-card text-card-foreground ${popular ? "border-primary shadow-lg relative" : "border-border"}`}>
      {popular && (
        <div className="absolute top-0 left-0 w-full flex justify-center">
          <Badge variant="default" className="transform -translate-y-1/2">
            Mais Vendido
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2 py-6">
        <div className="flex flex-wrap gap-2">
          {isCurrentPlan && <Badge variant="secondary" className="self-start">Plano Atual</Badge>}
        </div>
        
        <h3 className="mt-2 font-bold text-3xl">{name}</h3>
        
        {description && (
          <div className="text-xs text-muted-foreground mt-1 mb-2">
            {description}
          </div>
        )}
        
        <div className="mt-2">
          {customPrice ? (
            <div className="text-xl font-bold">{customPrice}</div>
          ) : (
            <>
              <div className="text-2xl font-bold text-nowrap">{price}</div>
              {cashPrice && (
                <div className="mt-1 space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span>ou</span>
                    <span className="font-medium ml-1 text-nowrap">{cashPrice}</span>
                    <span className="ml-1">à vista</span>
                    <Badge variant="outline" className="ml-2 flex items-center text-green-600">
                      <BadgePercent className="h-3 w-3 mr-1" />
                      10% off
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Desconto aplicado em pagamento único
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pt-0">
        <h4 className="mb-3 border-b border-border pb-2 text-sm font-bold">
          Benefícios Incluídos neste plano
        </h4>
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
