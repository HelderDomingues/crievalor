import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, BanknoteIcon } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
interface PaymentMethodSectionProps {
  paymentMethod: "credit_installment" | "cash_payment";
  onPaymentMethodChange: (value: "credit_installment" | "cash_payment") => void;
  plan: any;
  getPaymentAmount: () => number;
  formatCurrency: (value: number) => string;
}
export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  plan,
  getPaymentAmount,
  formatCurrency
}) => {
  return <>
      <CardHeader>
        <CardTitle>Escolha a forma de pagamento</CardTitle>
        <CardDescription>
          Selecione como você deseja efetuar o pagamento da sua assinatura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={value => onPaymentMethodChange(value as "credit_installment" | "cash_payment")} className="space-y-4">
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer transition-colors">
            <RadioGroupItem value="credit_installment" id="payment-credit-installment" />
            <label htmlFor="payment-credit-installment" className="flex items-center cursor-pointer w-full">
              <CreditCard className="mr-2 h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Cartão de Crédito Em Até 10X</p>
                <p className="text-sm text-muted-foreground">Parcele em até 12x sem juros</p>
              </div>
              {'price' in plan && <div className="text-right">
                  <p className="text-base font-bold text-primary">12x R$ {formatCurrency(plan.price)}</p>
                  <p className="text-xs text-muted-foreground">total: R$ {formatCurrency(plan.totalPrice)}</p>
                </div>}
            </label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer transition-colors">
            <RadioGroupItem value="cash_payment" id="payment-cash" />
            <label htmlFor="payment-cash" className="flex items-center cursor-pointer w-full">
              <BanknoteIcon className="mr-2 h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="font-medium">
                  Pagamento à Vista <span className="text-green-600 font-semibold whitespace-nowrap">(12% de Desconto)</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Cartão, PIX ou Boleto com desconto
                </p>
              </div>
              {'price' in plan && <p className="text-base font-bold text-primary whitespace-nowrap">R$ {formatCurrency(plan.cashPrice)}</p>}
            </label>
          </div>
        </RadioGroup>
        
        <div className="mt-6 p-3 bg-primary/5 rounded-md">
          <div className="font-medium">Resumo do pagamento</div>
          <div className="flex justify-between items-center mt-2">
            <span>Total:</span>
            <span className="font-bold text-lg">
              {'price' in plan ? `R$ ${formatCurrency(getPaymentAmount())}` : 'Sob consulta'}
            </span>
          </div>
        </div>
      </CardContent>
    </>;
};