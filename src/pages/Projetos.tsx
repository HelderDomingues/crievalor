
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectExamples from "@/components/projects/ProjectExamples";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Projetos = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
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
