
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

  // Extract team size recommendation (this is now only for display below plan name)
  const teamSizeRecommendation = plan.features.find(feature => feature.startsWith("Para empresas"));

  // Filter out team size recommendation from features list
  const filteredFeatures = plan.features.filter(feature => !feature.startsWith("Para empresas"));
  
  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
      return;
    }
    navigate(`/checkout?plan=${plan.id}`);
  };
  
  const isButtonDisabled = plan.comingSoon || isCheckingOut || isCurrent;
  
  const getButtonText = () => {
    if (isCheckingOut) {
      return <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processando...
      </>;
    } else if (isCurrent) {
      return "Plano Atual";
    } else if (plan.comingSoon) {
      return "Em Breve";
    } else {
      return plan.cta || "Começar agora";
    }
  };
  
  const renderPriceInfo = () => {
    if (plan.comingSoon) {
      return null;
    } else if (plan.customPrice) {
      return <div className="text-3xl font-bold">Condições sob consulta</div>;
    } else if (plan.monthlyPrice || plan.annualPrice) {
      return <>
        {plan.monthlyPrice && <div className="flex items-baseline justify-center">
            <span className="font-bold text-nowrap text-3xl">{plan.monthlyPrice}</span>
          </div>}
        
        {plan.annualPrice && <div className="mt-3 space-y-2">
            <div className="text-lg text-muted-foreground flex items-center justify-center">
              <span>ou</span>
              <span className="font-semibold ml-2 text-nowrap">{plan.annualPrice}</span>
              <span className="ml-2">à vista</span>
              {plan.annualDiscount && <Badge variant="outline" className="ml-3 flex items-center text-green-600">
                  <BadgePercent className="h-3 w-3 mr-1" />
                  10% off
                </Badge>}
            </div>
            {plan.annualDiscount && <div className="text-sm text-muted-foreground">
                Desconto aplicado em pagamento único
              </div>}
          </div>}
      </>;
    }
    return null;
  };

  return (
    <Card className="flex h-full flex-col transition-all duration-300 hover:shadow-xl bg-card text-card-foreground border-primary shadow-lg relative">
      <div className="absolute top-0 left-0 w-full flex justify-center">
        <Badge variant="default" className="transform -translate-y-1/2 bg-primary">
          Contrate Agora
        </Badge>
      </div>
      
      <CardHeader className="pb-4 py-8 text-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {isCurrent && !plan.comingSoon && <Badge variant="secondary" className="self-start">Plano Atual</Badge>}
        </div>
        
        {teamSizeRecommendation && <div className="text-sm text-muted-foreground mt-2 mb-4">
            {teamSizeRecommendation}
          </div>}
        
        <div className="mt-4">
          {renderPriceInfo()}
        </div>
        
        {plan.description && <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            {plan.description}
          </p>}
      </CardHeader>
      
      <div className="px-6 pb-6">
        <AuroraButton 
          onClick={handleSubscribe} 
          disabled={isButtonDisabled} 
          className="w-full font-medium text-lg py-6 bg-primary hover:bg-primary/90" 
          glowClassName="from-primary via-primary/80 to-primary/60"
        >
          {getButtonText()}
        </AuroraButton>
      </div>
      
      <CardContent className="flex-grow pt-0">
        {plan.documents && plan.documents.length > 0 && <PlanDocuments documents={plan.documents} />}
        
        <div className="mt-6">
          <h4 className="mb-4 border-b border-border pb-3 text-base font-bold text-center">O que está incluído</h4>
          <ul className="space-y-4">
            {filteredFeatures.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="mr-3 text-green-500 text-lg">✓</span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
