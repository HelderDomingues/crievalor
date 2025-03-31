
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import PlanSummary from "./PlanSummary";
import ProcessingPayment from "./ProcessingPayment";
import { errorUtils } from "@/utils/errorUtils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

// Step types for the checkout process - simplificado
type CheckoutStep = "plan" | "processing";

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
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Verificar se o usuário não está autenticado e redirecionar para a página de registro
  useEffect(() => {
    if (!user && selectedPlanId) {
      // Se não estiver autenticado, salvar o plano selecionado no localStorage
      // para poder recuperá-lo após o login/registro
      localStorage.setItem('selectedPlanId', selectedPlanId);
      
      // Redirecionar para a página de autenticação
      toast({
        title: "Autenticação necessária",
        description: "Por favor, crie uma conta ou faça login para continuar com a assinatura.",
      });
      
      // Dar um pequeno atraso para o toast ser exibido
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }
  }, [user, selectedPlanId, navigate, toast]);
  
  // Garantir que a página carregue pelo topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Esconder o indicador de rolagem após um tempo ou quando o usuário rolar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    const timeout = setTimeout(() => {
      setShowScrollIndicator(false);
    }, isMobile ? 5000 : 8000); // Tempo reduzido para dispositivos móveis

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [isMobile]);
  
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
    <div className={`mt-4 md:mt-8 mb-8 md:mb-12 grid grid-cols-1 gap-6 md:gap-8`}>
      <div className="max-w-4xl mx-auto w-full px-4">
        {currentStep === "plan" && (
          <div className="space-y-6 md:space-y-8">
            {/* PlanSummary agora inclui o formulário unificado */}
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
