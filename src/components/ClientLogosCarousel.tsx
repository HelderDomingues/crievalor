
import React, { useState, useEffect, useRef } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from "@/components/ui/carousel";
import { fetchClientLogos } from "@/services/clientLogosService";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fallback logos in case of error
const fallbackLogos = [
  { name: "Client 1", logo: "/placeholder.svg" },
  { name: "Client 2", logo: "/placeholder.svg" },
  { name: "Client 3", logo: "/placeholder.svg" },
  { name: "Client 4", logo: "/placeholder.svg" },
  { name: "Client 5", logo: "/placeholder.svg" },
];

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
        console.log("Fetched logos in component:", fetchedLogos);
        
        if (fetchedLogos && fetchedLogos.length > 0) {
          setLogos(fetchedLogos);
        } else {
          console.warn("No logos fetched from service, using fallbacks");
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching client logos:", err);
        setError("Failed to load client logos");
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
    console.error(`Error loading logo image at index ${index}`);
    e.currentTarget.src = "/placeholder.svg"; 
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-background/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl md:text-2xl font-medium mb-8">
            Empresas que confiam em nossa estratégia
          </h3>
          <div className="flex justify-center space-x-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-16 w-24 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h3 className="text-xl md:text-2xl font-medium text-center mb-8">
          Empresas que confiam em nossa estratégia
        </h3>
        
        <div className="relative px-10 md:px-12"> {/* Add padding for arrows */}
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="py-4">
              {logos.map((client, index) => (
                <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                  <div className="h-20 flex items-center justify-center p-2 hover:opacity-100 transition-opacity duration-300 hover:scale-105">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => handleImageError(e, index)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Make arrows visible and position them properly */}
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background border border-border shadow-md" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background border border-border shadow-md" />
          </Carousel>
        </div>
        
        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientLogosCarousel;
