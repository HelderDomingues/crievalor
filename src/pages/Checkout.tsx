
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { subscriptionService } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { checkoutRecoveryService } from "@/services/checkoutRecoveryService";
import { errorUtils } from "@/utils/errorUtils";
import { Button } from "@/components/ui/button";
import CheckoutMain from "@/components/checkout/CheckoutMain";
import { paymentProcessor } from "@/services/paymentProcessor";

// Step types for the checkout process
type CheckoutStep = "plan" | "payment" | "registration" | "processing";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get plan ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan");
  
  // State management
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("plan");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(planId);
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string>(`checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Plan validation on load
  useEffect(() => {
    if (!planId) {
      navigate("/");
      toast({
        title: "Plano não selecionado",
        description: "Por favor, escolha um plano para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    // Redirect to WhatsApp if corporate plan is selected
    if (planId === "corporate_plan") {
      window.location.href = "https://wa.me/+5547992152089";
      return;
    }
    
    const plan = subscriptionService.getPlanFromId(planId);
    if (!plan) {
      navigate("/");
      toast({
        title: "Plano inválido",
        description: "O plano selecionado não existe.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedPlanId(planId);
    
    // Check for a recovery state on initial load
    const recoveryState = checkoutRecoveryService.getRecoveryState();
    
    if (recoveryState && checkoutRecoveryService.isStateValid(recoveryState, planId)) {
      console.log(`[${processId}] Found valid recovery state:`, recoveryState);
      
      // Restore saved state
      if (recoveryState.installments) {
        setSelectedInstallments(recoveryState.installments);
      }
      
      if (recoveryState.paymentType) {
        setSelectedPaymentType(recoveryState.paymentType as PaymentType);
      }
      
      if (recoveryState.paymentLink) {
        // If we have a payment link, check if we're in a recent session
        const isRecent = Date.now() - recoveryState.timestamp < 10 * 60 * 1000;
        
        if (isRecent) {
          console.log(`[${processId}] Found recent payment link, will prompt user for recovery`);
          
          toast({
            title: "Sessão de pagamento encontrada",
            description: "Encontramos uma sessão de pagamento pendente. Deseja continuar de onde parou?",
            variant: "default",
            action: (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsRecovering(true);
                  window.location.href = recoveryState.paymentLink as string;
                }}
              >
                Continuar
              </Button>
            ),
          });
        }
      }
    }
  }, [planId, navigate, toast, processId]);
  
  // Recuperar valores do localStorage, se existirem
  useEffect(() => {
    const savedInstallments = localStorage.getItem('checkoutInstallments');
    const savedPaymentType = localStorage.getItem('checkoutPaymentType');
    
    if (savedInstallments) {
      setSelectedInstallments(Number(savedInstallments));
    }
    
    if (savedPaymentType) {
      setSelectedPaymentType(savedPaymentType as PaymentType);
    }
  }, []);
  
  // Atualiza a URL para manter o histórico de navegação correto
  useEffect(() => {
    // Só atualiza o histórico se não for a primeira carga da página
    if (currentStep !== "plan" && planId) {
      const newUrl = `/checkout?plan=${planId}&step=${currentStep}`;
      window.history.replaceState({ step: currentStep }, "", newUrl);
    }
  }, [currentStep, planId]);
  
  // Lida com o botão de voltar do navegador
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        setCurrentStep(event.state.step);
      } else {
        // Se não houver estado, assume-se que estamos voltando para o plano
        setCurrentStep("plan");
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  
  // Handle payment type change
  const handlePaymentTypeChange = (paymentType: PaymentType) => {
    setSelectedPaymentType(paymentType);
    // Reset installments to 1 for non-credit payment types
    if (paymentType !== "credit") {
      setSelectedInstallments(1);
    }
  };
  
  // Handle installment selection
  const handleInstallmentsChange = (installments: number) => {
    setSelectedInstallments(installments);
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    const nextStep = getNextStep();
    setCurrentStep(nextStep);
    
    // Atualiza a URL para manter o histórico de navegação correto
    if (selectedPlanId) {
      const newUrl = `/checkout?plan=${selectedPlanId}&step=${nextStep}`;
      window.history.pushState({ step: nextStep }, "", newUrl);
    }
    
    if (nextStep === "processing") {
      proceedToPayment();
    }
  };
  
  // Determina o próximo passo com base no estado atual
  const getNextStep = (): CheckoutStep => {
    if (currentStep === "plan") {
      return "payment";
    } else if (currentStep === "payment") {
      return user ? "processing" : "registration";
    } else if (currentStep === "registration") {
      return "processing";
    }
    return currentStep;
  };
  
  // Handle going back to previous step
  const goToPreviousStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("plan");
      window.history.back();
    } else if (currentStep === "registration") {
      setCurrentStep("payment");
      window.history.back();
    } else if (currentStep === "processing") {
      setCurrentStep(user ? "payment" : "registration");
      window.history.back();
    }
  };
  
  // Process payment after all required information is collected
  const proceedToPayment = async () => {
    if (!selectedPlanId) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Save checkout state for recovery
      const recoveryState = {
        timestamp: Date.now(),
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        processId: processId
      };
      
      checkoutRecoveryService.saveRecoveryState(recoveryState);
      
      // Save important information to localStorage before the attempt
      localStorage.setItem('checkoutPlanId', selectedPlanId);
      localStorage.setItem('checkoutInstallments', String(selectedInstallments));
      localStorage.setItem('checkoutPaymentType', selectedPaymentType);
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      
      // Process the payment
      const result = await paymentProcessor.processPayment({
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        processId,
        recoveryState
      });
      
      if (!result.success) {
        throw new Error(result.error || "Failed to process payment");
      }
      
      // If it's a custom price plan, redirect to contact page
      if (result.isCustomPlan) {
        navigate(result.url || "/");
        return;
      }
      
      // Update recovery state with the payment link
      const updatedState = {
        ...recoveryState,
        paymentLink: result.url
      };
      
      checkoutRecoveryService.saveRecoveryState(updatedState);
      
      // Store payment information
      paymentProcessor.storePaymentState(result, updatedState);
      
      // Redirect to the payment page
      window.location.href = result.url || "/";
    } catch (error: any) {
      // Log the error with additional context
      errorUtils.logError(error, {
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        step: currentStep
      }, processId);
      
      setError(error.message || "Could not start the payment process.");
      
      toast({
        title: "Error processing payment",
        description: errorUtils.getUserFriendlyMessage(error),
        variant: "destructive",
      });
      
      setIsProcessing(false);
    }
  };
  
  // Show loading state while validating plan
  if (!selectedPlanId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Carregando informações do plano...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <CheckoutSteps currentStep={currentStep} />
          
          <CheckoutMain 
            currentStep={currentStep}
            selectedPlanId={selectedPlanId}
            selectedInstallments={selectedInstallments}
            selectedPaymentType={selectedPaymentType}
            error={error}
            processId={processId}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            onPaymentTypeChange={handlePaymentTypeChange}
            onInstallmentsChange={handleInstallmentsChange}
            proceedToPayment={proceedToPayment}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
