
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import PlanSummary from "@/components/checkout/PlanSummary";
import PaymentSelection from "@/components/checkout/PaymentSelection";
import UserRegistration from "@/components/checkout/UserRegistration";
import ProcessingPayment from "@/components/checkout/ProcessingPayment";
import { subscriptionService, PLANS } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { checkoutRecoveryService } from "@/services/checkoutRecoveryService";
import { errorUtils } from "@/utils/errorUtils";
import { Button } from "@/components/ui/button";

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
      // Get current domain for success/cancel URLs
      const baseUrl = window.location.origin;
      
      // Save checkout state for recovery
      const recoveryState = {
        timestamp: Date.now(),
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        processId: processId
      };
      
      checkoutRecoveryService.saveRecoveryState(recoveryState);
      
      // Salvar informações importantes na localStorage antes da tentativa
      localStorage.setItem('checkoutPlanId', selectedPlanId);
      localStorage.setItem('checkoutInstallments', String(selectedInstallments));
      localStorage.setItem('checkoutPaymentType', selectedPaymentType);
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      
      console.log(`[${processId}] Iniciando processo de pagamento com:`, {
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType
      });
      
      const result = await subscriptionService.createCheckoutSession({
        planId: selectedPlanId,
        successUrl: `${baseUrl}/checkout/success`,
        cancelUrl: `${baseUrl}/checkout/canceled`,
        installments: selectedInstallments,
        paymentType: selectedPaymentType
      });
      
      // If it's a custom price plan, redirect to contact page
      if (result.isCustomPlan) {
        navigate(result.url);
        return;
      }
      
      if (!result.url) {
        throw new Error("Nenhum link de checkout foi retornado");
      }
      
      console.log(`[${processId}] Redirecting to payment page:`, result.url);
      
      // Update recovery state with the payment link
      checkoutRecoveryService.saveRecoveryState({
        ...recoveryState,
        paymentLink: result.url
      });
      
      localStorage.setItem('lastPaymentUrl', result.url);
      
      // Salvar informações adicionais antes do redirecionamento
      if (result.payment) {
        // Ensure we're storing a string for payment ID
        const paymentId = typeof result.payment === 'object' ? result.payment.id : result.payment;
        localStorage.setItem('checkoutPaymentId', paymentId);
        
        // Update recovery state with payment ID
        checkoutRecoveryService.saveRecoveryState({
          ...recoveryState,
          paymentId: paymentId
        });
      }
      
      if (result.dbSubscription?.id) {
        localStorage.setItem('checkoutSubscriptionId', result.dbSubscription.id);
        
        // Update recovery state with subscription ID
        checkoutRecoveryService.saveRecoveryState({
          ...recoveryState,
          subscriptionId: result.dbSubscription.id
        });
      }
      
      // Usar window.location.href para garantir um redirecionamento completo
      window.location.href = result.url;
    } catch (error: any) {
      // Log the error with additional context
      errorUtils.logError(error, {
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        step: currentStep
      }, processId);
      
      setError(error.message || "Não foi possível iniciar o processo de pagamento.");
      
      toast({
        title: "Erro ao processar pagamento",
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
          
          <div className="mt-8 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              {currentStep === "plan" && (
                <PlanSummary 
                  planId={selectedPlanId} 
                  onContinue={goToNextStep} 
                />
              )}
              
              {currentStep === "payment" && (
                <PaymentSelection
                  onPaymentTypeChange={handlePaymentTypeChange}
                  onInstallmentsChange={handleInstallmentsChange}
                  selectedPaymentType={selectedPaymentType}
                  selectedInstallments={selectedInstallments}
                  onContinue={goToNextStep}
                  onBack={goToPreviousStep}
                />
              )}
              
              {currentStep === "registration" && (
                <UserRegistration 
                  onContinue={goToNextStep} 
                  onBack={goToPreviousStep}
                />
              )}
              
              {currentStep === "processing" && (
                <ProcessingPayment 
                  error={error} 
                  onRetry={() => proceedToPayment()} 
                />
              )}
            </div>
            
            <div className="lg:col-span-1 order-1 lg:order-2">
              {selectedPlanId && (
                <div className="bg-card border rounded-xl p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Resumo do pedido</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plano</span>
                      <span className="font-medium">
                        {subscriptionService.getPlanFromId(selectedPlanId)?.name || "Plano selecionado"}
                      </span>
                    </div>
                    
                    {selectedPaymentType === "credit" && selectedInstallments > 1 ? (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pagamento</span>
                        <span className="font-medium">
                          {selectedInstallments}x no cartão
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pagamento</span>
                        <span className="font-medium">
                          {selectedPaymentType === "credit" ? "Cartão de crédito" : 
                           selectedPaymentType === "pix" ? "PIX" : "Boleto bancário"}
                        </span>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          {(() => {
                            const plan = subscriptionService.getPlanFromId(selectedPlanId);
                            if (!plan || !('price' in plan)) return "Sob consulta";
                            
                            const totalPrice = selectedInstallments === 1 ? plan.cashPrice : plan.totalPrice;
                            
                            if (selectedInstallments > 1) {
                              const installmentValue = totalPrice / selectedInstallments;
                              return `${selectedInstallments}x de R$ ${installmentValue.toFixed(2).replace('.', ',')}`;
                            } else {
                              return `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
