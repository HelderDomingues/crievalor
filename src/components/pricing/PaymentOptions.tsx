
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Calculator, BadgePercent } from "lucide-react";
import { getPaymentLink } from "@/services/marPaymentLinks";

export type PaymentType = "credit" | "cash" | "corporate";

interface PaymentOptionsProps {
  planId: string;
  planName: string;
  installments: number;
  onInstallmentsChange: (installments: number) => void;
  paymentType: PaymentType;
  onPaymentTypeChange: (paymentType: PaymentType) => void;
  price: number;
  cashPrice: number;
  onCheckout: () => void;
  isCustomPricePlan?: boolean;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  planId,
  planName,
  installments,
  onInstallmentsChange,
  paymentType,
  onPaymentTypeChange,
  price,
  cashPrice,
  onCheckout,
  isCustomPricePlan = false,
}) => {
  // For custom price plans, we skip payment options and just show contact button
  if (isCustomPricePlan) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Entre em contato</h3>
        <p className="text-sm text-muted-foreground">
          O Plano {planName} é personalizado de acordo com as necessidades específicas da sua empresa.
        </p>
        <Button 
          onClick={onCheckout} 
          className="w-full"
        >
          Falar com um consultor
        </Button>
      </div>
    );
  }

  const monthlyInstallmentValue = (price / 12).toFixed(2).replace(".", ",");
  const cashPriceFormatted = cashPrice.toFixed(2).replace(".", ",");
  const discount = Math.round(((price - cashPrice) / price) * 100);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Opções de pagamento</h3>
      
      <Tabs 
        defaultValue={paymentType} 
        onValueChange={(value) => onPaymentTypeChange(value as PaymentType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credit" className="flex items-center justify-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Cartão
          </TabsTrigger>
          <TabsTrigger value="cash" className="flex items-center justify-center">
            <BadgePercent className="h-4 w-4 mr-2" />
            À Vista
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="credit" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Valor Total:</span>
            <span className="font-medium">R$ {price.toFixed(2).replace(".", ",")}</span>
          </div>
          
          <div className="flex justify-between items-center font-medium">
            <span className="text-sm flex items-center">
              <Calculator className="h-4 w-4 mr-1" />
              Parcelas:
            </span>
            <span>12x de R$ {monthlyInstallmentValue}</span>
          </div>
          
          <Button 
            onClick={onCheckout} 
            className="w-full"
          >
            Contratar {planName}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Pagamento processado com segurança via Asaas
          </p>
        </TabsContent>
        
        <TabsContent value="cash" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">De:</span>
            <span className="line-through text-muted-foreground">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
          </div>
          
          <div className="flex justify-between items-center font-medium">
            <span className="text-sm flex items-center">
              <BadgePercent className="h-4 w-4 mr-1" />
              Valor à vista com {discount}% off:
            </span>
            <span className="text-green-600">R$ {cashPriceFormatted}</span>
          </div>
          
          <Button 
            onClick={onCheckout} 
            className="w-full"
          >
            Contratar {planName}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Pagamento processado com segurança via Asaas
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentOptions;
