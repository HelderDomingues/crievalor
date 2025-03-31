
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProcessingPaymentProps {
  error: string | null;
  onRetry: () => void;
}

const ProcessingPayment: React.FC<ProcessingPaymentProps> = ({ error, onRetry }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-primary/20 overflow-hidden shadow-md">
        <CardContent className={`pt-6 ${isMobile ? 'px-4' : 'px-6'}`}>
          {!error ? (
            <div className="text-center p-4 md:p-8 space-y-4 bounce-in">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium">Processando seu pagamento</h3>
              
              <p className="text-muted-foreground text-sm md:text-base">
                Estamos iniciando o processo de pagamento. 
                <span className="typing-dots">Por favor, aguarde</span>
              </p>
              
              <div className="w-full max-w-xs mx-auto mt-4 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-1.5 rounded-full payment-button-processing" style={{ width: '100%' }}></div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 md:p-8 space-y-4 slide-up">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-medium text-red-600">Ocorreu um erro</h3>
              
              <p className="text-muted-foreground text-sm md:text-base">
                {error}
              </p>
              
              <Button 
                onClick={onRetry} 
                variant="outline" 
                className="mt-4 hover-raise w-full md:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg slide-up">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Caso ocorra algum problema durante o processamento, 
          você poderá retomar o processo de onde parou quando retornar à página.
        </p>
      </div>
    </div>
  );
};

export default ProcessingPayment;
