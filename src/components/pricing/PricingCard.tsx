
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlan } from "./types";
import PlanDocuments from "./PlanDocuments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface PricingCardProps {
  plan: PricingPlan;
  isCheckingOut?: boolean;
}

const PricingCard = ({ plan, isCheckingOut = false }: PricingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = () => {
    if (!user) {
      // Redirecionar para página de autenticação, passando o plano como parâmetro
      navigate(`/auth?redirect=subscription&plan=${plan.name}`);
      return;
    }
    
    // Se o usuário estiver logado, redirecionar para a página de assinatura
    navigate(`/subscription?plan=${plan.name}`);
  };

  return (
    <Card className={`flex flex-col h-full ${plan.popular ? "border-primary shadow-lg" : ""}`}>
      <CardHeader className="pb-4">
        {plan.popular && (
          <Badge className="mb-2 self-start">Mais Popular</Badge>
        )}
        {plan.comingSoon && (
          <Badge variant="outline" className="mb-2 self-start">Em Breve</Badge>
        )}
        
        <h3 className="text-xl font-bold">{plan.name}</h3>
        
        <div className="mt-2">
          {plan.monthlyPrice && (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{plan.monthlyPrice}</span>
              <span className="text-sm text-muted-foreground ml-1">/mês</span>
            </div>
          )}
          
          {plan.annualPrice && (
            <div className="text-sm text-muted-foreground mt-1">
              ou {plan.annualPrice}/ano
            </div>
          )}
          
          {!plan.monthlyPrice && !plan.annualPrice && (
            <div className="text-lg font-medium">Consulte-nos</div>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          {plan.documents && plan.documents.length > 0 && (
            <PlanDocuments documents={plan.documents} />
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-3 border-b border-border pb-2">Incluído neste plano</h4>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubscribe}
          disabled={plan.comingSoon || isCheckingOut}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : plan.comingSoon ? (
            "Em Breve"
          ) : (
            plan.cta
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
