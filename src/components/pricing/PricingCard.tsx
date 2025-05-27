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
import { toast } from "@/components/ui/use-toast";
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
  const {
    user
  } = useAuth();

  // Extract team size recommendation (this is now only for display below plan name)
  const teamSizeRecommendation = plan.features.find(feature => feature.startsWith("Para empresas"));

  // Filter out team size recommendation from features list
  const filteredFeatures = plan.features.filter(feature => !feature.startsWith("Para empresas"));
  const handleSubscribe = () => {
    if (plan.id === "corporate_plan") {
      const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre o Plano Corporativo.");
      window.open(`https://wa.me/5547992150289?text=${message}`, '_blank');
      return;
    }
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
    } else if (plan.id === "corporate_plan") {
      return "Consultar via WhatsApp";
    } else {
      return plan.cta || "Quero este plano";
    }
  };
  const renderPriceInfo = () => {
    if (plan.comingSoon) {
      return null;
    } else if (plan.customPrice) {
      return <div className="text-3xl font-bold">Condições sob consulta</div>;
    } else if (plan.monthlyPrice || plan.annualPrice) {
      return <>
        {plan.monthlyPrice && <div className="flex items-baseline">
            <span className="font-bold text-nowrap text-2xl">{plan.monthlyPrice}</span>
          </div>}
        
        {plan.annualPrice && <div className="mt-1 space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <span>ou</span>
              <span className="font-medium ml-1 text-nowrap">{plan.annualPrice}</span>
              <span className="ml-1">à vista</span>
              {plan.annualDiscount && <Badge variant="outline" className="ml-2 flex items-center text-green-600">
                  <BadgePercent className="h-3 w-3 mr-1" />
                  10% off
                </Badge>}
            </div>
            {plan.annualDiscount && <div className="text-xs text-muted-foreground">
                Desconto aplicado em pagamento único
              </div>}
          </div>}
      </>;
    }
    return null;
  };
  return <Card className={`flex h-full flex-col transition-all duration-300 hover:shadow-md bg-card text-card-foreground ${plan.popular ? "border-primary shadow-lg relative" : ""}`}>
      {plan.popular && !plan.comingSoon && <div className="absolute top-0 left-0 w-full flex justify-center">
          <Badge variant="default" className="transform -translate-y-1/2">
            Mais Vendido
          </Badge>
        </div>}
      
      <CardHeader className="pb-2 py-6">
        <div className="flex flex-wrap gap-2">
          {plan.comingSoon && <Badge variant="outline" className="self-start">Em Breve</Badge>}
          {isCurrent && !plan.comingSoon && <Badge variant="secondary" className="self-start">Plano Atual</Badge>}
        </div>
        
        <h3 className="mt-2 font-bold text-3xl">{plan.name}</h3>
        
        {teamSizeRecommendation && <div className="text-xs text-muted-foreground mt-1 mb-2">
            {teamSizeRecommendation}
          </div>}
        
        <div className="mt-2">
          {renderPriceInfo()}
          {plan.comingSoon && <div className="text-lg font-medium text-muted-foreground">Em Breve</div>}
        </div>
        
        {plan.description && <p className="mt-2 text-sm text-muted-foreground">
            {plan.description}
          </p>}
      </CardHeader>
      
      <div className="px-6 pb-4">
        {plan.popular ? <AuroraButton onClick={handleSubscribe} disabled={isButtonDisabled} className="w-full font-medium bg-blue-700 hover:bg-blue-800" glowClassName="from-blue-700 via-blue-600 to-blue-500">
            {getButtonText()}
          </AuroraButton> : <Button className="w-full" onClick={handleSubscribe} disabled={isButtonDisabled} variant={plan.comingSoon ? "outline" : "default"}>
            {getButtonText()}
          </Button>}
      </div>
      
      <CardContent className="flex-grow pt-0">
        {plan.id !== "corporate_plan" && plan.documents && plan.documents.length > 0 && <PlanDocuments documents={plan.documents} />}
        
        <div>
          <h4 className="mb-3 border-b border-border pb-2 text-sm font-bold">Benefícios Incluídos neste plano</h4>
          <ul className="space-y-3">
            {filteredFeatures.map((feature, index) => <li key={index} className="flex items-start text-sm">
                <span className="mr-2 text-green-500">✓</span>
                {feature}
              </li>)}
          </ul>
        </div>
      </CardContent>
    </Card>;
};
export default PricingCard;