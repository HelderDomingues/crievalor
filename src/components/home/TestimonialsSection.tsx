
import React from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30" id="depoimentos" aria-labelledby="depoimentosHeading">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="depoimentosHeading" className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            Transformamos a estratégia de negócios de diversas empresas. 
            Veja o que elas têm a dizer.
          </p>
        </div>
        
        <TestimonialCarousel />
        
        <div className="text-center mt-12">
          <p className="text-lg mb-6">
            Junte-se a outros negócios de sucesso e descubra como podemos impulsionar sua empresa.
          </p>
          <Button asChild>
            <Link to="/contato">
              Fale com nosso time <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
