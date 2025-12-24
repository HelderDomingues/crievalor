import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import MarExplanation from "@/components/MarExplanation";
import MarComparativeTable from "@/components/MarComparativeTable";
import MarProcessSteps from "@/components/MarProcessSteps";

import VideoSection from "@/components/VideoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Helmet } from "react-helmet-async";
import { ProductSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { VideoSchema } from "@/components/seo/VideoSchema";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import marLogo from "@/assets/mar-logo-horizontal.png";

const Mar = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <Helmet>
        <title>Como Criar um Plano Estratégico em 7 Dias com Inteligência Artificial? | MAR - Crie Valor</title>
        <meta name="description" content="O MAR é um sistema de planejamento estratégico com IA que entrega em 7 dias (vs 90 dias tradicional). Personalizado com Mapeamento do DNA de Liderança + BSC + Porter. R$ 3.500-5.000 vs R$ 30-80k consultoria tradicional. Fundadores: Helder Domingues e Paulo Gaudioso." />
        <meta property="og:title" content="MAR - Mapa para Alto Rendimento | Crie Valor" />
        <meta property="og:description" content="Um mapa estratégico feito para acelerar o crescimento de empresas com decisões precisas." />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://crievalor.com.br/mar" />
        <meta property="og:image" content={`https://crievalor.com.br${marLogo}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MAR - Mapa para Alto Rendimento | Crie Valor" />
        <meta name="twitter:description" content="Estratégias que funcionam: consultoria especializada para acelerar seu crescimento empresarial." />
        <meta name="twitter:image" content={`https://crievalor.com.br${marLogo}`} />
        <link rel="canonical" href="https://crievalor.com.br/mar" />
      </Helmet>

      <ProductSchema
        name="MAR - Mapa para Alto Rendimento com IA"
        description="Sistema de planejamento estratégico com inteligência artificial que cria roadmaps personalizados para acelerar crescimento empresarial. Utiliza IA para análises preditivas, insights estratégicos e decisões baseadas em dados. Ideal para empresas em Campo Grande/MS, Navegantes/SC e todo Brasil."
        image="https://iili.io/3vlTe6l.png"
        brand="Crie Valor - Inteligência Organizacional"
        offers={{
          price: "3497.00",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://crievalor.com.br/mar"
        }}
        isDigital={true}
      />

      <VideoSchema
        name="MAR - Clareza para decidir. Direção para crescer."
        description="Descubra como o MAR pode transformar a estratégia da sua empresa com planejamento estratégico baseado em inteligência artificial."
        thumbnailUrl="https://crievalor.com.br/lovable-uploads/mar-logo.png"
        uploadDate="2024-01-01T08:00:00-03:00"
        duration="PT3M8S"
        embedUrl="https://www.youtube.com/embed/Y22PDZ7-zhY"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "MAR - Planejamento Estratégico com IA", url: "https://crievalor.com.br/mar" }
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
          <MarProcessSteps />
        </ErrorBoundary>

        <ErrorBoundary>
          <MarComparativeTable />
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
                    <p className="text-muted-foreground">O MAR (Mapa para Alto Rendimento) é um sistema de planejamento estratégico com IA que cria um roadmap personalizado para sua empresa. Combina Mapeamento do DNA de Liderança + Balanced Scorecard + Porter com validação humana de consultores com 26+ e 27+ anos de experiência.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Quanto tempo leva para receber o MAR?</h3>
                    <p className="text-muted-foreground">O MAR é entregue em <strong>7 dias</strong> após o preenchimento do questionário de 64 perguntas. Depois da entrega, você tem uma reunião online com nosso consultor para apresentação e tira-dúvidas. Muito mais rápido que consultoria tradicional (60-90 dias).</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">O MAR funciona para qualquer tipo de empresa?</h3>
                    <p className="text-muted-foreground">O MAR é ideal para empresas que <strong>faturam no mínimo R$ 150 mil/mês e têm pelo menos 15 funcionários</strong>. Se você cresceu sem estrutura e precisa profissionalizar sem parar a operação, o MAR é para você. Nossa metodologia é adaptável para empresas de serviços B2B, comércio e pequena indústria.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Como é o processo de implementação do MAR?</h3>
                    <p className="text-muted-foreground">O processo inclui: <strong>1)</strong> Questionário de 64 perguntas + Mapeamento do DNA de Liderança, <strong>2)</strong> Análise com IA + Validação humana, <strong>3)</strong> Desenvolvimento do plano estratégico 12 meses, <strong>4)</strong> Apresentação dos resultados em reunião online. Tudo em 7 dias.</p>
                  </div>

                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Qual é a diferença do MAR para outras consultorias?</h3>
                    <p className="text-muted-foreground">O MAR combina <strong>IA nativa + metodologia estratégica robusta + validação humana</strong>. Entregamos em 7 dias (vs 60-90 dias tradicional), custamos 10-20x menos (R$ 3.500-5.000 vs R$ 30-80k), e oferecemos acompanhamento contínuo com Lumia 24/7. Não somos consultoria tradicional nem SaaS genérico - somos Inteligência Organizacional.</p>
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
