
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
import SplashCursor from "@/components/SplashCursor";
import { Anchor, LifeBuoy, Compass, Zap } from "lucide-react";

const Mar = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* SplashCursor added for fluid interactive background effect */}
      <SplashCursor 
        BACK_COLOR={{ r: 0.05, g: 0.1, b: 0.3 }}
        TRANSPARENT={true}
        DENSITY_DISSIPATION={2.8}
        VELOCITY_DISSIPATION={1.8}
        CURL={4}
        SPLAT_RADIUS={0.3}
        COLOR_UPDATE_SPEED={6}
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
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Compass className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Direcionamento Estratégico</h3>
                <p className="text-muted-foreground">Orientação clara para seu negócio navegar com confiança no mercado.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Anchor className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Base Sólida</h3>
                <p className="text-muted-foreground">Fundamentação em dados e análises precisas para decisões seguras.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Resultados Acelerados</h3>
                <p className="text-muted-foreground">Implementação ágil e eficiente para rápido retorno sobre investimento.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <LifeBuoy className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Suporte Contínuo</h3>
                <p className="text-muted-foreground">Acompanhamento personalizado durante toda a jornada de transformação.</p>
              </div>
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
