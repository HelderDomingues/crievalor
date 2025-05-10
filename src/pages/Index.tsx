
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
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Crie Valor Estratégia | Consultoria e Marketing para empresas</title>
        <meta name="description" content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Consultoria estratégica, marketing e ferramentas de inteligência artificial para impulsionar seus resultados." />
        <meta property="og:title" content="Crie Valor Estratégia | Consultoria e Marketing para empresas" />
        <meta property="og:description" content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Consultoria estratégica, marketing e ferramentas de inteligência artificial para impulsionar seus resultados." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crie Valor Estratégia | Consultoria e Marketing" />
        <meta name="twitter:description" content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Consultoria estratégica para resultados excepcionais." />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <h1 className="sr-only">Crie Valor Estratégia - Consultoria e Marketing para empresas</h1>
        
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
