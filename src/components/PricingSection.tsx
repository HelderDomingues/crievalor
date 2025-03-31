
import React, { useEffect } from "react";
import { plans } from "./pricing/pricingData";
import PricingGrid from "./pricing/PricingGrid";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Add scroll to top effect when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleSubscribe = (planId: string) => {
    if (planId === "corporate_plan") {
      // Abrir diretamente o WhatsApp com mensagem predefinida
      const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre o Plano Corporativo.");
      window.open(`https://wa.me/5547992150289?text=${message}`, '_blank');
      return;
    }
    
    // Direct all users to subscription page with plan selected
    navigate(`/subscription?tab=plans&plan=${planId}`);
  };
  
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o MAR ideal para o seu negócio
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos diferentes níveis de serviço para atender às necessidades específicas 
            do seu negócio, desde empreendedores iniciantes até grandes corporações.
          </p>
        </div>
        
        <PricingGrid plans={plans} onSubscribe={handleSubscribe} />

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Todos os planos são pagos uma única vez e incluem todo o suporte descrito. 
            Opções de parcelamento em até 12x no cartão de crédito ou pagamento à vista com 10% de desconto.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
