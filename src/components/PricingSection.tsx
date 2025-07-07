import React, { useEffect } from "react";
import { plans } from "./pricing/pricingData";
import PricingGrid from "./pricing/PricingGrid";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
const PricingSection = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  // Add scroll to top effect when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubscribe = (planId: string) => {
    // Direct all users straight to checkout with plan selected, regardless of auth status
    // The checkout flow will handle authentication if needed
    navigate(`/checkout?plan=${planId}`);
  };
  return <section id="pricing" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <span className="text-primary font-medium px-4 py-2 bg-primary/20 rounded-full text-sm">
              ✨ Oferta Especial
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transforme seu negócio com o 
            <span className="text-primary"> MAR</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            A combinação perfeita de expertise humana e inteligência artificial para criar o planejamento estratégico que seu negócio precisa para crescer de forma sustentável.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Pagamento parcelado em até 12x
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              10% de desconto à vista
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Suporte especializado incluído
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <PricingGrid plans={plans} onSubscribe={handleSubscribe} />
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Investimento único com todo o suporte descrito. Opções de parcelamento em até 10x no cartão de crédito ou pagamento à vista com 12% de desconto.</p>
        </div>
      </div>
    </section>;
};
export default PricingSection;