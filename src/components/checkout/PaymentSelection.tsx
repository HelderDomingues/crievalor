
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, BadgePercent, Calendar, CreditCard } from "lucide-react";
import { PaymentType } from "@/components/pricing/PaymentOptions";

interface PaymentSelectionProps {
  onPaymentTypeChange: (type: PaymentType) => void;
  onInstallmentsChange: (installments: number) => void;
  selectedPaymentType: PaymentType;
  selectedInstallments: number;
  onContinue: () => void;
  onBack: () => void;
}

const PaymentSelection = ({
  onPaymentTypeChange,
  onInstallmentsChange,
  selectedPaymentType,
  selectedInstallments,
  onContinue,
  onBack
}: PaymentSelectionProps) => {
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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Escolha como deseja pagar</h1>
        <p className="text-muted-foreground mt-2">
          Selecione a forma de pagamento e as condições que melhor se adaptam a você.
        </p>
      </div>
      
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Forma de pagamento</h3>
        
        <RadioGroup 
          value={selectedPaymentType}
          onValueChange={(v) => onPaymentTypeChange(v as PaymentType)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className={`flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/20 transition-colors ${selectedPaymentType === 'credit' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="flex items-center cursor-pointer w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Cartão de crédito</span>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/20 transition-colors ${selectedPaymentType === 'pix' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix" className="flex items-center cursor-pointer w-full">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 10l8 3 8-3-8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 22l8-4 8 4M4 16l8-4 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>PIX</span>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/20 transition-colors ${selectedPaymentType === 'boleto' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
            <RadioGroupItem value="boleto" id="boleto" />
            <Label htmlFor="boleto" className="flex items-center cursor-pointer w-full">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 14.25h18M3 18.75h13.5M3 9.75h18M7.5 5.25h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Boleto bancário</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {selectedPaymentType === "credit" && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Parcelamento</h3>
            <span className="text-xl font-bold text-primary">
              {installmentLabels[selectedInstallments as keyof typeof installmentLabels]}
            </span>
          </div>
          
          <Slider
            value={[selectedInstallments]}
            onValueChange={(values) => onInstallmentsChange(values[0])}
            min={1}
            max={12}
            step={1}
            className="my-6"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>À vista</span>
            <span>12x</span>
          </div>
          
          <div className="mt-6 flex items-center">
            {selectedInstallments === 1 ? (
              <div className="flex items-center text-green-600">
                <BadgePercent className="h-5 w-5 mr-2" />
                <span className="font-medium">10% de desconto no pagamento à vista</span>
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Parcelamento em {selectedInstallments}x sem juros</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para plano
        </Button>
        
        <Button onClick={onContinue}>
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaymentSelection;
