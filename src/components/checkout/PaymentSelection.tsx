
import React from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft, CreditCard, CheckCircle2, ChevronDown, BanknoteIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Updated PaymentSelectionType to include credit_cash
type PaymentSelectionType = PaymentType | "credit_cash";

interface PaymentSelectionProps {
  onBack?: () => void;
  selectedPaymentType?: PaymentSelectionType;
  onPaymentTypeChange?: (type: PaymentSelectionType) => void;
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
  const creditCashPrice = planTotalPrice * 0.9; // 10% de desconto
  const pixBoletoPrice = planTotalPrice * 0.9; // 10% de desconto (consolidado)

  // Links de pagamento para cada plano
  const paymentLinks = {
    basic_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s", 
      creditCash: "https://sandbox.asaas.com/c/fy15747uacorzbla",
      pixBoleto: "https://sandbox.asaas.com/c/fgcvo6dvxv3s1cbm"
    },
    pro_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/847xkv4ifqblmxhf", 
      creditCash: "https://sandbox.asaas.com/c/gvpg42m2zjn0oeaa",
      pixBoleto: "https://sandbox.asaas.com/c/9yoxktsjgclz9ezz"
    },
    enterprise_plan: {
      creditInstallments: "https://sandbox.asaas.com/c/6gnw7yy0v4whgnqp", 
      creditCash: "https://sandbox.asaas.com/c/32f2bm5e0c2m5b1j",
      pixBoleto: "https://sandbox.asaas.com/c/zxgbdnx23yh48ioc"
    }
  };

  // Obter os links corretos com base no plano selecionado
  const currentPlanLinks = paymentLinks[planId as keyof typeof paymentLinks] || paymentLinks.basic_plan;

  const handlePaymentMethodClick = (type: PaymentSelectionType) => {
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
        onValueChange={(value) => onPaymentTypeChange(value as PaymentSelectionType)}
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

        {/* Cartão de crédito à vista */}
        <a 
          href={currentPlanLinks.creditCash}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("credit_cash");
            window.location.href = currentPlanLinks.creditCash;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "credit_cash" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit_cash" id="payment-credit-cash" />
              <Label htmlFor="payment-credit-cash" className="cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Cartão de Crédito à Vista <span className="text-green-600 font-semibold">(10% de Desconto)</span>
                  </p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">Pagamento único com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(creditCashPrice)}</p>
          </div>
        </a>

        {/* PIX ou Boleto CONSOLIDADO com 10% de desconto */}
        <a 
          href={currentPlanLinks.pixBoleto}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("pix");
            window.location.href = currentPlanLinks.pixBoleto;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "pix" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pix" id="payment-pix-boleto" />
              <Label htmlFor="payment-pix-boleto" className="cursor-pointer flex items-center">
                <BanknoteIcon className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    PIX ou Boleto <span className="text-green-600 font-semibold">(10% de Desconto)</span>
                  </p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">Pagamento à vista com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(pixBoletoPrice)}</p>
          </div>
        </a>
      </RadioGroup>
    </div>
  );
};

export default PaymentSelection;
