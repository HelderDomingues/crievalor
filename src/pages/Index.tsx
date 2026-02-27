import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ClientLogosCarousel from "@/components/ClientLogosCarousel";
import InteractiveGalaxyHeroCarousel from "@/components/home/InteractiveGalaxyHeroCarousel";
import PricingSection from "@/components/home/PricingSection";
import EcosystemHighlight from "@/components/home/EcosystemHighlight";
import PillarsSection from "@/components/home/PillarsSection";

import TestimonialsSection from "@/components/home/TestimonialsSection";
import PartnersSection from "@/components/home/PartnersSection";
import BlogPreview from "@/components/home/BlogPreview";
import MainCTA from "@/components/home/MainCTA";
import QuickCTA from "@/components/ui/quick-cta";
import FloatingCTA from "@/components/ui/floating-cta";
import { Helmet } from "react-helmet-async";
import { OrganizationSchema, ServiceSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Index = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Ecossistema LUMIA | Inteligência Organizacional de Alto Rendimento</title>
        <meta
          name="description"
          content="A Crie Valor apresenta o Ecossistema LUMIA: a primeira plataforma brasileira de Inteligência Organizacional com IA. Planejamento, consultoria e cultura, tudo em um só lugar."
        />
        <meta property="og:title" content="Crie Valor | Inteligência Organizacional" />
        <meta
          property="og:description"
          content="Transforme sua empresa com o Sistema LUMIA. Um ecossistema de Inteligência Organizacional que profissionaliza sua gestão em tempo real."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crie Valor | Inteligência Organizacional" />
        <meta
          name="twitter:description"
          content="Transforme sua empresa com o Sistema LUMIA. Direção, planejamento e consultores de IA à sua disposição 24/7."
        />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br" />
      </Helmet>

      {/* Enhanced Organization Schema with Entity Chaining */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://crievalor.com.br/#organization",
          "name": "Crie Valor - Inteligência Organizacional",
          "url": "https://crievalor.com.br",
          "logo": "https://crievalor.com.br/uploads/d2f508b6-c101-4928-b7f7-161a378bb6e8.png",
          "description": "Primeiro Ecossistema de Inteligência Organizacional com IA do Brasil",
          "foundingDate": "2015-04",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 5.0,
            "reviewCount": 10
          },
          "founder": [
            {
              "@type": "Person",
              "@id": "https://crievalor.com.br/#helder-domingues",
              "name": "Helder Domingues",
              "jobTitle": "Fundador e Arquiteto do Ecossistema",
              "sameAs": ["https://www.linkedin.com/in/helderdomingues/"],
              "alumniOf": { "@type": "EducationalOrganization", "name": "Universidade Católica Dom Bosco" },
              "knowsAbout": ["Marketing", "Branding", "Planejamento Estratégico", "Inteligência Artificial"]
            },
            {
              "@type": "Person",
              "@id": "https://crievalor.com.br/#paulo-gaudioso",
              "name": "Paulo Gaudioso",
              "jobTitle": "Co-fundador e Co-autor do Método MAR",
              "sameAs": ["https://www.linkedin.com/in/paulogaudioso/"],
              "alumniOf": { "@type": "EducationalOrganization", "name": "Universidade Católica Dom Bosco" },
              "knowsAbout": ["Gestão de Pessoas", "Coaching", "Desenvolvimento Organizacional"]
            }
          ],
          "review": [
            {
              "@type": "Review",
              "author": { "@type": "Person", "name": "Jefferson Mareco" },
              "reviewRating": { "@type": "Rating", "ratingValue": 5 },
              "reviewBody": "Atendimento excelente, criatividade aliada com ética."
            },
            {
              "@type": "Review",
              "author": { "@type": "Person", "name": "Thiago Monteiro Yatros" },
              "reviewRating": { "@type": "Rating", "ratingValue": 5 },
              "reviewBody": "Excelente atendimento!"
            }
          ]
        })}
      </script>

      <ServiceSchema
        name="LUMIA - Sistema de Inteligência Organizacional"
        description="Ecossistema completo que unifica planejamento estratégico executável em 7 dias, um time de 6 especialistas de Inteligência Artificial para consultoria 24/7 e jornadas de definição de DNA corporativo."
        image="https://iili.io/KnFOVTb.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "697.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://crievalor.com.br/lumia"
        }}
      />

      <FAQSchema
        questions={[
          {
            question: "Como funciona o Sistema LUMIA?",
            answer: "O LUMIA é um ecossistema integrado que unifica planejamento estratégico acelerado, consultoria virtual por IA 24/7 e suporte contínuo para implementação de ações. Você ganha clareza com um plano estruturado e executa com ajuda de assistentes de IA especializados em todas as áreas da sua empresa."
          },
          {
            question: "O que diferencia a Crie Valor de uma consultoria tradicional?",
            answer: "Diferente de relatórios estáticos que levam meses, o LUMIA entrega inteligência organizacional em tempo real. Você controla o processo, conta com especialistas virtuais 24/7 e tem validação humana opcional, custando até 10-20x menos que modelos tradicionais."
          },
          {
            question: "Eu mesmo controlo o processo?",
            answer: "Sim. O cerne do sistema é o seu controle total. Você aprova cada etapa da jornada estratégica e utiliza os consultores virtuais para implementar as ações no ritmo do seu negócio."
          },
          {
            question: "Para que tamanho de empresa o LUMIA é indicado?",
            answer: "O Ecossistema LUMIA é ideal para empresas que faturam R$ 150 mil/mês ou mais e possuem pelo menos 10 colaboradores. É a solução perfeita para quem precisa profissionalizar a gestão com agilidade."
          },
          {
            question: "O que é a Implementação Assistida?",
            answer: "É o suporte 'hands-on' onde nossos consultores seniores acompanham você na execução das estratégias geradas pelo ecossistema. Disponível nos planos Intermediário (2 reuniões/mês) e Avançado (4 reuniões/mês)."
          }
        ]}
      />

      <Header />

      <main className="flex-grow">
        <h1 className="sr-only">Crie Valor - Inteligência Organizacional</h1>

        {/* Hero Carrossel - Propósito + MAR + Mentorias + Mentor de Propósito */}
        <InteractiveGalaxyHeroCarousel />

        {/* Pillars Section - 3 Pilares de Atuação */}
        <PillarsSection />

        {/* Client Logos Section */}
        <div id="clientes" aria-labelledby="clientesHeading" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 id="clientesHeading" className="text-3xl md:text-4xl font-bold mb-4">
                Empresas que confiam em nós
              </h2>
              <p className="text-lg text-muted-foreground">
                Parceiros de sucesso que transformaram seus resultados com o Ecossistema LUMIA.
              </p>
            </div>
            <ClientLogosCarousel />
          </div>
        </div>

        {/* Ecosystem Highlight - Unified flow */}
        <EcosystemHighlight />

        {/* Pricing Section - 3 Tiers */}
        <PricingSection />

        {/* Blog Preview - Conectando com o blog */}
        <BlogPreview />

        {/* CTA após Blog Preview */}
        <QuickCTA
          title="Quer conteúdo estratégico exclusivo?"
          description="Acesse materiais avançados e insights que só compartilhamos com nossa comunidade VIP."
          ctaText="Acessar conteúdo exclusivo"
          ctaUrl="/material-exclusivo"
          variant="outline"
          centerAlign
          className="bg-secondary/30"
        />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA após Testimonials */}
        <QuickCTA
          title="Quero resultados como estes para minha empresa"
          description="Descubra como podemos acelerar o crescimento da sua empresa também."
          ctaText="Falar com consultor"
          ctaUrl="/contato"
          variant="secondary"
          centerAlign
          className="bg-secondary/20"
        />

        {/* Partners Section */}
        <PartnersSection />

        {/* CTA Final */}
        <MainCTA />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* CTA Flutuante */}
      <FloatingCTA />

      <Footer />
    </div>
  );
};

export default Index;
