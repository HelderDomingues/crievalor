
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectExamples from "@/components/projects/ProjectExamples";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Helmet } from "react-helmet-async";

const Projetos = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Projetos sob Medida | Crie Valor Estratégia</title>
        <meta name="description" content="Desenvolvemos projetos especiais completamente customizados para atender às necessidades específicas do seu negócio." />
      </Helmet>
      
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
