import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ClientLogosCarousel from "@/components/ClientLogosCarousel";
import InteractiveGalaxyHeroCarousel from "@/components/home/InteractiveGalaxyHeroCarousel";
import HowWeDoItSection from "@/components/home/HowWeDoItSection";
import WhatWhyTransition from "@/components/home/WhatWhyTransition";
import MentoriasSection from "@/components/home/MentoriasSection";
import MarHighlight from "@/components/home/MarHighlight";
import LumiaHighlight from "@/components/home/LumiaHighlight";
import MentorPropositoHighlight from "@/components/home/MentorPropositoHighlight";

import TestimonialsSection from "@/components/home/TestimonialsSection";
import PartnersSection from "@/components/home/PartnersSection";
import ServicesSections from "@/components/home/ServicesSections";
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
        <title>Como Implementar Inteligência Organizacional em Empresas de Médio Porte? | Crie Valor</title>
        <meta
          name="description"
          content="A Crie Valor é a primeira plataforma brasileira de Inteligência Organizacional com IA. Fundada em abril/2015 por Helder Domingues e Paulo Gaudioso. MAR em 7 dias (vs 90), Lumia 24/7, Mentor de Propósito. R$ 3.500 vs R$ 30-80k consultoria tradicional."
        />
        <meta property="og:title" content="Crie Valor Estratégia | Intelligência Organizacional" />
        <meta
          property="og:description"
          content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Intelligência Organizacional."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crie Valor Estratégia | Inteligência Organizacional" />
        <meta
          name="twitter:description"
          content="Transforme sua empresa com o MAR: Mapa para Alto Rendimento. Direção e clareza estratégica para resultados excepcionais."
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
          "logo": "https://crievalor.com.br/lovable-uploads/d2f508b6-c101-4928-b7f7-161a378bb6e8.png",
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
        name="MAR - Mapa para Alto Rendimento"
        description="Planejamento estratégico com inteligência artificial que cria um roadmap personalizado para acelerar o crescimento empresarial. Sistema de Inteligência Organizacional que analisa dados e gera insights estratégicos precisos. Ideal para empresas em Campo Grande/MS, Navegantes/SC e todo Brasil."
        image="https://iili.io/3vlTe6l.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "3497.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://crievalor.com.br/mar"
        }}
      />

      <ServiceSchema
        name="Lumia - 6 Consultores Virtuais com Inteligência Artificial"
        description="Plataforma de consultoria virtual com 6 consultores especializados baseados em IA: Vendas, Marketing, Operações, Finanças, RH e Estratégia. Disponíveis 24/7 para apoiar decisões empresariais com inteligência artificial. Sistema de IA conversacional para negócios."
        image="https://iili.io/KnFOVTb.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "697.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://lumia.crievalor.com.br"
        }}
      />

      <ServiceSchema
        name="Lumia - Plano Trimestral"
        description="Plataforma de consultoria virtual com 6 consultores especializados baseados em IA. Plano trimestral com economia."
        image="https://iili.io/KnFOVTb.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "1757.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://lumia.crievalor.com.br"
        }}
      />

      <ServiceSchema
        name="Lumia - Plano Anual"
        description="Plataforma de consultoria virtual com 6 consultores especializados baseados em IA. Plano anual com máxima economia."
        image="https://iili.io/KnFOVTb.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "5649.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://lumia.crievalor.com.br"
        }}
      />

      <ServiceSchema
        name="Mentor de Propósito - Inteligência Conversacional para Propósito"
        description="Sistema de inteligência conversacional que ajuda empresas a descobrir e articular seu propósito autêntico através de conversas estruturadas. Ferramenta de IA para clareza estratégica e cultura organizacional fortalecida."
        image="https://iili.io/Kzktdnn.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "299.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://proposito.crievalor.com.br"
        }}
      />

      <FAQSchema
        questions={[
          {
            question: "Quanto tempo leva o processo do MAR?",
            answer: "O MAR é entregue em 7 dias após o preenchimento do questionário. Depois da entrega, você tem uma reunião online com nosso consultor para apresentação e tira-dúvidas."
          },
          {
            question: "O que diferencia a Crie Valor de uma consultoria tradicional?",
            answer: "Combinamos IA proprietária com validação humana, entregamos em 7 dias (vs 60-90 dias), custamos 10-20x menos (a partir de R$ 3.497 vs R$ 30-80k) e oferecemos acompanhamento contínuo com Lumia 24/7."
          },
          {
            question: "Preciso parar a operação para implementar o plano?",
            answer: "Não. Nossa metodologia é feita para empresas que não podem parar. O MAR traz um plano realista de 12 meses que você implementa sem interromper o dia a dia."
          },
          {
            question: "Como funciona a validação humana?",
            answer: "Consultores com 20+ anos de experiência revisam todos os documentos gerados pela IA, validam análises e garantem consistência com a realidade da sua empresa e mercado."
          },
          {
            question: "Minha empresa é do tamanho certo para o MAR?",
            answer: "O MAR é ideal para empresas que faturam no mínimo R$ 150 mil/mês e têm pelo menos 15 funcionários. Se você cresceu sem estrutura e precisa profissionalizar, o MAR é para você."
          },
          {
            question: "O que é a Implementação Assistida?",
            answer: "É o acompanhamento hands-on de 3 a 6 meses para executar o plano do MAR, com reuniões semanais, suporte via WhatsApp e validação da execução. Garante que você não só tenha o plano, mas execute de verdade."
          }
        ]}
      />

      <Header />

      <main className="flex-grow">
        <h1 className="sr-only">Crie Valor Estratégia - Inteligência Organizacional</h1>

        {/* Hero Carrossel - Propósito + MAR + Mentorias + Mentor de Propósito */}
        <InteractiveGalaxyHeroCarousel />


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

        {/* CTA após Client Logos */}
        <QuickCTA
          title="Quero fazer parte desta lista de sucesso"
          description="Junte-se às empresas que já transformaram seus resultados conosco."
          ctaText="Falar com especialista"
          ctaUrl="/contato"
          centerAlign
          className="bg-primary/5"
        />

        {/* Como Fazemos - Nova seção metodológica */}
        <HowWeDoItSection />

        {/* Transição Por que → O que */}
        <WhatWhyTransition />

        {/* MAR Product Highlight - Seção dedicada */}
        <MarHighlight />

        {/* Lumia Product Highlight - Nova seção do ecossistema */}
        <LumiaHighlight />

        {/* Mentor de Propósito Product Highlight - Bússola do ecossistema */}
        <MentorPropositoHighlight />

        {/* Mentorias Section - Seção dedicada */}
        <MentoriasSection />

        {/* Services Sections - Seções completas */}
        <ServicesSections />

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

        {/* CTA Final - Diagnóstico Gratuito */}
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
