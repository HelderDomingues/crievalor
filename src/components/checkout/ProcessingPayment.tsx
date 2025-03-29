
import React, { useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { errorUtils } from "@/utils/errorUtils";

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

  return (
    <div className="space-y-8 text-center">
      {error ? (
        <div className="bg-card border border-destructive/30 rounded-xl p-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Erro ao processar pagamento</h2>
          
          <p className="text-muted-foreground mb-6">
            {errorUtils.getUserFriendlyMessage(error)}
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
