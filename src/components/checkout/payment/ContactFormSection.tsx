
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, AlertCircle, ExternalLink } from "lucide-react";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ContactFormSectionProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRedirect: () => void;
  isSubmitting: boolean;
  plan: any;
  getPaymentAmount: () => number;
  formatCurrency: (value: number) => string;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  handlePhoneChange,
  handleRedirect,
  isSubmitting,
  plan,
  getPaymentAmount,
  formatCurrency
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Seus dados de contato</CardTitle>
        <CardDescription>
          Complete com seus dados para prosseguir ao pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center font-medium">
              Nome completo
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex relative">
              <Input 
                id="name" 
                placeholder="Digite seu nome completo"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
                className="w-full" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center font-medium">
              Seu email para contato
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="seuemail@exemplo.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="pl-10" 
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">Enviaremos a confirmação do pagamento para este email</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="flex items-center font-medium">
              Seu telefone/WhatsApp
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(XX) XXXXX-XXXX" 
                value={phone} 
                onChange={handlePhoneChange} 
                className="pl-10" 
                required
              />
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
    </>
  );
};
