import React, { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { fetchClientLogos } from "@/services/clientLogosService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Fallback logos in case of error
const fallbackLogos = [{
  name: "Cliente 1",
  logo: "/placeholder.svg"
}, {
  name: "Cliente 2",
  logo: "/placeholder.svg"
}, {
  name: "Cliente 3",
  logo: "/placeholder.svg"
}, {
  name: "Cliente 4",
  logo: "/placeholder.svg"
}, {
  name: "Cliente 5",
  logo: "/placeholder.svg"
}];
const ClientLogosCarousel = () => {
  const [logos, setLogos] = useState(fallbackLogos);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    const getLogos = async () => {
      try {
        setIsLoading(true);
        const fetchedLogos = await fetchClientLogos();
        console.log("Logos obtidos no componente:", fetchedLogos);
        if (fetchedLogos && fetchedLogos.length > 0) {
          setLogos(fetchedLogos);
        } else {
          console.warn("Nenhum logo encontrado, usando fallbacks");
          // Keep using fallback logos
        }
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar logos dos clientes:", err);
        toast.error("Não foi possível carregar os logos dos clientes");
        setError("Falha ao carregar logos dos clientes");
      } finally {
        setIsLoading(false);
      }
    };
    getLogos();
  }, []);

  // Set up auto-slide
  useEffect(() => {
    if (api) {
      // Clear any existing interval
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      // Set up new interval for auto-sliding
      intervalRef.current = window.setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [api]);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    console.error(`Erro ao carregar imagem do logo ${index}`);
    e.currentTarget.src = "/placeholder.svg";
  };
  if (isLoading) {
    return <div className="py-12 bg-background/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl md:text-2xl font-medium mb-8">
            Empresas que confiam em nossa estratégia
          </h3>
          <div className="flex justify-center space-x-8">
            {[1, 2, 3, 4, 5].map(item => <Skeleton key={item} className="h-16 w-24 rounded-md" />)}
          </div>
        </div>
      </div>;
  }
  return <div className="py-12 bg-background/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h3 className="text-xl md:text-2xl font-medium text-center mb-8">
          Empresas que confiam em nossa estratégia
        </h3>
        
        <div className="relative mx-10"> {/* Espaço para as setas de navegação */}
          <Carousel setApi={setApi} opts={{
          align: "start",
          loop: true,
          dragFree: true
        }} className="w-full">
            <CarouselContent className="py-4">
              {logos.map((client, index) => <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4 px-[30px]">
                  <div className="h-20 flex items-center justify-center p-2 transition-all duration-300 hover:scale-105 border border-transparent hover:border-gray-200 rounded-md">
                    <img src={client.logo} alt={`${client.name} logo`} onError={e => handleImageError(e, index)} className="max-h-full max-w-full object-scale-down" />
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            
            {/* Setas de navegação visíveis */}
            <CarouselPrevious className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 shadow-md text-gray-800" />
            <CarouselNext className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 shadow-md text-base text-gray-800" />
          </Carousel>
        </div>
        
        {error && <div className="text-red-500 text-center mt-4">
            {error}
          </div>}
      </div>
    </div>;
};
export default ClientLogosCarousel;