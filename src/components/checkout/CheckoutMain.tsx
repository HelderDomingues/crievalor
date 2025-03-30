
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import PlanSummary from "./PlanSummary";
import ProcessingPayment from "./ProcessingPayment";
import { errorUtils } from "@/utils/errorUtils";
import { ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ScrollIndicator from "@/components/ScrollIndicator";

// Step types for the checkout process
type CheckoutStep = "plan" | "payment" | "registration" | "processing";

// Updated PaymentType to include credit_cash
type CheckoutPaymentType = PaymentType | "credit_cash";

interface CheckoutMainProps {
  currentStep: CheckoutStep;
  selectedPlanId: string | null;
  selectedInstallments: number;
  selectedPaymentType: CheckoutPaymentType;
  error: string | null;
  processId: string;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  onPaymentTypeChange: (type: CheckoutPaymentType) => void;
  onInstallmentsChange: (installments: number) => void;
  proceedToPayment: () => Promise<void>;
}

const CheckoutMain: React.FC<CheckoutMainProps> = ({
  currentStep,
  selectedPlanId,
  selectedInstallments,
  selectedPaymentType,
  error,
  processId,
  goToNextStep,
  goToPreviousStep,
  onPaymentTypeChange,
  onInstallmentsChange,
  proceedToPayment
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  // Garantir que a página carregue pelo topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Esconder o indicador de rolagem após um tempo ou quando o usuário rolar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    const timeout = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 8000);

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);
  
  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validação básica
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setFormError("Por favor, insira um e-mail válido.");
      return;
    }
    
    // Aqui você pode implementar a lógica para salvar os dados do cliente
    // antes de redirecionar para o pagamento
    
    setIsSubmitting(true);
    
    try {
      // Salvar os dados em localStorage ou em algum serviço
      localStorage.setItem('checkoutCustomerName', name);
      localStorage.setItem('checkoutCustomerEmail', email);
      localStorage.setItem('checkoutCustomerPhone', phone);
      
      // Proceder com o pagamento
      await proceedToPayment();
    } catch (error) {
      setFormError("Ocorreu um erro ao processar seus dados. Por favor, tente novamente.");
      console.error("Error processing customer data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!selectedPlanId) {
    toast({
      title: "Plano não selecionado",
      description: "Por favor, escolha um plano para continuar.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }
  
  // Obter detalhes do plano
  const plan = subscriptionService.getPlanFromId(selectedPlanId);
  
  return (
    <div className="mt-8 mb-12 grid grid-cols-1 gap-8">
      <div className="max-w-4xl mx-auto w-full">
        {currentStep === "plan" && (
          <div className="space-y-8">
            {/* Único componente PlanSummary que inclui a seleção de pagamento e o formulário de contato */}
            <PlanSummary 
              planId={selectedPlanId} 
              onContinue={goToNextStep}
              onPaymentTypeChange={onPaymentTypeChange}
              selectedPaymentType={selectedPaymentType} 
            />
            
            {/* Mostrar o indicador de rolagem apenas quando necessário */}
            {showScrollIndicator && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <ScrollIndicator />
              </div>
            )}
          </div>
        )}
        
        {currentStep === "payment" && (
          /* Correção aqui: Retornando um null em vez de goToPreviousStep() que retorna void */
          <div>
            {/* Este step não é mais necessário, pois o PlanSummary já inclui tudo */}
            {goToPreviousStep()}
            <div>Redirecionando...</div>
          </div>
        )}
        
        {currentStep === "processing" && (
          <ProcessingPayment 
            error={error} 
            onRetry={() => proceedToPayment()} 
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutMain;
