
import React from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            Transformamos a estratégia de negócios de diversas empresas. 
            Veja o que elas têm a dizer.
          </p>
        </div>
        
        <TestimonialCarousel />
      </div>
    </section>
  );
};

export default TestimonialsSection;
