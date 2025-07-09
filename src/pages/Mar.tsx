import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import MarExplanation from "@/components/MarExplanation";
import MarComparisonSection from "@/components/MarComparisonSection";
import PricingSection from "@/components/PricingSection";
import VideoSection from "@/components/VideoSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Helmet } from "react-helmet-async";
import { ServiceSchema } from "@/components/seo/SchemaMarkup";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Mar = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      <Helmet>
        <title>MAR - Mapa para Alto Rendimento | Crie Valor</title>
        <meta name="description" content="MAR - Um mapa estratégico feito para acelerar o crescimento de empresas com decisões precisas e personalizadas." />
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
      
      <ServiceSchema 
        name="MAR - Mapa para Alto Rendimento"
        description="Um mapa estratégico criado exclusivamente para acelerar o crescimento de empresas com decisões precisas e personalizadas."
        provider={{
          name: "Crie Valor Estratégia",
          url: "https://crievalor.com.br"
        }}
        url="https://crievalor.com.br/mar"
        areaServed="Brasil"
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
            <PricingSection />
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
                    <p className="text-muted-foreground">O processo inclui: diagnóstico inicial, análise estratégica, desenvolvimento do mapa personalizado, apresentação dos resultados e acompanhamento da implementação com suporte contínuo.</p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Qual é a diferença do MAR para outras consultorias?</h3>
                    <p className="text-muted-foreground">O MAR oferece soluções práticas e implementáveis, não apenas teorias. Focamos em resultados mensuráveis, com acompanhamento próximo e metodologia testada em centenas de empresas ao longo de 25 anos.</p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Posso parcelar o investimento no MAR?</h3>
                    <p className="text-muted-foreground">Sim, oferecemos opções de parcelamento em até 12x no cartão de crédito, além de descontos para pagamento à vista. Consulte as condições específicas para cada plano.</p>
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
