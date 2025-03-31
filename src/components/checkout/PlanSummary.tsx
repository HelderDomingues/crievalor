
import React, { useState, useEffect } from "react";
import { subscriptionService } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { formatPhoneNumber, isValidPhoneNumber } from "@/utils/formatters";
import { PaymentMethodSection } from "./payment/PaymentMethodSection";
import { ContactFormSection } from "./payment/ContactFormSection";
import { PlanCard } from "./plan/PlanCard";

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

  const [paymentMethod, setPaymentMethod] = useState<"credit_installment" | "cash_payment">("credit_installment");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!plan) {
    return <div className="text-center p-8">
        <p className="text-muted-foreground">Plano não encontrado.</p>
      </div>;
  }

  const paymentLinks = {
    basic_plan: {
      credit_installment: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s",
      cash_payment: "https://sandbox.asaas.com/c/fy15747uacorzbla"
    },
    pro_plan: {
      credit_installment: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon",
      cash_payment: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq"
    },
    enterprise_plan: {
      credit_installment: "https://sandbox.asaas.com/c/z4vate6zwonrwoft",
      cash_payment: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s"
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleRedirect = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, forneça seu nome completo para continuar.",
        variant: "destructive"
      });
      return;
    }
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, forneça um email válido para continuar.",
        variant: "destructive"
      });
      return;
    }
    if (!isValidPhoneNumber(phone)) {
      toast({
        title: "Telefone/WhatsApp inválido",
        description: "Por favor, forneça um número de telefone válido com DDD no formato (XX) XXXXX-XXXX.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      localStorage.setItem('customerEmail', email);
      localStorage.setItem('customerPhone', phone);
      localStorage.setItem('customerName', name);
      localStorage.setItem('paymentMethod', paymentMethod);
      localStorage.setItem('paymentTimestamp', Date.now().toString());
      localStorage.setItem('planName', plan.name);
      if ('price' in plan) {
        localStorage.setItem('planPrice', getPaymentAmount().toString());
      }

      const paymentTypeMap: Record<string, PaymentSelectionType> = {
        credit_installment: "credit",
        cash_payment: "pix"
      };
      onPaymentTypeChange(paymentTypeMap[paymentMethod]);

      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para a página de pagamento da Asaas.",
        variant: "default"
      });

      const currentPlanLinks = paymentLinks[planId as keyof typeof paymentLinks] || paymentLinks.basic_plan;
      
      let paymentLink = currentPlanLinks[paymentMethod];

      window.open(paymentLink, "_blank");
    } catch (error) {
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onPaymentMethodChange={setPaymentMethod}
              plan={plan}
              getPaymentAmount={getPaymentAmount}
              formatCurrency={formatCurrency}
            />
          </Card>
          
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
          
          <Card id="contact-form">
            <ContactFormSection 
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              handlePhoneChange={handlePhoneChange}
              handleRedirect={handleRedirect}
              isSubmitting={isSubmitting}
              plan={plan}
              getPaymentAmount={getPaymentAmount}
              formatCurrency={formatCurrency}
            />
          </Card>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Lock className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Pagamento Seguro</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Dados Protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default PlanSummary;
