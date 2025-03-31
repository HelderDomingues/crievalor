import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
const SubscriptionNotFound = () => {
  return <Alert className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Nenhuma assinatura encontrada</AlertTitle>
      <AlertDescription>
        Você ainda não possui uma assinatura ativa. Visite nossa página de planos para conhecer nossas opções e potencializar seus resultados.
      </AlertDescription>
      
    </Alert>;
};
export default SubscriptionNotFound;