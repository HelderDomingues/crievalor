
import React, { useState, useEffect } from "react";
import { subscriptionService } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { PaymentMethodSection } from "./payment/PaymentMethodSection";
import { PlanCard } from "./plan/PlanCard";
import { UnifiedCheckoutForm } from "./form/UnifiedCheckoutForm";
import { RegistrationFormData } from "./form/RegistrationFormSchema";
import { useAuth } from "@/context/AuthContext";
import { paymentProcessor } from "@/services/paymentProcessor";
import { checkoutRecoveryService } from "@/services/checkoutRecoveryService";

type PaymentSelectionType = PaymentType | "credit_cash";

interface PlanSummaryProps {
  planId: string;
  onContinue: () => void;
  onPaymentTypeChange?: (type: PaymentSelectionType) => void;
  selectedPaymentType?: PaymentSelectionType;
}

const PlanSummary = ({
  planId,
  onContinue,
  onPaymentTypeChange = () => {},
  selectedPaymentType = "credit"
}: PlanSummaryProps) => {
  const plan = subscriptionService.getPlanFromId(planId);
  const { toast } = useToast();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<"credit_installment" | "cash_payment">("credit_installment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processId, setProcessId] = useState<string>(`checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Definir o tipo de pagamento inicial com base no valor selecionado previamente
    if (selectedPaymentType === "pix") {
      setPaymentMethod("cash_payment");
    } else {
      setPaymentMethod("credit_installment");
    }
  }, [selectedPaymentType]);

  if (!plan) {
    return <div className="text-center p-8">
        <p className="text-muted-foreground">Plano não encontrado.</p>
      </div>;
  }

  const getPaymentAmount = () => {
    if (!('price' in plan)) return 0;
    if (paymentMethod === "credit_installment") {
      return plan.totalPrice;
    } else {
      return plan.cashPrice;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace('.', ',');
  };
  
  const handlePaymentMethodChange = (method: "credit_installment" | "cash_payment") => {
    setPaymentMethod(method);
    
    // Mapear para o tipo de pagamento esperado pelo sistema
    const paymentTypeMap: Record<string, PaymentSelectionType> = {
      credit_installment: "credit",
      cash_payment: "pix"
    };
    
    onPaymentTypeChange(paymentTypeMap[method]);
  };
  
  const handleFormSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      // Salvar o recoveryState para possibilitar recuperação futura
      const recoveryState = {
        timestamp: Date.now(),
        planId: planId,
        formData: data,
        paymentMethod,
        processId
      };
      
      checkoutRecoveryService.saveRecoveryState(recoveryState);
      
      // Processar o pagamento diretamente se for um usuário existente
      if (user) {
        // Processar pagamento para usuário existente
        const result = await paymentProcessor.processPayment({
          planId,
          installments: 1, // Ou outro valor conforme necessário
          paymentType: paymentMethod === "credit_installment" ? "credit" : "pix",
          formData: data,
          processId
        });
        
        if (result.success && result.url) {
          // Redirecionar para o link de pagamento
          window.location.href = result.url;
          return;
        } else {
          throw new Error(result.error || "Não foi possível gerar o link de pagamento");
        }
      }
      
      // Para novos usuários, precisamos primeiro criar a conta e então solicitar o pagamento
      localStorage.setItem('customerEmail', data.email);
      localStorage.setItem('customerPhone', data.phone);
      localStorage.setItem('customerName', data.fullName);
      localStorage.setItem('customerCPF', data.cpf);
      localStorage.setItem('paymentMethod', paymentMethod);
      localStorage.setItem('paymentTimestamp', Date.now().toString());
      localStorage.setItem('planName', plan.name);
      if ('price' in plan) {
        localStorage.setItem('planPrice', getPaymentAmount().toString());
      }

      // Avançar para a próxima etapa (a lógica de registro/pagamento será tratada lá)
      onContinue();
    } catch (error: any) {
      toast({
        title: "Erro ao processar",
        description: error.message || "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePaymentRedirect = async () => {
    setIsSubmitting(true);
    try {
      onContinue();
    } catch (error: any) {
      toast({
        title: "Erro ao redirecionar",
        description: error.message || "Ocorreu um erro ao redirecionar para o pagamento. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Você escolheu o plano {plan.name}</h1>
        <p className="text-muted-foreground mt-2">
          Confirme os detalhes do seu plano e escolha a forma de pagamento.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden border-primary/20">
          <PlanCard plan={plan} formatCurrency={formatCurrency} />
        </Card>
        
        <div className="space-y-6">
          <Card>
            <PaymentMethodSection 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
              plan={plan}
              getPaymentAmount={getPaymentAmount}
              formatCurrency={formatCurrency}
            />
          </Card>
          
          <UnifiedCheckoutForm
            onSubmit={handleFormSubmit}
            onPaymentRedirect={handlePaymentRedirect}
            isSubmitting={isSubmitting}
            plan={plan}
            getPaymentAmount={getPaymentAmount}
            formatCurrency={formatCurrency}
            selectedPaymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>;
};

export default PlanSummary;
