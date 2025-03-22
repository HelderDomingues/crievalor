
import React, { useEffect, useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface HeroCarouselProps {
  images: string[];
  interval?: number; // Tempo em ms para trocar automaticamente as imagens
  children?: React.ReactNode;
}

const HeroCarousel = ({ images, interval = 5000, children }: HeroCarouselProps) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  // Configurar a mudança automática de slides
  useEffect(() => {
    if (!api) return;

    // Listener para atualizar o índice atual
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    // Timer para mudar automaticamente os slides
    const autoplayInterval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, interval);
    
    // Limpar listeners quando o componente for desmontado
    return () => {
      api.off("select", onSelect);
      clearInterval(autoplayInterval);
    };
  }, [api, interval]);

  return (
    <div className="relative h-full">
      <Carousel setApi={setApi} className="h-full">
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <img 
                  src={image} 
                  alt={`Slide ${index + 1}`} 
                  className="object-cover w-full h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {children && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4">
              {children}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${current === index ? 'bg-primary' : 'bg-white/50'}`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
        
        <CarouselPrevious className="absolute left-4 z-20" />
        <CarouselNext className="absolute right-4 z-20" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
