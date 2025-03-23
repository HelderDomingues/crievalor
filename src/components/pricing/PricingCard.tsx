
import React from "react";
import { Check, Calendar, CreditCard, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlanDocuments from "./PlanDocuments";
import { PricingPlan } from "./types";

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <div 
      className={`rounded-xl overflow-hidden transition-all ${
        plan.popular 
          ? "border-primary shadow-lg shadow-primary/20 relative md:scale-105 z-10" 
          : plan.comingSoon
            ? "border-border opacity-75"
            : "border-border"
      } border bg-card hover:shadow-lg hover:shadow-primary/10`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
            Recomendado
          </div>
        </div>
      )}
      
      {plan.comingSoon && (
        <div className="absolute top-0 right-0">
          <div className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
            Em breve
          </div>
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        
        {/* Pricing display */}
        {plan.comingSoon ? (
          <div className="flex items-baseline mb-4">
            <span className="text-3xl md:text-4xl font-bold">{plan.monthlyPrice}</span>
          </div>
        ) : plan.name === "Personalizado" ? (
          <div className="flex items-baseline mb-4">
            <span className="text-3xl md:text-4xl font-bold">Sob consulta</span>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-baseline mb-1">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl md:text-3xl font-bold">{plan.monthlyPrice}</span>
              <span className="text-muted-foreground ml-2 text-sm">
                /mês
              </span>
            </div>
            <div className="text-sm text-muted-foreground ml-7">
              em 12x no cartão de crédito
            </div>
            
            <div className="flex items-baseline mt-3 pt-3 border-t border-border">
              <BadgePercent className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-green-500">Economia de 10%</span>
                  <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                    À vista
                  </Badge>
                </div>
                <div className="flex items-baseline">
                  <span className="text-base font-bold">{plan.annualPrice}</span>
                  <span className="text-muted-foreground ml-1 text-xs">
                    pagamento único
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-muted-foreground text-sm mb-6">
          {plan.description}
        </p>
        
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="text-primary shrink-0 mr-2 h-5 w-5 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Document access section */}
        {plan.documents && <PlanDocuments documents={plan.documents} />}
        
        <Button 
          className={`w-full ${
            plan.popular 
              ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
              : plan.comingSoon
                ? "bg-secondary/50 text-foreground/50 hover:bg-secondary/50 cursor-not-allowed"
                : "bg-secondary text-foreground hover:bg-secondary/80"
          }`}
          disabled={plan.comingSoon}
          asChild={!plan.comingSoon}
        >
          {plan.comingSoon ? (
            <span>{plan.cta}</span>
          ) : (
            <a href={plan.ctaUrl}>{plan.cta}</a>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
