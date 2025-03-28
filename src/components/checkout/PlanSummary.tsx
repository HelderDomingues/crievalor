
import React from "react";
import { subscriptionService } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PlanSummaryProps {
  planId: string;
  onContinue: () => void;
}

const PlanSummary = ({ planId, onContinue }: PlanSummaryProps) => {
  const plan = subscriptionService.getPlanFromId(planId);
  
  if (!plan) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Plano não encontrado.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Você escolheu o plano {plan.name}</h1>
        <p className="text-muted-foreground mt-2">
          Confirme os detalhes do seu plano antes de prosseguir para o pagamento.
        </p>
      </div>
      
      <Card className="overflow-hidden border-primary/20">
        <div className="bg-primary/5 p-4 border-b border-primary/10">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          {'price' in plan && (
            <div className="mt-1">
              <span className="text-2xl font-bold">
                R$ {plan.cashPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                à vista ou em até 12x no cartão
              </span>
            </div>
          )}
          {'customPrice' in plan && plan.customPrice && (
            <div className="text-lg font-medium mt-1">Sob Consulta</div>
          )}
        </div>
        
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">O que está incluído:</h4>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <Button onClick={onContinue} size="lg" className="px-8">
          Continuar para pagamento 
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlanSummary;
