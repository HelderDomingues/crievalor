
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PricingGrid from "./pricing/PricingGrid";
import PaymentOptions from "./pricing/PaymentOptions";
import { plans } from "./pricing/pricingData";
import { useToast } from "@/hooks/use-toast";

const PricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleSubscribe = (planId: string) => {
    if (!user) {
      // Redirecionar para a página de login com return URL
      toast({
        title: "Autenticação necessária",
        description: "Faça login para assinar um plano",
      });
      navigate("/auth", { state: { returnUrl: "/subscription" } });
      return;
    }
    
    // Redirecionar para a página de assinatura com o plano selecionado
    navigate(`/subscription?plan=${planId}`);
  };

  return (
    <section id="pricing" className="py-16 md:py-24 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-64 h-64 -top-32 -left-20 opacity-10"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Invista no futuro do seu negócio
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano que melhor se adapta às necessidades da sua empresa
            e transforme sua visão em resultados concretos.
          </p>
        </div>
        
        <PricingGrid 
          plans={plans} 
          isCheckingOut={isCheckingOut}
          onSubscribe={handleSubscribe} 
        />
        
        <PaymentOptions />
      </div>
    </section>
  );
};

export default PricingSection;
