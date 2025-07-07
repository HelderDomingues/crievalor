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
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"credit_installment" | "cash_payment">("credit_installment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processId, setProcessId] = useState<string>(`checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);

    // Clear any stale data in localStorage
    if (typeof window !== "undefined") {
      const staleDataKeys = ['cachedCustomerData', 'lastPaymentAttempt', 'lastFormSubmission'];
      staleDataKeys.forEach(key => localStorage.removeItem(key));
    }

    // Definir o tipo de pagamento inicial com base no valor selecionado previamente
    if (selectedPaymentType === "pix") {
      setPaymentMethod("cash_payment");
    } else {
      setPaymentMethod("credit_installment");
    }

    // Adicionar animação de fade-in após montagem do componente
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
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
  const getPaymentUrl = () => {
    if (!plan) return '';

    // For corporate plan, return WhatsApp URL
    if (planId === "corporate_plan" && 'whatsappUrl' in plan) {
      return plan.whatsappUrl;
    }

    // For regular plans with direct payment links
    if (paymentMethod === "credit_installment" && 'creditPaymentUrl' in plan) {
      return plan.creditPaymentUrl;
    } else if (paymentMethod === "cash_payment" && 'cashPaymentUrl' in plan) {
      return plan.cashPaymentUrl;
    }

    // Fallback to old method
    return '';
  };
  const handlePaymentRedirect = async () => {
    setIsSubmitting(true);
    try {
      // Check if we have a direct payment URL
      const directPaymentUrl = getPaymentUrl();

      // If we have a direct payment URL, use it
      if (directPaymentUrl) {
        // Store information for future recovery
        localStorage.setItem('paymentMethod', paymentMethod);
        localStorage.setItem('paymentTimestamp', Date.now().toString());
        localStorage.setItem('planName', plan.name);
        if ('price' in plan) {
          localStorage.setItem('planPrice', getPaymentAmount().toString());
        }

        // Redirect to the payment URL
        window.location.href = directPaymentUrl;
        return;
      }

      // If no direct URL, use the regular payment process
      // Se for o plano corporativo, redirecionar para WhatsApp
      if (planId === "corporate_plan") {
        const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre o Plano Corporativo.");
        window.location.href = `https://wa.me/5547992150289?text=${message}`;
        return;
      }

      // Mapear o método de pagamento para o tipo esperado pelo paymentProcessor
      const paymentType: PaymentType = paymentMethod === "credit_installment" ? "credit" : "pix";

      // Armazenar informações para recuperação futura
      localStorage.setItem('paymentMethod', paymentMethod);
      localStorage.setItem('paymentTimestamp', Date.now().toString());
      localStorage.setItem('planName', plan.name);
      if ('price' in plan) {
        localStorage.setItem('planPrice', getPaymentAmount().toString());
      }

      // Definir algumas informações mínimas para o estado de recuperação
      const recoveryState = {
        timestamp: Date.now(),
        planId: planId,
        paymentMethod,
        processId
      };
      checkoutRecoveryService.saveRecoveryState(recoveryState);

      // Processar o pagamento usando o paymentProcessor
      const result = await paymentProcessor.processPayment({
        planId: planId,
        installments: 12,
        // Valor padrão para parcelamento
        paymentType: paymentType,
        processId,
        recoveryState
      });
      if (!result.success) {
        throw new Error(result.error || "Falha ao processar pagamento");
      }

      // Mostrar toast de processamento
      toast({
        title: "Processando",
        description: "Estamos preparando tudo para você...",
        variant: "default"
      });

      // Armazenar o estado do pagamento
      paymentProcessor.storePaymentState(result, recoveryState);

      // Redirecionar para o link de pagamento
      toast({
        title: "Sucesso!",
        description: "Redirecionando para o pagamento...",
        variant: "default"
      });

      // Adicionar uma pequena espera para a animação
      setTimeout(() => {
        if (result.url) {
          window.location.href = result.url;
        }
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Erro ao processar",
        description: error.message || "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  return <div className={`space-y-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center mb-8 slide-up">
        <h1 className="text-3xl font-bold">Você escolheu o plano {plan.name}</h1>
        <p className="text-muted-foreground mt-2">Confirme os detalhes do MAR e escolha a forma de pagamento.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden border-primary/20 hover-raise transition-all duration-300 slide-up">
          <PlanCard plan={plan} formatCurrency={formatCurrency} />
        </Card>
        
        <div className="space-y-6">
          <Card className="hover-raise transition-all duration-300 slide-up" style={{
          animationDelay: '0.1s'
        }}>
            <PaymentMethodSection paymentMethod={paymentMethod} onPaymentMethodChange={handlePaymentMethodChange} plan={plan} getPaymentAmount={getPaymentAmount} formatCurrency={formatCurrency} />
          </Card>
          
          <div className="slide-up" style={{
          animationDelay: '0.2s'
        }}>
            <UnifiedCheckoutForm onPaymentRedirect={handlePaymentRedirect} isSubmitting={isSubmitting} plan={plan} getPaymentAmount={getPaymentAmount} formatCurrency={formatCurrency} selectedPaymentMethod={paymentMethod} />
          </div>
        </div>
      </div>
    </div>;
};
export default PlanSummary;