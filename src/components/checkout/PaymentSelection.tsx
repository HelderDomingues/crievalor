
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentSelectionProps {
  onBack: () => void;
  selectedPaymentType?: PaymentType;
  onPaymentTypeChange?: (type: PaymentType) => void;
  onContinue?: () => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  onBack,
  selectedPaymentType = "credit",
  onPaymentTypeChange = () => {},
  onContinue = () => {}
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-start mt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Escolha a forma de pagamento</CardTitle>
          <CardDescription>
            Selecione como você deseja efetuar o pagamento do seu plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedPaymentType}
            onValueChange={(value) => onPaymentTypeChange(value as PaymentType)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
              <RadioGroupItem value="credit" id="payment-credit" />
              <Label htmlFor="payment-credit" className="cursor-pointer w-full">
                Cartão de crédito
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
              <RadioGroupItem value="pix" id="payment-pix" />
              <Label htmlFor="payment-pix" className="cursor-pointer w-full">
                PIX
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
              <RadioGroupItem value="boleto" id="payment-boleto" />
              <Label htmlFor="payment-boleto" className="cursor-pointer w-full">
                Boleto bancário
              </Label>
            </div>
          </RadioGroup>
          
          <div className="mt-6">
            <Button onClick={onContinue} className="w-full">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSelection;
