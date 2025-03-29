
import React, { useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProcessingPaymentProps {
  error: string | null;
  onRetry: () => void;
}

const ProcessingPayment = ({ error, onRetry }: ProcessingPaymentProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro no processamento",
        description: "Houve um problema ao processar o pagamento. Você pode tentar novamente.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Function to display a more user-friendly error message
  const getFormattedErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes("Nenhum link de checkout foi retornado")) {
      return "Nenhum link de pagamento foi retornado. Por favor, tente novamente.";
    } else if (errorMessage.includes("No payments were created")) {
      return "Não foi possível criar o parcelamento do pagamento. Por favor, tente novamente ou escolha outro método de pagamento.";
    } else if (errorMessage.includes("Edge Function")) {
      return "Erro na comunicação com a plataforma de pagamento. Por favor, tente novamente em alguns instantes.";
    } else if (errorMessage.includes("CPF ou CNPJ")) {
      return "CPF ou CNPJ é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    } else if (errorMessage.includes("Nome completo")) {
      return "Nome completo é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    } else if (errorMessage.includes("Telefone")) {
      return "Telefone é obrigatório para realizar pagamentos. Por favor, complete seu perfil antes de continuar.";
    }
    return errorMessage;
  };

  return (
    <div className="space-y-8 text-center">
      {error ? (
        <div className="bg-card border border-destructive/30 rounded-xl p-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Erro ao processar pagamento</h2>
          
          <p className="text-muted-foreground mb-6">
            {getFormattedErrorMessage(error)}
          </p>
          
          <Button onClick={onRetry} size="lg" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Processando pagamento</h2>
            <p className="text-muted-foreground">
              Você será redirecionado para a página de pagamento em instantes...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingPayment;
