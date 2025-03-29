
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

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
    window.open("https://www.asaas.com/c/127675828", "_blank");
    
    toast({
      title: "Redirecionando para pagamento",
      description: "Você será redirecionado para a página de pagamento da Asaas.",
      variant: "default",
    });
  };
  
  return (
    <div className="bg-card border rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Pagamento Rápido</h3>
      <p className="text-muted-foreground mb-4">
        Você também pode efetuar o pagamento diretamente na plataforma Asaas. 
        Após o pagamento, enviaremos todas as informações para o email informado.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Seu email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleRedirect}
          className="w-full"
        >
          Pagar R$ {planPrice.toFixed(2).replace('.', ',')} no Asaas
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Ao clicar neste botão, você será redirecionado para a página de pagamento segura da Asaas.
        </p>
      </div>
    </div>
  );
};

export default DirectAsaasPayment;
