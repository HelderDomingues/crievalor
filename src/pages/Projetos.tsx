
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectExamples from "@/components/projects/ProjectExamples";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Helmet } from "react-helmet-async";
import { ServiceSchema } from "@/components/seo/SchemaMarkup";

const Projetos = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Projetos sob Medida | Crie Valor Estratégia</title>
        <meta name="description" content="Desenvolvemos projetos especiais completamente customizados para atender às necessidades específicas do seu negócio." />
        <meta property="og:title" content="Projetos sob Medida | Crie Valor Estratégia" />
        <meta property="og:description" content="Desenvolvemos projetos especiais completamente customizados para atender às necessidades específicas do seu negócio." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br/projetos" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projetos sob Medida | Crie Valor" />
        <meta name="twitter:description" content="Soluções completamente personalizadas para as necessidades específicas do seu negócio." />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br/projetos" />
      </Helmet>
      
      <ServiceSchema 
        name="Projetos sob Medida"
        description="Desenvolvemos projetos especiais completamente customizados para atender às necessidades específicas do seu negócio."
        provider={{
          name: "Crie Valor Estratégia",
          url: "https://crievalor.com.br"
        }}
        url="https://crievalor.com.br/projetos"
        areaServed="Brasil"
      />
      
      <Header />
      
      <main className="flex-grow">
        <h1 className="sr-only">Projetos sob Medida - Crie Valor Estratégia</h1>
        
        <HeroSection
          title="Projetos sob Medida"
          subtitle="Soluções Customizadas"
          description="Desenvolvemos projetos especiais completamente customizados para atender às necessidades específicas do seu negócio."
          ctaText="Solicite uma Proposta"
          ctaUrl="#contato"
          secondaryCtaText="Ver Exemplos"
          secondaryCtaUrl="#exemplos"
        />
        
        <ProjectOverview />
        <ProjectExamples />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Projetos;
