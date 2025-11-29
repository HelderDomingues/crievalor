import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import MarExplanation from "@/components/MarExplanation";
import MarComparisonSection from "@/components/MarComparisonSection";

import VideoSection from "@/components/VideoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Helmet } from "react-helmet-async";
import { ProductSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { VideoSchema } from "@/components/seo/VideoSchema";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Mar = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <Helmet>
        <title>MAR - Planejamento Estratégico com IA | Crie Valor</title>
        <meta name="description" content="MAR - Sistema de planejamento estratégico com inteligência artificial para acelerar crescimento empresarial. IA para análise preditiva e decisões estratégicas. Campo Grande/MS e Navegantes/SC." />
        <meta property="og:title" content="MAR - Mapa para Alto Rendimento | Crie Valor" />
        <meta property="og:description" content="Um mapa estratégico feito para acelerar o crescimento de empresas com decisões precisas." />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://crievalor.com.br/mar" />
        <meta property="og:image" content="https://crievalor.com.br/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MAR - Mapa para Alto Rendimento | Crie Valor" />
        <meta name="twitter:description" content="Estratégias que funcionam: consultoria especializada para acelerar seu crescimento empresarial." />
        <meta name="twitter:image" content="https://crievalor.com.br/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" />
        <link rel="canonical" href="https://crievalor.com.br/mar" />
      </Helmet>

      <ProductSchema
        name="MAR - Mapa para Alto Rendimento com IA"
        description="Sistema de planejamento estratégico com inteligência artificial que cria roadmaps personalizados para acelerar crescimento empresarial. Utiliza IA para análises preditivas, insights estratégicos e decisões baseadas em dados. Ideal para empresas em Campo Grande/MS, Navegantes/SC e todo Brasil."
        image="https://iili.io/3vlTe6l.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "799.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://crievalor.com.br/mar"
        }}
        aggregateRating={{
          ratingValue: 4.9,
          reviewCount: 142
        }}
      />

      <VideoSchema
        name="MAR - Clareza para decidir. Direção para crescer."
        description="Descubra como o MAR pode transformar a estratégia da sua empresa com planejamento estratégico baseado em inteligência artificial."
        thumbnailUrl="https://crievalor.com.br/lovable-uploads/mar-logo.png"
        uploadDate="2024-01-01"
        duration="PT3M8S"
        embedUrl="https://www.youtube.com/embed/Y22PDZ7-zhY"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "MAR - Planejamento Estratégico com IA", url: "https://crievalor.com.br/mar" }
        ]}
      />

      <FAQSchema
        questions={[
          {
            question: "O que exatamente é o MAR?",
            answer: "O MAR (Mapa para Alto Rendimento) é um sistema de planejamento estratégico com inteligência artificial que cria um roadmap personalizado para acelerar o crescimento empresarial através de análises preditivas com IA e planos de ação customizados baseados em dados."
          },
          {
            question: "Como a inteligência artificial é usada no MAR?",
            answer: "O MAR utiliza IA para análise preditiva de mercado, identificação de padrões de crescimento, análise de dados empresariais e geração de insights estratégicos. A inteligência artificial processa grandes volumes de informações para criar recomendações personalizadas e precisas."
          },
          {
            question: "Quanto tempo leva para ver resultados com o MAR?",
            answer: "Os primeiros insights e direcionamentos baseados em IA são entregues em até 30 dias. Resultados mensuráveis começam a aparecer entre 60-90 dias, dependendo da implementação das estratégias recomendadas pelo sistema de inteligência organizacional."
          },
          {
            question: "O MAR funciona para qualquer tipo de empresa?",
            answer: "Sim, nosso sistema de IA é adaptável para empresas de todos os portes e segmentos. A inteligência artificial personaliza as análises e estratégias conforme o perfil, mercado de atuação e objetivos específicos de cada negócio, seja em Campo Grande/MS, Navegantes/SC ou qualquer lugar do Brasil."
          },
          {
            question: "Qual é a diferença do MAR para outras consultorias?",
            answer: "O MAR utiliza inteligência artificial para análises mais profundas e precisas, oferecendo insights baseados em dados que vão além da consultoria tradicional. Combinamos expertise humana com IA para soluções práticas, implementáveis e com resultados mensuráveis comprovados."
          },
          {
            question: "Posso parcelar o investimento no MAR?",
            answer: "Sim, oferecemos opções de parcelamento em até 10x de R$ 89,90 no cartão de crédito, além de desconto para pagamento à vista de R$ 799,00. O investimento pode ser dividido para facilitar o acesso ao sistema de planejamento estratégico com IA."
          }
        ]}
      />

      <Header />

      <main className="flex-grow relative z-10">
        <ErrorBoundary>
          <HeroSection
            title="MAR - Mapa para Alto Rendimento"
            subtitle="Estratégias que Funcionam"
            description="Um mapa estratégico criado para acelerar o crescimento de empresas com decisões precisas e personalizadas."
            ctaText="Quero Saber mais"
            ctaUrl="#mar-explanation"
            secondaryCtaText="Contrate o MAR agora"
            secondaryCtaUrl="#pricing"
            isMarHero={true}
            useMaritimeWaves={true}
          />
        </ErrorBoundary>

        {/* Floating visual elements */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-40 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3"></div>
        </div>

        {/* Features highlight */}
        <div className="relative z-10 py-12 -mt-16 bg-gradient-to-b from-transparent to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature cards removed as requested */}
            </div>
          </div>
        </div>

        <ErrorBoundary>
          <div className="relative overflow-hidden">
            <VideoSection
              title="MAR - Clareza para decidir. Direção para crescer."
              description="Assista ao vídeo e descubra como o MAR pode transformar a estratégia da sua empresa."
              videoUrl="https://www.youtube.com/embed/Y22PDZ7-zhY"
              videoPlaceholder="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070"
            />

            {/* Visual enhancement for video section */}
            <div className="absolute -z-10 w-full h-full top-0 grid-mesh opacity-20"></div>
            <div className="light-streak absolute top-1/3 left-0 rotate-[-35deg]"></div>
            <div className="light-streak absolute top-2/3 left-1/4 rotate-[-35deg]" style={{ animationDelay: "3s" }}></div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div id="mar-explanation" className="relative">
            <MarExplanation />
            {/* Background effect */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -z-10"></div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <MarComparisonSection />
        </ErrorBoundary>

        <ErrorBoundary>
          <div id="pricing" className="relative overflow-hidden">
            {/* CTA to Pricing Page */}
            <section className="py-16 md:py-24 bg-secondary/20">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Pronto para transformar sua empresa?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Conheça todos os nossos planos e combos. Escolha a melhor opção para acelerar o crescimento do seu negócio.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/planos" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                      Ver Planos e Preços
                    </a>
                    <a href="#contato" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                      Falar com Consultor
                    </a>
                  </div>
                </div>
              </div>
            </section>
            {/* Visual enhancements for pricing section */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/20 to-transparent -z-10"></div>
          </div>
        </ErrorBoundary>

        {/* FAQ Section */}
        <ErrorBoundary>
          <section className="py-16 md:py-24 bg-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                  Perguntas Frequentes sobre o MAR
                </h2>

                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">O que exatamente é o MAR?</h3>
                    <p className="text-muted-foreground">O MAR (Mapa para Alto Rendimento) é uma consultoria estratégica personalizada que cria um roadmap específico para acelerar o crescimento da sua empresa através de análises precisas e planos de ação customizados.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Quanto tempo leva para ver resultados com o MAR?</h3>
                    <p className="text-muted-foreground">Os primeiros insights e direcionamentos são entregues em até 30 dias. Resultados mensuráveis começam a aparecer entre 60-90 dias, dependendo da implementação das estratégias recomendadas.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">O MAR funciona para qualquer tipo de empresa?</h3>
                    <p className="text-muted-foreground">Sim, nossa metodologia é adaptável para empresas de todos os portes e segmentos. Personalizamos as análises e estratégias conforme o perfil, mercado de atuação e objetivos específicos de cada negócio.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Como é o processo de implementação do MAR?</h3>
                    <p className="text-muted-foreground">O processo inclui: diagnóstico inicial, análise estratégica, desenvolvimento do mapa personalizado e apresentação dos resultados.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Qual é a diferença do MAR para outras consultorias?</h3>
                    <p className="text-muted-foreground">O MAR oferece soluções práticas e implementáveis, não apenas teorias. Focamos em resultados mensuráveis, com acompanhamento próximo e metodologia testada em centenas de empresas ao longo de 25 anos.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Posso parcelar o investimento no MAR?</h3>
                    <p className="text-muted-foreground">Sim, oferecemos opções de parcelamento em até 10x no cartão de crédito, além de descontos para pagamento à vista. Consulte as condições específicas para cada plano.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ErrorBoundary>

        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default Mar;
