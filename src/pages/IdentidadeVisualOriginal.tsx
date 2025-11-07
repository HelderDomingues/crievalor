
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PortfolioGallery from "@/components/PortfolioGallery";
import ContactSection from "@/components/ContactSection";
import { getPortfolioProjects } from "@/services/portfolioService";
import { PortfolioProject } from "@/types/portfolio";
import { Helmet } from "react-helmet-async";
import { ServiceSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const IdentidadeVisual = () => {
  useScrollToTop();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getPortfolioProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading portfolio projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Example hero images - replace with your actual images
  const heroImages = [
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=2070",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2136"
  ];
  
  // FAQ data for the FAQ schema
  const faqItems = [
    {
      question: "O que é uma identidade visual e por que minha empresa precisa?",
      answer: "Uma identidade visual é o conjunto de elementos visuais que representam sua marca, incluindo logo, cores, tipografia e aplicações. Ela é essencial para transmitir os valores da sua empresa, garantir reconhecimento e se diferenciar dos concorrentes."
    },
    {
      question: "Quanto tempo leva para desenvolver uma identidade visual completa?",
      answer: "O desenvolvimento de uma identidade visual completa geralmente leva de 30 a 60 dias, dependendo da complexidade do projeto, da quantidade de aplicações necessárias e do processo de feedback e aprovação."
    },
    {
      question: "Quais elementos são incluídos em um projeto de identidade visual?",
      answer: "Um projeto completo de identidade visual inclui: logotipo, paleta de cores, tipografia, elementos gráficos auxiliares, aplicações em papelaria (cartões de visita, papel timbrado), aplicações digitais (redes sociais, site) e manual de marca (brandbook)."
    },
    {
      question: "Como é o processo de desenvolvimento da identidade visual?",
      answer: "Nosso processo envolve: 1) Briefing e descoberta da marca; 2) Pesquisa de mercado e referências; 3) Desenvolvimento de conceitos; 4) Apresentação de propostas; 5) Refinamento da escolha; 6) Finalização e entrega do manual de marca e arquivos."
    },
    {
      question: "É possível atualizar uma identidade visual existente em vez de criar uma nova?",
      answer: "Sim, oferecemos serviços de redesign ou refresh de marca, onde atualizamos elementos da sua identidade atual para torná-la mais moderna e alinhada ao seu posicionamento atual, mantendo a essência e o reconhecimento já conquistados."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Identidade Visual | Crie Valor Estratégia</title>
        <meta name="description" content="Criamos identidades visuais memoráveis que refletem a essência da sua marca e causam impacto no seu público-alvo." />
        <meta property="og:title" content="Identidade Visual | Crie Valor Estratégia" />
        <meta property="og:description" content="Criamos identidades visuais memoráveis que refletem a essência da sua marca e causam impacto no seu público-alvo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br/identidade-visual" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Identidade Visual | Crie Valor" />
        <meta name="twitter:description" content="Design estratégico: identidades visuais memoráveis para sua marca." />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br/identidade-visual" />
      </Helmet>
      
      <ServiceSchema 
        name="Identidade Visual"
        description="Criamos identidades visuais memoráveis que refletem a essência da sua marca e causam impacto no seu público-alvo."
        provider={{
          name: "Crie Valor Estratégia",
          url: "https://crievalor.com.br"
        }}
        url="https://crievalor.com.br/identidade-visual"
        areaServed="Brasil"
      />
      
      <FAQSchema questions={faqItems} />
      
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Identidade Visual que Conecta e Converte"
          subtitle="Design Estratégico"
          description="Criamos identidades visuais memoráveis que refletem a essência da sua marca e causam impacto no seu público-alvo."
          ctaText="Ver Portfólio"
          ctaUrl="#portfolio"
          secondaryCtaText="Fale Conosco"
          secondaryCtaUrl="#contato"
          backgroundImages={heroImages}
        />
        
        <section id="portfolio" className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Portfólio
              </h2>
              <p className="text-lg text-muted-foreground">
                Confira alguns dos projetos de identidade visual que desenvolvemos para nossos clientes.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Carregando projetos...</p>
              </div>
            ) : (
              <PortfolioGallery projects={projects} />
            )}
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-6">
                {faqItems.map((faq, index) => (
                  <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
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

export default IdentidadeVisual;
