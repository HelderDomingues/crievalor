
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  BarChart, 
  Phone,
  Mail,
  CalendarCheck,
  ExternalLink
} from "lucide-react";

interface AlternativePaymentOptionsProps {
  planName: string;
  planPrice: number;
}

const AlternativePaymentOptions: React.FC<AlternativePaymentOptionsProps> = ({ planName, planPrice }) => {
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre o plano ${planName} de R$ ${planPrice.toFixed(2).replace('.', ',')} e formas alternativas de pagamento.`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };
  
  const openEmail = () => {
    const subject = encodeURIComponent(`Interesse no plano ${planName}`);
    const body = encodeURIComponent(
      `Olá,\n\nGostaria de saber mais sobre o plano ${planName} de R$ ${planPrice.toFixed(2).replace('.', ',')} e formas alternativas de pagamento.\n\nAguardo retorno.`
    );
    window.open(`mailto:contato@crievalor.com.br?subject=${subject}&body=${body}`, '_blank');
  };
  
  const openScheduler = () => {
    // Redirect to a scheduling page (e.g., Calendly)
    window.open('https://calendly.com/crievalor', '_blank');
  };

  return (
    <div className="mt-10">
      <Separator className="my-6" />
      
      <h3 className="text-lg font-semibold mb-4">Outras opções de aquisição</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 flex flex-col items-center text-center">
          <Phone className="h-10 w-10 mb-3 text-primary" />
          <h4 className="font-medium mb-2">Contato por WhatsApp</h4>
          <p className="text-sm text-muted-foreground mb-4">Fale com nossa equipe sobre formas alternativas de pagamento.</p>
          <Button variant="outline" onClick={openWhatsApp} className="mt-auto">
            WhatsApp
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 flex flex-col items-center text-center">
          <Mail className="h-10 w-10 mb-3 text-primary" />
          <h4 className="font-medium mb-2">Enviar email</h4>
          <p className="text-sm text-muted-foreground mb-4">Solicite uma proposta personalizada por email.</p>
          <Button variant="outline" onClick={openEmail} className="mt-auto">
            Email
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 flex flex-col items-center text-center">
          <CalendarCheck className="h-10 w-10 mb-3 text-primary" />
          <h4 className="font-medium mb-2">Agendar conversa</h4>
          <p className="text-sm text-muted-foreground mb-4">Agende uma conversa com nossa equipe comercial.</p>
          <Button variant="outline" onClick={openScheduler} className="mt-auto">
            Agendar
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlternativePaymentOptions;
