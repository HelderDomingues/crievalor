
import React from "react";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const SubscriptionNotFound = () => {
  return (
    <Alert className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Nenhuma assinatura encontrada</AlertTitle>
      <AlertDescription>
        Você ainda não possui uma assinatura ativa. Visite nossa página de planos para conhecer nossas opções.
      </AlertDescription>
      <Button variant="outline" className="mt-4" asChild>
        <a href="/subscription">Ver planos</a>
      </Button>
    </Alert>
  );
};

export default SubscriptionNotFound;
