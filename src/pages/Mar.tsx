
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import MarExplanation from "@/components/MarExplanation";
import MarComparisonSection from "@/components/MarComparisonSection";
import PricingSection from "@/components/PricingSection";
import VideoSection from "@/components/VideoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Helmet } from "react-helmet-async";
import { ServiceSchema } from "@/components/seo/SchemaMarkup";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Mar = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <Helmet>
        <title>MAR - Mapa para Alto Rendimento | Crie Valor</title>
        <meta name="description" content="MAR - Um mapa estratégico que combina inteligência artificial e consultoria especializada para acelerar o crescimento de empresas com decisões precisas e personalizadas." />
        <meta property="og:title" content="MAR - Mapa para Alto Rendimento | Crie Valor" />
        <meta property="og:description" content="Um mapa estratégico que combina inteligência artificial e consultoria especializada para acelerar o crescimento de empresas com decisões precisas." />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://crievalor.com.br/mar" />
        <meta property="og:image" content="https://crievalor.com.br/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MAR - Mapa para Alto Rendimento | Crie Valor" />
        <meta name="twitter:description" content="Estratégias que funcionam: IA + consultoria especializada para acelerar seu crescimento empresarial." />
        <meta name="twitter:image" content="https://crievalor.com.br/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" />
        <link rel="canonical" href="https://crievalor.com.br/mar" />
      </Helmet>
      
      <ServiceSchema 
        name="MAR - Mapa para Alto Rendimento"
        description="Um mapa estratégico que combina inteligência artificial e consultoria especializada para acelerar o crescimento de empresas com decisões precisas e personalizadas."
        provider={{
          name: "Crie Valor Estratégia",
          url: "https://crievalor.com.br"
        }}
        url="https://crievalor.com.br/mar"
        areaServed="Brasil"
      />
      
      <Header />
      
      <main className="flex-grow relative z-10">
        <ErrorBoundary>
          <HeroSection
            title="MAR - Mapa para Alto Rendimento"
            subtitle="Estratégias que Funcionam"
            description="Um mapa estratégico que combina inteligência artificial e consultoria especializada para acelerar o crescimento de empresas com decisões precisas e personalizadas."
            ctaText="Quero clareza na minha rota"
            ctaUrl="#mar-explanation"
            secondaryCtaText="Descubra o MAR ideal para você"
            secondaryCtaUrl="#pricing"
            isMarHero={true}
            useMaritimeWaves={true}
          />
        </ErrorBoundary>
        
        {/* Floating visual elements */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-40 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3"></div>
        </div>
        
        {/* Features highlight */}
        <div className="relative z-10 py-12 -mt-16 bg-gradient-to-b from-transparent to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature cards removed as requested */}
            </div>
          </div>
        </div>
        
        <ErrorBoundary>
          <div className="relative overflow-hidden">
            <VideoSection 
              title="Gestão eficiente é necessidade!" 
              description="Assista ao vídeo e descubra como o MAR pode transformar a estratégia da sua empresa."
              videoUrl="https://www.youtube.com/embed/Lr_L7MAIUnM"
              videoPlaceholder="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070"
            />
            
            {/* Visual enhancement for video section */}
            <div className="absolute -z-10 w-full h-full top-0 grid-mesh opacity-20"></div>
            <div className="light-streak absolute top-1/3 left-0 rotate-[-35deg]"></div>
            <div className="light-streak absolute top-2/3 left-1/4 rotate-[-35deg]" style={{ animationDelay: "3s" }}></div>
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div id="mar-explanation" className="relative">
            <MarExplanation />
            {/* Background effect */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -z-10"></div>
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <MarComparisonSection />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div id="pricing" className="relative overflow-hidden">
            <PricingSection />
            {/* Visual enhancements for pricing section */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/20 to-transparent -z-10"></div>
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mar;
