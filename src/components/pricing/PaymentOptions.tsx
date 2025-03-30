
import React, { useState } from "react";
import { BadgePercent, Calendar, CreditCard } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type PaymentType = "credit" | "credit_cash" | "pix" | "boleto";

interface PaymentOptionsProps {
  onInstallmentsChange?: (installments: number) => void;
  onPaymentTypeChange?: (paymentType: PaymentType) => void;
  selectedInstallments?: number;
  selectedPaymentType?: PaymentType;
}

const PaymentOptions = ({ 
  onInstallmentsChange,
  onPaymentTypeChange,
  selectedInstallments = 1,
  selectedPaymentType = "credit"
}: PaymentOptionsProps) => {
  const [localInstallments, setLocalInstallments] = useState(selectedInstallments);
  const [paymentType, setPaymentType] = useState<PaymentType>(selectedPaymentType);

  const handleInstallmentsChange = (value: number[]) => {
    const installments = value[0];
    setLocalInstallments(installments);
    if (onInstallmentsChange) {
      onInstallmentsChange(installments);
    }
  };

  const handlePaymentTypeChange = (value: string) => {
    const newPaymentType = value as PaymentType;
    setPaymentType(newPaymentType);
    
    // Reset installments to 1 for non-credit card options
    if (newPaymentType !== "credit" && localInstallments > 1) {
      setLocalInstallments(1);
      if (onInstallmentsChange) {
        onInstallmentsChange(1);
      }
    }
    
    if (onPaymentTypeChange) {
      onPaymentTypeChange(newPaymentType);
    }
  };

  const installmentLabels = {
    1: "À vista",
    2: "2x",
    3: "3x",
    4: "4x",
    5: "5x",
    6: "6x",
    7: "7x",
    8: "8x",
    9: "9x",
    10: "10x",
    11: "11x",
    12: "12x",
  };

  return (
    <div className="mt-12 bg-card border border-border rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-6 text-center">Opções de Pagamento</h3>
      
      <div className="mb-8">
        <RadioGroup 
          defaultValue={selectedPaymentType}
          value={paymentType}
          onValueChange={handlePaymentTypeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 border border-muted rounded-md p-4 hover:bg-muted/20 transition-colors">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="flex items-center cursor-pointer">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Cartão de crédito parcelado</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border border-muted rounded-md p-4 hover:bg-muted/20 transition-colors">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix" className="flex items-center cursor-pointer">
              <BadgePercent className="h-4 w-4 mr-2" />
              <span>Pagamento à vista (10% de desconto)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {paymentType === "credit" && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Parcelamento</h4>
            <span className="text-lg font-bold text-primary">
              {installmentLabels[localInstallments as keyof typeof installmentLabels]}
            </span>
          </div>
          
          <Slider
            defaultValue={[selectedInstallments]}
            value={[localInstallments]}
            onValueChange={handleInstallmentsChange}
            min={1}
            max={12}
            step={1}
            className="my-4"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>À vista</span>
            <span>12x</span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            {localInstallments === 1 
              ? "Pagamento à vista no cartão de crédito" 
              : `Pagamento parcelado em ${localInstallments}x sem juros no cartão de crédito`}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-secondary/10 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            {paymentType === "credit" ? (
              <Calendar className="text-primary h-6 w-6 mr-2" />
            ) : (
              <BadgePercent className="text-green-500 h-6 w-6 mr-2" />
            )}
            <h4 className="font-semibold">
              {paymentType === "credit" && localInstallments > 1 
                ? "Parcelamento" 
                : "Pagamento à vista"}
            </h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {paymentType === "credit" && localInstallments > 1
              ? `Pague em ${localInstallments}x sem juros no cartão de crédito.`
              : "Pague o valor integral em uma única parcela com desconto."}
          </p>
          
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            {paymentType === "credit" && (
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                <span>Visa, Mastercard, Elo, Amex</span>
              </div>
            )}
            
            {paymentType === "pix" && (
              <div className="flex items-center">
                <span className="text-sm">Cartão, PIX ou Boleto com 10% de desconto</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-secondary/10 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <svg className="text-primary h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <h4 className="font-semibold">Segurança</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Seus dados estão protegidos e o pagamento é processado com segurança.
          </p>
          
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Criptografia SSL</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 14L15 8M10.0858 9.08579L7.25736 11.9142C6.86684 12.3047 6.86684 12.9379 7.25736 13.3284L10.6716 16.7426C11.0621 17.1332 11.6953 17.1332 12.0858 16.7426L14.9142 13.9142M15 8H15.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>Processamento seguro</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Tem perguntas sobre os planos ou formas de pagamento?
          <a href="#contato" className="text-primary hover:text-primary/80 ml-1">
            Entre em contato com nossa equipe
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentOptions;
