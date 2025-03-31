
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { fetchClientLogos } from "@/services/clientLogosService";
import { Skeleton } from "@/components/ui/skeleton";

// Default client logos as fallback
export const clientLogos = [
  { name: "Client 1", logo: "/lovable-uploads/client1.png" },
  { name: "Client 2", logo: "/lovable-uploads/client2.png" },
  { name: "Client 3", logo: "/lovable-uploads/client3.png" },
  { name: "Client 4", logo: "/lovable-uploads/client4.png" },
  { name: "Client 5", logo: "/lovable-uploads/client5.png" },
  { name: "Client 6", logo: "/lovable-uploads/client6.png" },
];

const ClientLogosCarousel = () => {
  const [logos, setLogos] = useState(clientLogos);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLogos = async () => {
      try {
        const fetchedLogos = await fetchClientLogos();
        if (fetchedLogos && fetchedLogos.length > 0) {
          setLogos(fetchedLogos);
        }
      } catch (error) {
        console.error("Error fetching client logos:", error);
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
          <div className="animate-pulse flex justify-center space-x-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-12 w-24 bg-gray-200 rounded"></div>
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
                      className="max-h-full max-w-full object-contain filter brightness-0 invert animate-pulse-subtle"
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
