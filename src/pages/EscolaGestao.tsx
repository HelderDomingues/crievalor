import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";

const EscolaGestao = () => {
  // Example hero images - replace with your actual images
  const heroImages = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074",
    "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=2083"
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Escola de Gestão"
          subtitle="Desenvolvimento Profissional"
          description="Programas de capacitação e desenvolvimento para gestores e líderes, com metodologias práticas e aplicáveis ao dia a dia empresarial."
          ctaText="Conheça os Cursos"
          ctaUrl="#cursos"
          backgroundImages={heroImages}
        />
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default EscolaGestao;
