
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Mail, Phone, User, CreditCard, Lock, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface DirectAsaasPaymentProps {
  planName: string;
  planPrice: number;
}

const DirectAsaasPayment: React.FC<DirectAsaasPaymentProps> = ({ planName, planPrice }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Function to validate Brazilian phone number format
  const isValidPhone = (phoneNumber: string) => {
    // Accept formats: (XX) XXXXX-XXXX or XXXXXXXXXXX
    const phoneRegex = /^(\(\d{2}\)\s?)?\d{5}-?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  // Function to validate email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleRedirect = async () => {
    // Validate form fields
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, forneça um email válido para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidPhone(phone)) {
      toast({
        title: "Telefone/WhatsApp inválido",
        description: "Por favor, forneça um número de telefone válido no formato (XX) XXXXX-XXXX.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save contact information to localStorage for retrieval later
      localStorage.setItem('customerEmail', email);
      localStorage.setItem('customerPhone', phone);
      localStorage.setItem('paymentTimestamp', Date.now().toString());
      localStorage.setItem('planName', planName);
      localStorage.setItem('planPrice', planPrice.toString());
      
      // Show success toast
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para a página de pagamento da Asaas.",
        variant: "default",
      });
      
      // Open Asaas payment page in new tab
      window.open("https://sandbox.asaas.com/c/vydr3n77kew5fd4s", "_blank");
    } catch (error) {
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Pagamento do Plano {planName}</CardTitle>
        <CardDescription>
          Complete com seus dados de contato para prosseguir ao pagamento seguro.
          Após o pagamento, enviaremos todas as informações para o email informado.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Seu email para contato</Label>
            <div className="flex relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">Enviaremos a confirmação do pagamento para este email</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Seu telefone/WhatsApp</Label>
            <div className="flex relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(XX) XXXXX-XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
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
          
          <Button 
            onClick={handleRedirect}
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processando...</>
            ) : (
              <>
                Pagar R$ {planPrice.toFixed(2).replace('.', ',')} no Asaas
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <Lock className="mr-1 h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Pagamento Seguro</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-1 h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Dados Protegidos</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-center mb-2">Certificados de Segurança</h4>
              <div className="flex justify-center items-center space-x-3">
                <div className="bg-white p-1 rounded border border-gray-200">
                  <img
                    src="https://cdn.asaas.com/assets/images/security-shield-icon.png"
                    alt="Selo de Segurança Asaas"
                    className="h-8"
                  />
                </div>
                <div className="bg-white p-1 rounded border border-gray-200">
                  <img
                    src="https://cdn.asaas.com/assets/images/pci-dss-icon.png"
                    alt="PCI Compliance"
                    className="h-8"
                  />
                </div>
                <div className="bg-white p-1 rounded border border-gray-200">
                  <img
                    src="https://cdn.asaas.com/assets/images/ssl-icon.png"
                    alt="SSL Secure"
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <CreditCard className="mr-1 h-3 w-3" />
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                <span>Confirmação por email</span>
              </div>
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                <span>Suporte ao cliente</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-3 w-3" />
                <span>Suporte por telefone</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-0 pb-4 text-xs text-muted-foreground">
        <p>Pagamento processado por Asaas - Líder em pagamentos no Brasil</p>
      </CardFooter>
    </Card>
  );
};

export default DirectAsaasPayment;
