import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const HeroCarousel = () => {
  const slides = [
    {
      id: 'mar',
      icon: Target,
      title: 'MAR: Mapa para Alto Rendimento',
      subtitle: 'Transforme sua empresa com nossa metodologia proprietária',
      description: 'Descubra como nosso sistema exclusivo pode acelerar seus resultados e levar sua empresa ao próximo nível de crescimento sustentável.',
      ctaText: 'Conhecer o MAR',
      ctaUrl: '/mar',
      secondaryCtaText: 'Diagnóstico Gratuito',
      secondaryCtaUrl: '/diagnostico-gratuito',
      background: 'bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5',
      iconColor: 'text-primary',
      features: [
        'Metodologia proprietária comprovada',
        'Resultados em até 90 dias',
        'Estratégias personalizadas',
        'Acompanhamento especializado'
      ]
    },
    {
      id: 'mentorias',
      icon: Users,
      title: 'Mentorias Empresariais',
      subtitle: 'Desenvolva todo o potencial da sua liderança',
      description: 'Acelere seu crescimento profissional com acompanhamento 1:1 de especialistas em gestão, marketing e recursos humanos.',
      ctaText: 'Conhecer Mentorias',
      ctaUrl: '/mentorias',
      secondaryCtaText: 'Conversar no WhatsApp',
      secondaryCtaUrl: 'https://wa.me/5547992150289?text=Tenho%20interesse%20em%20saber%20mais%20sobre%20as%20Mentorias%20Empresariais',
      background: 'bg-gradient-to-br from-purple-500/5 via-purple-500/10 to-purple-500/5',
      iconColor: 'text-purple-500',
      features: [
        'Mentoria personalizada 1:1',
        'Especialistas em gestão e marketing',
        'Planos flexíveis e sob medida',
        'Resultados mensuráveis'
      ]
    }
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-96 h-96 top-20 -left-48 opacity-10" aria-hidden="true"></div>
        <div className="blur-dot w-64 h-64 bottom-20 -right-32 opacity-10" aria-hidden="true"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Carousel className="w-full max-w-6xl mx-auto" opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <Card className={`border-0 ${slide.background}`}>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] p-8 lg:p-12">
                      {/* Content */}
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full bg-background/80 p-4 ${slide.iconColor}`}>
                            {React.createElement(slide.icon, { className: "h-8 w-8" })}
                          </div>
                          <div className="h-px bg-border flex-1"></div>
                        </div>

                        <div className="space-y-4">
                          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                            {slide.title}
                          </h1>
                          <p className="text-xl lg:text-2xl text-primary font-medium">
                            {slide.subtitle}
                          </p>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {slide.description}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {slide.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${slide.iconColor.replace('text-', 'bg-')}`}></div>
                              <span className="text-sm font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button asChild size="lg" className="text-lg">
                            <Link to={slide.ctaUrl}>
                              {slide.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="lg" className="text-lg">
                            {slide.secondaryCtaUrl.startsWith('http') ? (
                              <a href={slide.secondaryCtaUrl} target="_blank" rel="noopener noreferrer">
                                {slide.secondaryCtaText}
                              </a>
                            ) : (
                              <Link to={slide.secondaryCtaUrl}>
                                {slide.secondaryCtaText}
                              </Link>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Visual */}
                      <div className="relative">
                        <div className="relative aspect-square max-w-lg mx-auto">
                          <div className={`absolute inset-0 rounded-3xl ${slide.background} opacity-50`}></div>
                          <div className="absolute inset-4 rounded-2xl bg-background/10 backdrop-blur-sm border border-white/20"></div>
                          <div className="absolute inset-8 rounded-xl bg-background/20 backdrop-blur-sm border border-white/30"></div>
                          <div className="absolute inset-12 rounded-lg bg-background/30 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                            {React.createElement(slide.icon, { 
                              className: `h-24 w-24 ${slide.iconColor} opacity-80` 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary/30 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;