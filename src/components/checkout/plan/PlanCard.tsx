
import React from "react";
import { Check } from "lucide-react";
import { CardContent } from "@/components/ui/card";

interface PlanCardProps {
  plan: any;
  formatCurrency: (value: number) => string;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, formatCurrency }) => {
  const PriceDisplay = () => {
    if (!('price' in plan)) return null;
    return <div className="mt-1">
        <div className="flex items-baseline">
          <span className="text-sm mr-1">até 12x de</span>
          <span className="text-3xl font-bold">
            R$ {formatCurrency(plan.price)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>total a prazo: R$ {formatCurrency(plan.totalPrice)}</span>
        </div>
        <div className="text-sm mt-1">
          Ou R$ {formatCurrency(plan.cashPrice)} à vista
        </div>
      </div>;
  };

  return (
    <>
      <div className="bg-primary/5 p-4 border-b border-primary/10">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <PriceDisplay />
        {'customPrice' in plan && plan.customPrice && <div className="text-lg font-medium mt-1">Sob Consulta</div>}
      </div>
      
      <CardContent className="p-6">
        <h4 className="font-medium mb-4">O que está incluído:</h4>
        <ul className="space-y-3">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </>
  );
};
