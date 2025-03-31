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
import { RegistrationFormData } from "@/components/checkout/form/RegistrationFormSchema";
import { asaasCustomerService } from "@/services/asaasCustomerService";
import { checkoutTestUtils } from "@/utils/checkoutTestUtils";

type CheckoutStep = "plan" | "processing";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan");
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("plan");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(planId);
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string>(`checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [isRecovering, setIsRecovering] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
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
    
    if (planId === "corporate_plan") {
      const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre o Plano Corporativo.");
      window.location.href = `https://wa.me/5547992150289?text=${message}`;
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
    
    if (!user) {
      localStorage.setItem('selectedPlanId', planId);
    }
    
    const recoveryState = checkoutRecoveryService.getRecoveryState();
    
    if (recoveryState && checkoutRecoveryService.isStateValid(recoveryState, planId)) {
      console.log(`[${processId}] Found valid recovery state:`, recoveryState);
      
      if (recoveryState.installments) {
        setSelectedInstallments(recoveryState.installments);
      }
      
      if (recoveryState.paymentType) {
        setSelectedPaymentType(recoveryState.paymentType as PaymentType);
      }
      
      if (recoveryState.formData) {
        setFormData(recoveryState.formData);
      }
      
      if (recoveryState.paymentLink) {
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
  }, [planId, navigate, toast, processId, user]);
  
  useEffect(() => {
    const savedInstallments = localStorage.getItem('checkoutInstallments');
    const savedPaymentType = localStorage.getItem('checkoutPaymentType');
    
    if (savedInstallments) {
      setSelectedInstallments(Number(savedInstallments));
    }
    
    if (savedPaymentType) {
      setSelectedPaymentType(savedPaymentType as PaymentType);
    }
    
    const storedEmail = localStorage.getItem('customerEmail');
    const storedPhone = localStorage.getItem('customerPhone');
    const storedName = localStorage.getItem('customerName');
    const storedCPF = localStorage.getItem('customerCPF');
    
    if (storedEmail && storedPhone && storedName && storedCPF) {
      const recoveredFormData: RegistrationFormData = {
        email: storedEmail,
        phone: storedPhone,
        fullName: storedName,
        cpf: storedCPF,
        password: '' // Senha vazia por segurança
      };
      
      setFormData(recoveredFormData);
    }
  }, []);
  
  useEffect(() => {
    if (currentStep !== "plan" && planId) {
      const newUrl = `/checkout?plan=${planId}&step=${currentStep}`;
      window.history.replaceState({ step: currentStep }, "", newUrl);
    }
  }, [currentStep, planId]);
  
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        setCurrentStep(event.state.step);
      } else {
        setCurrentStep("plan");
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  
  const handlePaymentTypeChange = (paymentType: PaymentType) => {
    setSelectedPaymentType(paymentType);
    if (paymentType !== "credit") {
      setSelectedInstallments(1);
    }
  };
  
  const handleInstallmentsChange = (installments: number) => {
    setSelectedInstallments(installments);
  };
  
  const goToNextStep = () => {
    setCurrentStep("processing");
    
    if (selectedPlanId) {
      const newUrl = `/checkout?plan=${selectedPlanId}&step=processing`;
      window.history.pushState({ step: "processing" }, "", newUrl);
    }
    
    proceedToPayment();
  };
  
  const proceedToPayment = async () => {
    if (!selectedPlanId) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const storedEmail = localStorage.getItem('customerEmail');
      const storedPhone = localStorage.getItem('customerPhone');
      const storedName = localStorage.getItem('customerName');
      const storedCPF = localStorage.getItem('customerCPF');
      
      const submittedFormData: RegistrationFormData = formData || {
        email: storedEmail || '',
        phone: storedPhone || '',
        fullName: storedName || '',
        cpf: storedCPF || '',
        password: '' // Senha vazia por segurança, será usada apenas para novos cadastros
      };
      
      if (!submittedFormData.email || !submittedFormData.phone || !submittedFormData.cpf || !submittedFormData.fullName) {
        throw new Error("Dados de formulário incompletos. Por favor, preencha todos os campos obrigatórios.");
      }
      
      const recoveryState = {
        timestamp: Date.now(),
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        processId: processId,
        formData: submittedFormData
      };
      
      checkoutRecoveryService.saveRecoveryState(recoveryState);
      
      localStorage.setItem('checkoutPlanId', selectedPlanId);
      localStorage.setItem('checkoutInstallments', String(selectedInstallments));
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      localStorage.setItem('checkoutPaymentType', selectedPaymentType);
      
      const result = await paymentProcessor.processPayment({
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        formData: submittedFormData,
        processId,
        recoveryState
      });
      
      if (!result.success) {
        throw new Error(result.error || "Failed to process payment");
      }
      
      if (result.isCustomPlan) {
        navigate(result.url || "/");
        return;
      }
      
      const updatedState = {
        ...recoveryState,
        paymentLink: result.url
      };
      
      checkoutRecoveryService.saveRecoveryState(updatedState);
      
      paymentProcessor.storePaymentState(result, updatedState);
      
      window.location.href = result.url || "/";
    } catch (error: any) {
      errorUtils.logError(error, {
        planId: selectedPlanId,
        installments: selectedInstallments,
        paymentType: selectedPaymentType,
        step: currentStep
      }, processId);
      
      setError(error.message || "Could not start the payment process.");
      
      toast({
        title: "Erro ao processar pagamento",
        description: errorUtils.getUserFriendlyMessage(error),
        variant: "destructive",
      });
      
      setIsProcessing(false);
    }
  };
  
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
  
  useEffect(() => {
    const testParam = searchParams.get("test");
    if (testParam) {
      console.log(`📋 Detectado modo de teste: ${testParam}`);
      try {
        const scenario = testParam as 'new-user' | 'existing-user' | 'recovery' | 'abandoned' | 'clear';
        checkoutTestUtils.simulateCheckoutState(scenario, { planId });
        console.log(`✅ Cenário de teste "${testParam}" configurado com sucesso`);
        
        checkoutTestUtils.verifyDataConsistency();
      } catch (error) {
        console.error("❌ Erro ao configurar cenário de teste:", error);
      }
    }
  }, [planId, searchParams]);
  
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
            goToPreviousStep={() => {}}
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
