
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ClientLogosCarousel from "@/components/ClientLogosCarousel";
import HeroCarousel from "@/components/home/HeroCarousel";
import MarHighlight from "@/components/home/MarHighlight";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PartnersSection from "@/components/home/PartnersSection";
import ServicesSections from "@/components/home/ServicesSections";
import BlogPreview from "@/components/home/BlogPreview";
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
        
        {/* Hero Carrossel - MAR + Mentorias */}
        <HeroCarousel />
        
        {/* MAR Product Highlight - Seção dedicada */}
        <MarHighlight />
        
        {/* Services Sections - Seções completas */}
        <ServicesSections />
        
        {/* Blog Preview - Conectando com o blog */}
        <BlogPreview />
        
        {/* Client Logos Section */}
        <div id="clientes" aria-labelledby="clientesHeading" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 id="clientesHeading" className="text-3xl md:text-4xl font-bold mb-4">
                Empresas que confiam em nós
              </h2>
              <p className="text-lg text-muted-foreground">
                Parceiros de sucesso que transformaram seus resultados com nossas soluções.
              </p>
            </div>
            <ClientLogosCarousel />
          </div>
        </div>
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Partners Section */}
        <PartnersSection />
        
        {/* CTA Final - Diagnóstico Gratuito */}
        <MainCTA />
        
        {/* Contact Section */}
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
