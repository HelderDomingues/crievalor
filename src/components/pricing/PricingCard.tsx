
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlan } from "./types";
import PlanDocuments from "./PlanDocuments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, BadgePercent } from "lucide-react";
import { AuroraButton } from "@/components/ui/aurora-button";

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

  // Extract team size recommendation from features (if present)
  const teamSizeRecommendation = plan.features.find(feature => 
    feature.startsWith("(Para empresas")
  );
  
  // Filter out the team size recommendation from features list
  const actualFeatures = plan.features.filter(feature => 
    !feature.startsWith("(Para empresas")
  );

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
        
        {/* Team size recommendation displayed near plan name */}
        {teamSizeRecommendation && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {teamSizeRecommendation}
          </div>
        )}
        
        {/* Price information */}
        <div className="mt-2">
          {renderPriceInfo()}
          {plan.comingSoon && (
            <div className="text-lg font-medium text-muted-foreground">Em Breve</div>
          )}
        </div>
        
        {/* Plan description */}
        {plan.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {plan.description}
          </p>
        )}
      </CardHeader>
      
      {/* CTA Button - Moved here right after description and before features */}
      <div className="px-6 pb-4">
        {plan.popular ? (
          <AuroraButton 
            onClick={handleSubscribe}
            disabled={isButtonDisabled}
            className="w-full font-medium"
            glowClassName="from-blue-500 via-purple-500 to-cyan-400"
          >
            {getButtonText()}
          </AuroraButton>
        ) : (
          <Button 
            className="w-full"
            onClick={handleSubscribe}
            disabled={isButtonDisabled}
            variant={plan.comingSoon ? "outline" : "default"}
          >
            {getButtonText()}
          </Button>
        )}
      </div>
      
      <CardContent className="flex-grow pt-0">
        <div className="space-y-6">
          {/* Documents section with visual hierarchy - Only show for non-corporate plans */}
          {plan.id !== "corporate_plan" && plan.documents && plan.documents.length > 0 && (
            <PlanDocuments documents={plan.documents} />
          )}
          
          {/* Benefits section */}
          <div>
            <h4 className="mb-3 border-b border-border pb-2 text-sm font-medium">Benefícios Incluídos neste plano</h4>
            <ul className="space-y-3">
              {actualFeatures.map((feature, index) => (
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
