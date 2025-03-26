
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubscriptionNotFound = () => {
  return (
    <Alert className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Nenhuma assinatura encontrada</AlertTitle>
      <AlertDescription>
        Você ainda não possui uma assinatura ativa. Visite nossa página de planos para conhecer nossas opções e potencializar seus resultados.
      </AlertDescription>
      <div className="flex gap-2 mt-4">
        <Button variant="default" asChild>
          <a href="/subscription">Ver planos</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/contato">Falar com consultor</a>
        </Button>
      </div>
    </Alert>
  );
};

export default SubscriptionNotFound;
