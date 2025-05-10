
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

const Mar = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Background SplashCursor moved to hero section */}
      
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
            useSplashCursor={true}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Direcionamento Estratégico</h3>
                <p className="text-muted-foreground">Orientação clara para seu negócio navegar com confiança no mercado.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="19" r="2"/><path d="M12 17V9"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 12h2"/><path d="M19.07 10.93 17.66 12.34"/><path d="M22 12h-2"/><path d="M12 2v7"/><path d="m4.93 13.07 1.41-1.41"/><path d="M19.07 13.07 17.66 11.66"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Base Sólida</h3>
                <p className="text-muted-foreground">Fundamentação em dados e análises precisas para decisões seguras.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Resultados Acelerados</h3>
                <p className="text-muted-foreground">Implementação ágil e eficiente para rápido retorno sobre investimento.</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-primary/30">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8a2 2 0 0 1 4 0c0 2-3 3-3 3"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
