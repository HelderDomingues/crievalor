
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { fetchClientLogos } from "@/services/clientLogosService";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (error) {
    console.error("Rendering error state:", error);
  }

  console.log("Rendering logos:", logos);

  return (
    <div className="py-12 bg-background/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h3 className="text-xl md:text-2xl font-medium text-center mb-8">
          Empresas que confiam em nossa estratégia
        </h3>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent"></div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: false,
            }}
            className="w-full"
          >
            <CarouselContent className="py-4">
              {logos.map((client, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                  <div className="h-16 flex items-center justify-center p-2 opacity-70 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        console.error(`Error loading image: ${client.logo}`);
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ClientLogosCarousel;
