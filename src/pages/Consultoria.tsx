import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";

const Consultoria = () => {
  // Example hero images - replace with your actual images
  const heroImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070"
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Consultoria Estratégica para Resultados"
          subtitle="Consultoria Empresarial"
          description="Soluções personalizadas para impulsionar o crescimento e a eficiência do seu negócio com base em dados e insights estratégicos."
          ctaText="Solicite uma Proposta"
          ctaUrl="#contato"
          backgroundImages={heroImages}
        />
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Consultoria;
