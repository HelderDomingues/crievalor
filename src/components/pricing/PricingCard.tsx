
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlan } from "./types";
import PlanDocuments from "./PlanDocuments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, BadgePercent } from "lucide-react";

interface PricingCardProps {
  plan: PricingPlan;
  isCheckingOut?: boolean;
  isCurrent?: boolean;
  onSubscribe?: () => void;
}

const PricingCard = ({ 
  plan, 
  isCheckingOut = false, 
  isCurrent = false,
  onSubscribe 
}: PricingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Links de pagamento estáticos para cada plano
  const paymentLinks = {
    basic_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s", 
      cashPayment: "https://sandbox.asaas.com/c/fy15747uacorzbla"
    },
    pro_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon", 
      cashPayment: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq"
    },
    enterprise_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/z4vate6zwonrwoft", 
      cashPayment: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s"
    }
  };

  const handleSubscribe = () => {
    // Check if this is the corporate plan and handle it differently
    if (plan.id === "corporate_plan") {
      const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre o Plano Corporativo.");
      window.open(`https://wa.me/5547992150289?text=${message}`, '_blank');
      return;
    }
    
    if (onSubscribe) {
      onSubscribe();
      return;
    }

    // Direct users to the checkout page to select payment method
    // We'll maintain this flow for UX consistency
    navigate(`/checkout?plan=${plan.id}`);
  };

  // Determine if button should be disabled
  const isButtonDisabled = plan.comingSoon || isCheckingOut || isCurrent;

  // Determine button text
  const getButtonText = () => {
    if (isCheckingOut) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      );
    } else if (isCurrent) {
      return "Plano Atual";
    } else if (plan.comingSoon) {
      return "Em Breve";
    } else if (plan.id === "corporate_plan") {
      return "Consultar via WhatsApp";
    } else {
      return plan.cta || "Quero este plano";
    }
  };

  // Display price information - ensuring no pricing for comingSoon plans
  const renderPriceInfo = () => {
    if (plan.comingSoon) {
      return null; // Don't display any pricing for coming soon plans
    } else if (plan.customPrice) {
      return (
        <div className="text-lg font-medium">Sob Consulta</div>
      );
    } else if (plan.monthlyPrice || plan.annualPrice) {
      return (
        <>
          {plan.monthlyPrice && (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{plan.monthlyPrice}</span>
              <span className="ml-1 text-sm text-muted-foreground">/mês</span>
            </div>
          )}
          
          {plan.annualPrice && (
            <div className="mt-1 space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <span>ou</span>
                <span className="font-medium ml-1">{plan.annualPrice}</span>
                <span className="ml-1">à vista</span>
                {plan.annualDiscount && (
                  <Badge variant="outline" className="ml-2 flex items-center text-green-600">
                    <BadgePercent className="h-3 w-3 mr-1" />
                    10% off
                  </Badge>
                )}
              </div>
              {plan.annualDiscount && (
                <div className="text-xs text-muted-foreground">
                  Desconto aplicado em pagamento único
                </div>
              )}
            </div>
          )}
        </>
      );
    }
    
    return null;
  };

  return (
    <Card className={`flex h-full flex-col transition-all duration-300 hover:shadow-md ${plan.popular ? "border-primary shadow-lg" : ""}`}>
      <CardHeader className="pb-2">
        {/* Plan badges and title */}
        <div className="flex flex-wrap gap-2">
          {plan.popular && !plan.comingSoon && (
            <Badge variant="default" className="self-start">Mais Vendido</Badge>
          )}
          {plan.comingSoon && (
            <Badge variant="outline" className="self-start">Em Breve</Badge>
          )}
          {isCurrent && !plan.comingSoon && (
            <Badge variant="secondary" className="self-start">Plano Atual</Badge>
          )}
        </div>
        
        <h3 className="mt-2 text-xl font-bold">{plan.name}</h3>
        
        {/* Recommendation text - not a feature */}
        <div className="text-xs text-muted-foreground mt-0.5">
          {plan.description && plan.description.startsWith("(Para empresas") 
            ? plan.description 
            : null}
        </div>
        
        {/* Price information */}
        <div className="mt-2">
          {renderPriceInfo()}
          {plan.comingSoon && (
            <div className="text-lg font-medium text-muted-foreground">Em Breve</div>
          )}
        </div>
        
        {/* Plan description */}
        <p className="mt-2 text-sm text-muted-foreground">
          {!plan.description?.startsWith("(Para empresas") ? plan.description : null}
        </p>
      </CardHeader>
      
      {/* CTA Button - Moved up before features */}
      <div className="px-6 pb-4">
        <Button 
          className={`w-full ${plan.popular ? "shadow-glow animate-pulse-subtle" : ""}`}
          onClick={handleSubscribe}
          disabled={isButtonDisabled}
          variant={plan.comingSoon ? "outline" : "default"}
        >
          {getButtonText()}
        </Button>
      </div>
      
      <CardContent className="flex-grow pt-0">
        <div className="space-y-6">
          {/* Documents section with visual hierarchy */}
          {plan.documents && plan.documents.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-3 border-b border-border pb-2">Documentos Incluídos</h4>
              <ul className="space-y-3">
                {plan.documents.map((doc, i) => {
                  // Check if this is the main strategic plan
                  const isMainPlan = doc.name.includes("Plano Estratégico");
                  
                  return (
                    <li key={i} className={`flex items-start ${isMainPlan ? "mb-2" : "pl-3"}`}>
                      <div className={`shrink-0 mr-2 h-5 w-5 mt-0.5 ${doc.included ? 'text-green-500' : 'text-muted-foreground opacity-50'}`}>
                        <doc.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-sm ${doc.included ? '' : 'text-muted-foreground line-through opacity-50'}`}>
                        {doc.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {/* Benefits section */}
          <div>
            <h4 className="mb-3 border-b border-border pb-2 text-sm font-medium">Benefícios Incluídos neste plano</h4>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-2 text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
