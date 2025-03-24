
import React from "react";
import { plans } from "./pricing/pricingData";
import PricingGrid from "./pricing/PricingGrid";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-muted/50">
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
        
        <PricingGrid plans={plans} />
      </div>
    </section>
  );
};

export default PricingSection;
