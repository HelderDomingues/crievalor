
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface PaymentSelectionProps {
  onBack?: () => void;
  selectedPaymentType?: PaymentType;
  onPaymentTypeChange?: (type: PaymentType) => void;
  onContinue?: () => void;
  planMonthlyPrice?: number;
  planTotalPrice?: number;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  onBack,
  selectedPaymentType = "credit",
  onPaymentTypeChange = () => {},
  onContinue = () => {},
  planMonthlyPrice = 179.90,
  planTotalPrice = 2158.80
}) => {
  const creditFullPrice = planTotalPrice;
  const creditCashPrice = planTotalPrice * 0.9; // 10% de desconto
  const pixPrice = planTotalPrice * 0.85; // 15% de desconto
  const boletoPrice = planTotalPrice * 0.9; // 10% de desconto

  // Links estáticos das formas de pagamento
  const paymentLinks = {
    creditInstallments: "https://sandbox.asaas.com/c/123456", // Este será substituído dinamicamente pelo link correto
    creditCash: "https://sandbox.asaas.com/c/fy15747uacorzbla",
    pixBoleto: "https://sandbox.asaas.com/c/fgcvo6dvxv3s1cbm"
  };

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
          href={paymentLinks.creditInstallments}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("credit");
            window.location.href = paymentLinks.creditInstallments;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "credit" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/5 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit" id="payment-credit" />
              <Label htmlFor="payment-credit" className="cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium group-hover:text-primary">Cartão de Crédito Em Até 12X</p>
                  <p className="text-sm text-muted-foreground">Parcele em até 12x sem juros</p>
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
          href={paymentLinks.creditCash}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("credit_cash");
            window.location.href = paymentLinks.creditCash;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "credit_cash" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/5 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit_cash" id="payment-credit-cash" />
              <Label htmlFor="payment-credit-cash" className="cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium group-hover:text-primary">Cartão de Crédito à Vista <span className="text-green-600">(10% de Desconto)</span></p>
                  <p className="text-sm text-muted-foreground">Pagamento único com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(creditCashPrice)}</p>
          </div>
        </a>

        {/* PIX (com desconto maior) */}
        <a 
          href={paymentLinks.pixBoleto}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("pix");
            window.location.href = paymentLinks.pixBoleto;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "pix" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/5 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pix" id="payment-pix" />
              <Label htmlFor="payment-pix" className="cursor-pointer flex items-center">
                <div className="h-5 w-5 mr-3 text-sky-500 font-bold text-center">PIX</div>
                <div>
                  <p className="font-medium group-hover:text-primary">Pagamento instantâneo <span className="text-green-600">(15% de Desconto)</span></p>
                  <p className="text-sm text-muted-foreground">Maior vantagem: PIX ou Boleto com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(pixPrice)}</p>
          </div>
        </a>
      </RadioGroup>

      <div className="mt-8 flex justify-center">
        <div className="animate-bounce text-primary">
          <ChevronDown className="h-6 w-6" />
          <p className="text-sm text-center">Role para baixo para continuar</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
