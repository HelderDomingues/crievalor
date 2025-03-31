
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Lock, Shield, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface UnifiedCheckoutFormProps {
  onPaymentRedirect: () => Promise<void>;
  onBack?: () => void;
  isSubmitting: boolean;
  plan: any;
  getPaymentAmount?: () => number;
  formatCurrency?: (value: number) => string;
  selectedPaymentMethod: "credit_installment" | "cash_payment";
}

export const UnifiedCheckoutForm: React.FC<UnifiedCheckoutFormProps> = ({
  onPaymentRedirect,
  onBack,
  isSubmitting,
  plan,
  getPaymentAmount = () => 0,
  formatCurrency = (value) => value.toString(),
  selectedPaymentMethod
}) => {
  const { user } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Add animation of fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={`w-full transition-all duration-500 ${isFormVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <CardHeader className="slide-up">
        <CardTitle>
          Avançar para pagamento
        </CardTitle>
        <CardDescription>
          Você será redirecionado para o sistema de pagamento da Asaas para finalizar sua compra
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start mb-6 bounce-in">
          <Info className="text-blue-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Importante</h4>
            <p className="text-sm text-blue-700 mt-1">
              Todos seus dados serão informados na plataforma segura de pagamentos Asaas.
            </p>
          </div>
        </div>
        
        {/* Resumo do pedido */}
        <div className="mt-6 pt-4 border-t border-gray-200 slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-medium text-lg mb-2">Resumo do Pedido</h3>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Plano</span>
            <span className="font-medium">{plan?.name}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Forma de pagamento</span>
            <span className="font-medium">
              {selectedPaymentMethod === "credit_installment" ? "Cartão de crédito" : "À vista (PIX/Boleto)"}
            </span>
          </div>
          
          <div className="flex justify-between font-medium text-lg mt-2">
            <span>Total</span>
            <span>R$ {formatCurrency(getPaymentAmount())}</span>
          </div>
        </div>
        
        <div className="pt-4 mt-4 slide-up" style={{ animationDelay: '0.35s' }}>
          <Button 
            onClick={onPaymentRedirect} 
            className="w-full hover-raise payment-button-transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="typing-dots">Processando</span>
              </>
            ) : (
              <>
                Prosseguir para pagamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          {onBack && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack} 
              className="w-full mt-2 hover-raise"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para seleção de plano
            </Button>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Lock className="mr-1 h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Pagamento Seguro</span>
          </div>
          <div className="flex items-center">
            <Shield className="mr-1 h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Dados Protegidos</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
