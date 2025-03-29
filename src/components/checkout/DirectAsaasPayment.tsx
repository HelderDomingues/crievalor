
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Mail, Phone, User, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DirectAsaasPaymentProps {
  planName: string;
  planPrice: number;
}

const DirectAsaasPayment: React.FC<DirectAsaasPaymentProps> = ({ planName, planPrice }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  const handleRedirect = () => {
    if (!email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, forneça um email válido para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    // Open Asaas payment page in new tab
    // This link should be the direct link to your payment in Asaas
    window.open("https://sandbox.asaas.com/c/127675828", "_blank");
    
    toast({
      title: "Redirecionando para pagamento",
      description: "Você será redirecionado para a página de pagamento da Asaas.",
      variant: "default",
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Pagamento Rápido</CardTitle>
        <CardDescription>
          Você também pode efetuar o pagamento diretamente na plataforma Asaas. 
          Após o pagamento, enviaremos todas as informações para o email informado.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Seu email</Label>
            <div className="flex">
              <Input 
                id="email" 
                type="email" 
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                onClick={handleRedirect}
                className="rounded-l-none"
                variant="secondary"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleRedirect}
            className="w-full"
          >
            Pagar R$ {planPrice.toFixed(2).replace('.', ',')} no Asaas
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>
              Ao clicar neste botão, você será redirecionado para a página de pagamento segura da Asaas.
            </p>
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
    </Card>
  );
};

export default DirectAsaasPayment;
