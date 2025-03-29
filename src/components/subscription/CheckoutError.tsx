
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { errorUtils } from "@/utils/errorUtils";
import { Button } from "@/components/ui/button";

interface CheckoutErrorProps {
  error: string;
  onRetry?: () => void;
}

const CheckoutError = ({ error, onRetry }: CheckoutErrorProps) => {
  if (!error) return null;
  
  // Use the error utils for consistent error mapping
  const displayError = errorUtils.getUserFriendlyMessage(error);
  
  // Determine appropriate error title based on the error message
  let errorTitle = "Erro ao iniciar checkout";
  
  if (error.includes("CPF ou CNPJ") || error.includes("Nome completo") || error.includes("Telefone")) {
    errorTitle = "Informações de perfil incompletas";
  } else if (error.includes("No payments were created") || error.includes("Nenhum pagamento foi criado")) {
    errorTitle = "Erro ao processar parcelas";
  } else if (error.includes("Edge Function") || error.includes("comunicação")) {
    errorTitle = "Erro de comunicação";
  } else if (error.includes("Nenhum link de checkout")) {
    errorTitle = "Erro ao processar pagamento";
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorTitle}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <div>{displayError}</div>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="mt-2 self-start"
          >
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default CheckoutError;
