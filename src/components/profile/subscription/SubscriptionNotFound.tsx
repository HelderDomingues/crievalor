
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubscriptionNotFound = () => {
  const handleConsultant = () => {
    const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre os planos disponíveis.");
    window.open(`https://wa.me/5547992150289?text=${message}`, '_blank');
  };

  return (
    <Alert className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Nenhuma assinatura encontrada</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>Você ainda não possui uma assinatura ativa. Entre em contato com nosso consultor para conhecer nossas opções e potencializar seus resultados.</p>
        
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={handleConsultant}>
            Falar com consultor
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionNotFound;
