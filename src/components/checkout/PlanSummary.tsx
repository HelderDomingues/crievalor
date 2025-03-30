
import React, { useState } from "react";
import { subscriptionService } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PaymentOptions, { PaymentType } from "@/components/pricing/PaymentOptions";
import DirectAsaasPayment from "./DirectAsaasPayment";

interface PlanSummaryProps {
  planId: string;
  onContinue: () => void;
}

const PlanSummary = ({ planId, onContinue }: PlanSummaryProps) => {
  const plan = subscriptionService.getPlanFromId(planId);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("credit");
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [showContactForm, setShowContactForm] = useState(false);
  
  if (!plan) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Plano não encontrado.</p>
      </div>
    );
  }
  
  const handlePaymentTypeChange = (type: PaymentType) => {
    setSelectedPaymentType(type);
    // Reset installments to 1 for non-credit payment types
    if (type !== "credit") {
      setSelectedInstallments(1);
    }
  };
  
  const handleInstallmentsChange = (installments: number) => {
    setSelectedInstallments(installments);
  };
  
  const handleContinue = () => {
    setShowContactForm(true);
  };
  
  const planName = plan.name;
  const planPrice = 'price' in plan ? plan.totalPrice : 0;
  
  return (
    <div className="space-y-6">
      {!showContactForm ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Você escolheu o plano {plan.name}</h1>
            <p className="text-muted-foreground mt-2">
              Confirme os detalhes do seu plano e escolha a forma de pagamento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-primary/20">
              <div className="bg-primary/5 p-4 border-b border-primary/10">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {'price' in plan && (
                  <div className="mt-1">
                    <span className="text-2xl font-bold">
                      R$ {plan.cashPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      à vista ou em até 12x no cartão
                    </span>
                  </div>
                )}
                {'customPrice' in plan && plan.customPrice && (
                  <div className="text-lg font-medium mt-1">Sob Consulta</div>
                )}
              </div>
              
              <CardContent className="p-6">
                <h4 className="font-medium mb-4">O que está incluído:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Forma de pagamento</h2>
              <p className="text-muted-foreground mb-4">
                Escolha como deseja efetuar o pagamento da sua assinatura.
              </p>
              
              <PaymentOptions
                onPaymentTypeChange={handlePaymentTypeChange}
                onInstallmentsChange={handleInstallmentsChange}
                selectedPaymentType={selectedPaymentType}
                selectedInstallments={selectedInstallments}
              />
              
              <div className="mt-6">
                <Button onClick={handleContinue} size="lg" className="w-full">
                  Continuar para pagamento 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <DirectAsaasPayment planName={planName} planPrice={planPrice} />
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setShowContactForm(false)}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Voltar para opções de pagamento
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanSummary;
