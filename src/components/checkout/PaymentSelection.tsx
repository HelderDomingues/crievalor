
import React from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft, CreditCard, CheckCircle2, ChevronDown, BanknoteIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentSelectionProps {
  onBack?: () => void;
  selectedPaymentType?: PaymentType;
  onPaymentTypeChange?: (type: PaymentType) => void;
  onContinue?: () => void;
  planMonthlyPrice?: number;
  planTotalPrice?: number;
  planId?: string;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  onBack,
  selectedPaymentType = "credit",
  onPaymentTypeChange = () => {},
  onContinue = () => {},
  planMonthlyPrice = 179.90,
  planTotalPrice = 2158.80,
  planId = "basic_plan"
}) => {
  const creditFullPrice = planTotalPrice;
  const cashPrice = planTotalPrice * 0.9; // 10% de desconto

  // Links de pagamento para cada plano
  const paymentLinks = {
    basic_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s", 
      cashPayment: "https://sandbox.asaas.com/c/fy15747uacorzbla"
    },
    pro_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon", 
      cashPayment: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq"
    },
    enterprise_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/z4vate6zwonrwoft", 
      cashPayment: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s"
    }
  };

  // Obter os links corretos com base no plano selecionado
  const currentPlanLinks = paymentLinks[planId as keyof typeof paymentLinks] || paymentLinks.basic_plan;

  const handlePaymentMethodClick = (type: PaymentType) => {
    onPaymentTypeChange(type);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <div className="flex justify-start mt-4">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      )}
      
      <RadioGroup 
        value={selectedPaymentType}
        onValueChange={(value) => onPaymentTypeChange(value as PaymentType)}
        className="space-y-4"
      >
        {/* Cartão de crédito em até 12x */}
        <a 
          href={currentPlanLinks.creditInstallments}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("credit");
            window.location.href = currentPlanLinks.creditInstallments;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "credit" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit" id="payment-credit" />
              <Label htmlFor="payment-credit" className="cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">Cartão de Crédito Em Até 12X</p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">Parcele em até 12x sem juros</p>
                </div>
              </Label>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">12x {formatCurrency(planMonthlyPrice)}</p>
              <p className="text-sm text-muted-foreground">total: {formatCurrency(creditFullPrice)}</p>
            </div>
          </div>
        </a>

        {/* Pagamento à vista com 10% de desconto (qualquer método) */}
        <a 
          href={currentPlanLinks.cashPayment}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("pix");
            window.location.href = currentPlanLinks.cashPayment;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "pix" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pix" id="payment-cash" />
              <Label htmlFor="payment-cash" className="cursor-pointer flex items-center">
                <BanknoteIcon className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Pagamento à Vista <span className="text-green-600 font-semibold">(10% de Desconto)</span>
                  </p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">
                    Cartão, PIX ou Boleto com desconto
                  </p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(cashPrice)}</p>
          </div>
        </a>
      </RadioGroup>
    </div>
  );
};

export default PaymentSelection;
