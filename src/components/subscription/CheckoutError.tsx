
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CheckoutErrorProps {
  error: string;
}

const CheckoutError = ({ error }: CheckoutErrorProps) => {
  if (!error) return null;
  
  // Improve error messages for common issues
  let displayError = error;
  let errorTitle = "Erro ao iniciar checkout";
  
  if (error.includes("Edge Function")) {
    displayError = "Erro na comunicação com a plataforma de pagamento. Por favor, tente novamente em alguns instantes.";
  } else if (error.includes("CPF ou CNPJ é obrigatório")) {
    errorTitle = "Informações de perfil incompletas";
    displayError = "CPF ou CNPJ é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
  } else if (error.includes("Nome completo é obrigatório")) {
    errorTitle = "Informações de perfil incompletas";
    displayError = "Nome completo é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
  } else if (error.includes("Telefone é obrigatório")) {
    errorTitle = "Informações de perfil incompletas";
    displayError = "Telefone é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
  } else if (error.includes("No payments were created") || error.includes("Nenhum pagamento foi criado")) {
    errorTitle = "Erro ao processar parcelas";
    displayError = "Não foi possível criar o parcelamento do pagamento. Por favor, tente novamente ou escolha outro método de pagamento.";
  } else if (error.includes("Nenhum link de checkout foi retornado")) {
    errorTitle = "Erro ao processar pagamento";
    displayError = "Não foi possível obter o link de pagamento. Por favor, tente novamente em alguns instantes.";
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorTitle}</AlertTitle>
      <AlertDescription>{displayError}</AlertDescription>
    </Alert>
  );
};

export default CheckoutError;
