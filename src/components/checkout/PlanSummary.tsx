import React, { useState } from "react";
import { subscriptionService } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Mail, Phone, AlertCircle, Shield, Lock, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
interface PlanSummaryProps {
  planId: string;
  onContinue: () => void;
}
const PlanSummary = ({
  planId,
  onContinue
}: PlanSummaryProps) => {
  const plan = subscriptionService.getPlanFromId(planId);
  const {
    toast
  } = useToast();

  // Estado para armazenar a opção de pagamento selecionada
  const [paymentMethod, setPaymentMethod] = useState<"credit_installment" | "credit_cash" | "pix" | "boleto">("credit_installment");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!plan) {
    return <div className="text-center p-8">
        <p className="text-muted-foreground">Plano não encontrado.</p>
      </div>;
  }

  // Função para validar número de telefone brasileiro
  const isValidPhone = (phoneNumber: string) => {
    // Aceita formatos: (XX) XXXXX-XXXX ou XXXXXXXXXXX
    const phoneRegex = /^(\(\d{2}\)\s?)?\d{5}-?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Função para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleRedirect = async () => {
    // Validar campos do formulário
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, forneça um email válido para continuar.",
        variant: "destructive"
      });
      return;
    }
    if (!isValidPhone(phone)) {
      toast({
        title: "Telefone/WhatsApp inválido",
        description: "Por favor, forneça um número de telefone válido no formato (XX) XXXXX-XXXX.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Salvar informações no localStorage para recuperação posterior
      localStorage.setItem('customerEmail', email);
      localStorage.setItem('customerPhone', phone);
      localStorage.setItem('paymentMethod', paymentMethod);
      localStorage.setItem('paymentTimestamp', Date.now().toString());
      localStorage.setItem('planName', plan.name);
      if ('price' in plan) {
        localStorage.setItem('planPrice', getPaymentAmount().toString());
      }

      // Mostrar toast de sucesso
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para a página de pagamento da Asaas.",
        variant: "default"
      });

      // Abrir página de pagamento da Asaas em nova aba
      window.open("https://sandbox.asaas.com/c/vydr3n77kew5fd4s", "_blank");
    } catch (error) {
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcula o valor do pagamento com base no método de pagamento selecionado
  const getPaymentAmount = () => {
    if (!('price' in plan)) return 0;
    switch (paymentMethod) {
      case "credit_installment":
        return plan.totalPrice;
      // Preço total parcelado
      case "credit_cash":
        return plan.cashPrice;
      // 10% de desconto
      case "pix":
        // 15% de desconto para PIX
        return plan.totalPrice * 0.85;
      case "boleto":
        return plan.cashPrice;
      // 10% de desconto, mesmo que cartão à vista
      default:
        return plan.totalPrice;
    }
  };

  // Formata o valor para exibição em reais
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace('.', ',');
  };

  // Componente para exibir apenas se o plano tiver preço
  const PriceDisplay = () => {
    if (!('price' in plan)) return null;
    return <div className="mt-1">
        <div className="flex items-baseline">
          <span className="text-sm mr-1">até 12x de</span>
          <span className="text-3xl font-bold">
            R$ {formatCurrency(plan.price)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>total a prazo: R$ {formatCurrency(plan.totalPrice)}</span>
        </div>
        <div className="text-sm mt-1">
          Ou R$ {formatCurrency(plan.cashPrice)} à vista
        </div>
      </div>;
  };
  return <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Você escolheu o plano {plan.name}</h1>
        <p className="text-muted-foreground mt-2">
          Confirme os detalhes do seu plano e escolha a forma de pagamento.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detalhes do plano */}
        <Card className="overflow-hidden border-primary/20">
          <div className="bg-primary/5 p-4 border-b border-primary/10">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <PriceDisplay />
            {'customPrice' in plan && plan.customPrice && <div className="text-lg font-medium mt-1">Sob Consulta</div>}
          </div>
          
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">O que está incluído:</h4>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => <li key={index} className="flex">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>)}
            </ul>
          </CardContent>
        </Card>
        
        {/* Formulário de pagamento e contato */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Forma de pagamento</CardTitle>
              <CardDescription>
                Escolha como deseja efetuar o pagamento da sua assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={value => setPaymentMethod(value as "credit_installment" | "credit_cash" | "pix" | "boleto")} className="space-y-4">
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="credit_installment" id="payment-credit-installment" />
                  <label htmlFor="payment-credit-installment" className="flex items-center cursor-pointer w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span className="flex-1">Cartão de Crédito Em Até 12X</span>
                    {'price' in plan && <span className="font-semibold text-sm">
                        12x R$ {formatCurrency(plan.price)}
                      </span>}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="credit_cash" id="payment-credit-cash" />
                  <label htmlFor="payment-credit-cash" className="flex items-center cursor-pointer w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span className="flex-1">Cartão de Crédito à Vista
(10% de Desconto)</span>
                    {'price' in plan && <span className="font-semibold text-sm">
                        R$ {formatCurrency(plan.cashPrice)}
                      </span>}
                  </label>
                </div>
                
                
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="boleto" id="payment-boleto" />
                  <label htmlFor="payment-boleto" className="flex items-center cursor-pointer w-full">
                    <span className="font-mono mr-2">&#x2758;&#x2758;&#x2758;</span>
                    <span className="flex-1">Pix ou Boleto bancário
(10% de desconto)</span>
                    {'price' in plan && <span className="font-semibold text-sm">
                        R$ {formatCurrency(plan.cashPrice)}
                      </span>}
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
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Seus dados de contato</CardTitle>
              <CardDescription>
                Complete com seus dados para prosseguir ao pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email">Seu email para contato</label>
                  <div className="flex relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                  </div>
                  <p className="text-xs text-muted-foreground">Enviaremos a confirmação do pagamento para este email</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone">Seu telefone/WhatsApp</label>
                  <div className="flex relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" />
                  </div>
                  <p className="text-xs text-muted-foreground">Para contato em caso de problemas com o pagamento</p>
                </div>
                
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 mt-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-amber-800">Importante</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Após o pagamento, você será redirecionado de volta ao nosso site. 
                        Caso não seja redirecionado automaticamente, volte para nossa página 
                        para confirmar o status do seu pagamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRedirect} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <>Processando...</> : <>
                    {'price' in plan ? <>Pagar R$ {formatCurrency(getPaymentAmount())} no Asaas</> : <>Prosseguir para contato</>}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Lock className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Pagamento Seguro</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Dados Protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PlanSummary;