
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Ana Silva",
    role: "CEO",
    company: "TechSolutions Inc.",
    text: "O MAR transformou completamente a nossa abordagem estratégica. Em apenas 2 semanas, tínhamos um plano completo que normalmente levaria meses para ser desenvolvido. A combinação de IA com consultoria humana é simplesmente revolucionária."
  },
  {
    name: "Pedro Mendes",
    role: "Diretor de Operações",
    company: "Inova Distribuidora",
    text: "Como uma empresa de médio porte, nunca pensamos que poderíamos ter acesso a planejamento estratégico de tão alto nível. O MAR democratizou algo que antes era exclusivo para grandes corporações."
  },
  {
    name: "Carla Rodrigues",
    role: "Fundadora",
    company: "Startup Connect",
    text: "A profundidade das análises geradas pelo MAR é impressionante. A inteligência artificial identificou oportunidades de mercado que passaram despercebidas, enquanto os consultores humanos nos ajudaram a interpretar e implementar as estratégias de maneira prática."
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const goToPrevious = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative overflow-hidden py-10">
      <div className="absolute top-6 left-0 text-primary/20">
        <Quote size={120} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div 
          className={`transition-all duration-500 ${
            isAnimating 
              ? direction === 'right' 
                ? 'opacity-0 translate-x-10' 
                : 'opacity-0 -translate-x-10'
              : 'opacity-100 translate-x-0'
          }`}
        >
          <blockquote className="text-lg md:text-xl text-foreground/90 text-center mb-6 relative">
            "{currentTestimonial.text}"
          </blockquote>
          
          <div className="text-center">
            <p className="font-medium text-primary">{currentTestimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {currentTestimonial.role}, {currentTestimonial.company}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="rounded-full text-foreground hover:text-primary hover:bg-card/50 pointer-events-auto"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="rounded-full text-foreground hover:text-primary hover:bg-card/50 pointer-events-auto"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
