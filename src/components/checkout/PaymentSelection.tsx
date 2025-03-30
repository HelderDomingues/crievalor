
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft, CreditCard, CheckCircle2, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  // Links estáticos das formas de pagamento - updated as requested
  const paymentLinks = {
    creditInstallments: "https://sandbox.asaas.com/c/123456", // Este será substituído dinamicamente pelo link correto
    creditCash: "https://sandbox.asaas.com/c/fy15747uacorzbla",
    pixBoleto: "https://sandbox.asaas.com/c/fgcvo6dvxv3s1cbm"  // Link consolidado para PIX e Boleto
  };

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
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit" id="payment-credit" />
              <Label htmlFor="payment-credit" className="cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-primary group-hover:text-primary/90 transition-colors" />
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
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit_cash" id="payment-credit-cash" />
              <Label htmlFor="payment-credit-cash" className="cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-primary group-hover:text-primary/90 transition-colors" />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">Cartão de Crédito à Vista <span className="text-green-600 font-semibold">(-10%)</span></p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">Pagamento único com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(creditCashPrice)}</p>
          </div>
        </a>

        {/* PIX */}
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
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pix" id="payment-pix" />
              <Label htmlFor="payment-pix" className="cursor-pointer flex items-center">
                <div className="h-5 w-5 mr-3 text-sky-500 font-bold text-center group-hover:text-sky-600 transition-colors">PIX</div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">Pagamento instantâneo <span className="text-green-600 font-semibold">(-15%)</span></p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">Maior vantagem: PIX com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(pixPrice)}</p>
          </div>
        </a>

        {/* Boleto bancário */}
        <a 
          href={paymentLinks.pixBoleto}
          className="block"
          onClick={(e) => { 
            e.preventDefault(); 
            handlePaymentMethodClick("boleto");
            window.location.href = paymentLinks.pixBoleto;
          }}
        >
          <div className={`
            flex items-center justify-between border rounded-lg p-4 
            ${selectedPaymentType === "boleto" ? "bg-primary/10 border-primary" : "border-input"}
            hover:bg-primary/20 transition-colors group cursor-pointer
          `}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="boleto" id="payment-boleto" />
              <Label htmlFor="payment-boleto" className="cursor-pointer flex items-center">
                <div className="h-5 w-5 mr-3 font-bold text-center group-hover:text-gray-700 transition-colors">|||</div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">Boleto bancário <span className="text-green-600 font-semibold">(-10%)</span></p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">Pagamento via boleto com desconto</p>
                </div>
              </Label>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(boletoPrice)}</p>
          </div>
        </a>
      </RadioGroup>

      <div className="mt-8 flex justify-center text-primary">
        <div className="flex flex-col items-center animate-pulse-subtle">
          <p className="text-sm text-center mb-1 font-medium">Preencha seus dados abaixo para continuar</p>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
