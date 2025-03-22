
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import MarExplanation from "@/components/MarExplanation";
import PricingSection from "@/components/PricingSection";
import VideoSection from "@/components/VideoSection";

const Mar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="MAR - Mapa para Alto Rendimento"
          subtitle="Estratégias que Funcionam"
          description="Uma abordagem inovadora que combina inteligência artificial com consultoria humana para desenvolver estratégias de negócios eficazes."
          ctaText="Conheça o MAR"
          ctaUrl="#mar-explanation"
          secondaryCtaText="Solicitar Proposta"
          secondaryCtaUrl="#contato"
          isMarHero={true}
        />
        
        <VideoSection 
          title="Conheça o MAR em detalhes" 
          description="Assista ao vídeo e descubra como o MAR pode transformar a estratégia da sua empresa."
          videoPlaceholder="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070"
        />
        
        <MarExplanation />
        
        <PricingSection />
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Mar;
