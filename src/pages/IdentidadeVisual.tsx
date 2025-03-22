
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PortfolioGallery from "@/components/PortfolioGallery";
import ContactSection from "@/components/ContactSection";

const IdentidadeVisual = () => {
  // Example hero images - replace with your actual images
  const heroImages = [
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=2070",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2136"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Identidade Visual que Conecta e Converte"
          subtitle="Design Estratégico"
          description="Criamos identidades visuais memoráveis que refletem a essência da sua marca e causam impacto no seu público-alvo."
          ctaText="Ver Portfólio"
          ctaUrl="#portfolio"
          secondaryCtaText="Fale Conosco"
          secondaryCtaUrl="#contato"
          backgroundImages={heroImages}
        />
        
        <section id="portfolio" className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Portfólio
              </h2>
              <p className="text-lg text-muted-foreground">
                Confira alguns dos projetos de identidade visual que desenvolvemos para nossos clientes.
              </p>
            </div>
            
            <PortfolioGallery />
          </div>
        </section>
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default IdentidadeVisual;
