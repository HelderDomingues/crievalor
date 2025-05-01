
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ServicesSection from "@/components/ServicesSection";
import ClientLogosCarousel from "@/components/ClientLogosCarousel";
import FeaturesSection from "@/components/home/FeaturesSection";
import MarHighlight from "@/components/home/MarHighlight";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import MainCTA from "@/components/home/MainCTA";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Transforme sua empresa com estratégias personalizadas" 
          subtitle="Bem-vindo(a) à Crie Valor" 
          description="Somos especialistas em desenvolver estratégias de alto impacto que combinam a expertise humana com o poder da inteligência artificial." 
          ctaText="Conheça o MAR" 
          ctaUrl="/mar" 
          secondaryCtaText="Fale Conosco" 
          secondaryCtaUrl="#contato" 
          useParticleWaves={true} 
        />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* MAR Product Highlight */}
        <MarHighlight />
        
        {/* Services Section */}
        <ServicesSection />
        
        {/* Client Logos Section */}
        <ClientLogosCarousel />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <MainCTA />
        
        {/* Contact Section */}
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
