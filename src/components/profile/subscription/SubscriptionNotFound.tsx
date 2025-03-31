
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SubscriptionNotFound = () => {
  const navigate = useNavigate();
  
  const handleConsultant = () => {
    const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre os planos disponíveis.");
    window.open(`https://wa.me/5547992150289?text=${message}`, '_blank');
  };

  const handleViewPlans = () => {
    // Navigate to the MAR page and scroll to the pricing section
    window.location.href = "/mar#pricing";
  };

  return (
    <Alert className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Nenhuma assinatura encontrada</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>Você ainda não possui uma assinatura ativa. Escolha um plano MAR para potencializar seus resultados ou entre em contato com nosso consultor para mais informações.</p>
        
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={handleConsultant}>
            Falar com consultor
          </Button>
          <Button onClick={handleViewPlans}>
            Escolher um plano
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionNotFound;
