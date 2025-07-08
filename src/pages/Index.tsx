
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
import PartnersSection from "@/components/home/PartnersSection";
import MainCTA from "@/components/home/MainCTA";
import { Helmet } from "react-helmet-async";
import { OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Index = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Crie Valor Estratégia | Consultoria e Marketing para empresas</title>
        <meta name="description" content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Consultoria estratégica, marketing e metodologia proprietária para impulsionar seus resultados." />
        <meta property="og:title" content="Crie Valor Estratégia | Consultoria e Marketing para empresas" />
        <meta property="og:description" content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Consultoria estratégica, marketing e metodologia proprietária para impulsionar seus resultados." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crie Valor Estratégia | Consultoria e Marketing" />
        <meta name="twitter:description" content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Consultoria estratégica para resultados excepcionais." />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br" />
      </Helmet>
      
      <OrganizationSchema 
        url="https://crievalor.com.br"
        logo="https://crievalor.com.br/lovable-uploads/d2f508b6-c101-4928-b7f7-161a378bb6e8.png"
      />
      
      <Header />
      
      <main className="flex-grow">
        <h1 className="sr-only">Crie Valor Estratégia - Consultoria e Marketing para empresas</h1>
        
        <HeroSection 
          title="Transforme sua empresa com estratégias personalizadas" 
          subtitle="Bem-vindo(a) à Crie Valor" 
          description="Somos especialistas em desenvolver estratégias de alto impacto que combinam a expertise humana com o poder da nossa metodologia proprietária." 
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
        <div id="clientes" aria-labelledby="clientesHeading">
          <div className="max-w-3xl mx-auto text-center mb-8 pt-16">
            <h2 id="clientesHeading" className="text-3xl md:text-4xl font-bold mb-4">
              Empresas que confiam em nós
            </h2>
            <p className="text-lg text-muted-foreground">
              Parceiros de sucesso que transformaram seus resultados com nossas soluções.
            </p>
          </div>
          <ClientLogosCarousel />
        </div>
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Partners Section */}
        <PartnersSection />
        
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
