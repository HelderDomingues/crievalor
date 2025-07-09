
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
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Como funciona o desenvolvimento de projetos sob medida?</h3>
                  <p className="text-muted-foreground">Iniciamos com um diagnóstico detalhado das suas necessidades específicas, seguido pela elaboração de uma proposta customizada. O projeto é desenvolvido em etapas com acompanhamento contínuo e entregas parciais.</p>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Qual é o prazo para desenvolvimento de um projeto?</h3>
                  <p className="text-muted-foreground">O prazo varia conforme a complexidade e escopo do projeto. Projetos simples podem ser entregues em 30-45 dias, enquanto projetos mais complexos podem levar de 3 a 6 meses para conclusão.</p>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Que tipo de projetos vocês desenvolvem?</h3>
                  <p className="text-muted-foreground">Desenvolvemos uma ampla gama de projetos: sistemas de gestão customizados, processos operacionais específicos, estratégias de mercado únicas, soluções digitais personalizadas e qualquer demanda que requeira abordagem sob medida.</p>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Como é feito o acompanhamento do projeto?</h3>
                  <p className="text-muted-foreground">Mantemos comunicação constante através de reuniões periódicas, relatórios de progresso e acesso a uma plataforma onde você pode acompanhar o desenvolvimento em tempo real.</p>
                </div>
                
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Oferecem suporte pós-entrega?</h3>
                  <p className="text-muted-foreground">Sim, todos os projetos incluem período de garantia e suporte pós-entrega. Também oferecemos treinamento para sua equipe e documentação completa para facilitar a implementação e manutenção.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Projetos;
