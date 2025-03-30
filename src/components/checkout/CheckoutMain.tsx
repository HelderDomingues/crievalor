
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import PlanSummary from "./PlanSummary";
import PaymentSelection from "./PaymentSelection";
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
  const planMonthlyPrice = plan?.price || 179.90;
  const planTotalPrice = planMonthlyPrice * 12;
  
  return (
    <div className="mt-8 mb-12 grid grid-cols-1 gap-8">
      <div className="max-w-4xl mx-auto w-full">
        {currentStep === "plan" && (
          <div className="space-y-8">
            {/* Resumo do Plano */}
            <PlanSummary 
              planId={selectedPlanId} 
              onContinue={goToNextStep} 
            />
            
            {/* Seleção de Forma de Pagamento */}
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Escolha a forma de pagamento</CardTitle>
                <CardDescription>
                  Selecione como você deseja efetuar o pagamento do seu plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSelection 
                  selectedPaymentType={selectedPaymentType}
                  onPaymentTypeChange={onPaymentTypeChange}
                  planMonthlyPrice={planMonthlyPrice}
                  planTotalPrice={planTotalPrice}
                />
              </CardContent>
            </Card>
            
            {/* Aviso sobre a necessidade de preencher o formulário */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
              <Info className="text-blue-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Importante</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Para prosseguir com o pagamento, preencha seus dados de contato no formulário abaixo.
                  Precisamos dessas informações para completar seu pedido e enviar a confirmação.
                </p>
              </div>
            </div>
            
            {/* Formulário de Contato */}
            <Card className="border-t-4 border-t-primary" id="contact-form">
              <CardHeader>
                <CardTitle>Seus dados de contato</CardTitle>
                <CardDescription>
                  Complete com seus dados para prosseguir ao pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center">
                      Nome completo 
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Digite seu nome completo"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center">
                      Seu email para contato
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="seu@email.com"
                      required
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enviaremos a confirmação do pagamento para este email
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center">
                      Telefone/WhatsApp
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="(00) 00000-0000"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  {formError && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                      {formError}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          Continuar para pagamento
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        
        {currentStep === "payment" && (
          <PaymentSelection
            onBack={goToPreviousStep}
            selectedPaymentType={selectedPaymentType}
            onPaymentTypeChange={onPaymentTypeChange}
            onContinue={goToNextStep}
            planMonthlyPrice={planMonthlyPrice}
            planTotalPrice={planTotalPrice}
          />
        )}
        
        {currentStep === "processing" && (
          <ProcessingPayment 
            error={error} 
            onRetry={() => proceedToPayment()} 
          />
        )}
      </div>
      
      {/* Mostrar o indicador de rolagem apenas quando necessário */}
      {showScrollIndicator && currentStep === "plan" && (
        <ScrollIndicator />
      )}
    </div>
  );
};

export default CheckoutMain;
