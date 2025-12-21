import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";

import { Users, Award, BarChart, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

const Mentorias = () => {
  // Example hero images - replace with your actual images
  const heroImages = [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
    "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentorias Empresariais | Desenvolvimento de Líderes - Crie Valor</title>
        <meta name="description" content="Programa de mentorias com IA para desenvolvimento de líderes. Acompanhamento personalizado e resultados mensuráveis em Campo Grande/MS e Navegantes/SC." />
        <meta name="keywords" content="mentorias empresariais, desenvolvimento de líderes, mentoria com IA, liderança estratégica, coach executivo campo grande, mentoria navegantes sc, programa desenvolvimento gestores" />
        <link rel="canonical" href="https://crievalor.com.br/mentorias" />
        <meta property="og:title" content="Mentorias Empresariais - Desenvolvimento de Líderes" />
        <meta property="og:description" content="Transforme líderes com mentorias personalizadas. Resultados mensuráveis e acompanhamento contínuo." />
        <meta property="og:url" content="https://crievalor.com.br/mentorias" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.jpg" />
      </Helmet>

      <ServiceSchema
        name="Mentorias Empresariais para Desenvolvimento de Líderes"
        description="Programa de mentorias personalizado para potencializar o desenvolvimento de líderes e equipes, com foco em resultados mensuráveis."
        provider={{
          name: "Crie Valor - Inteligência Organizacional",
          url: "https://crievalor.com.br"
        }}
        url="https://crievalor.com.br/mentorias"
        areaServed="Brasil"
      />

      <FAQSchema
        questions={[
          {
            question: "Como funcionam as sessões de mentoria?",
            answer: "As sessões são individuais e personalizadas, com duração de 1 hora cada. Realizamos encontros semanais ou quinzenais, dependendo das necessidades específicas e disponibilidade do mentoreado."
          },
          {
            question: "Qual é a duração do programa de mentoria?",
            answer: "O programa tem duração mínima de 3 meses, podendo se estender conforme os objetivos estabelecidos. A maioria dos clientes obtém resultados significativos entre 6 a 12 meses de acompanhamento."
          },
          {
            question: "Quem são os mentores da Crie Valor?",
            answer: "Nossa equipe é formada por profissionais com mais de 2 décadas de experiência em liderança empresarial, gestão de equipes e desenvolvimento organizacional em empresas de diversos portes e segmentos."
          }
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "Mentorias", url: "https://crievalor.com.br/mentorias" }
        ]}
      />

      <Header />

      <main className="flex-grow">
        <HeroSection
          title="Mentorias para desenvolvimento de líderes"
          subtitle="Programa de Mentorias"
          description="Acompanhamento personalizado para potencializar o desenvolvimento de líderes e equipes, com foco em resultados mensuráveis."
          ctaText="Agende uma Conversa"
          ctaUrl="#contato"
          secondaryCtaText="Conheça o Método"
          secondaryCtaUrl="#metodo"
          backgroundImages={heroImages}
        />

        {/* Approach Section */}
        <section id="metodo" className="py-16 md:py-24 bg-secondary/10 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossa Abordagem
              </h2>
              <p className="text-lg text-muted-foreground">
                Um programa estruturado que combina conhecimento técnico,
                inteligência emocional e acompanhamento contínuo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500/10 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-medium">Mentoria Individual</h3>
                </div>
                <p className="text-muted-foreground">
                  Sessões personalizadas focadas no desenvolvimento de competências
                  específicas, alinhadas aos objetivos da organização e do profissional.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-500/10 p-3 rounded-full mr-4">
                    <Award className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-medium">Desenvolvimento de Liderança</h3>
                </div>
                <p className="text-muted-foreground">
                  Fortalecimento de habilidades de liderança, gestão de equipes e
                  tomada de decisão estratégica.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full mr-4">
                    <BarChart className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-medium">Acompanhamento de Desempenho</h3>
                </div>
                <p className="text-muted-foreground">
                  Monitoramento contínuo com métricas claras para avaliar o
                  progresso e ajustar estratégias quando necessário.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-medium">Resultados Mensuráveis</h3>
                </div>
                <p className="text-muted-foreground">
                  Foco em transformação real, com indicadores claros de
                  melhoria de desempenho e desenvolvimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Benefícios do Programa
              </h2>
              <p className="text-lg text-muted-foreground text-center">
                Transforme potencial em resultados concretos com nosso programa de mentorias.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 md:p-12 glow-border">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Aceleração do desenvolvimento de competências de liderança</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Aumento da produtividade e engajamento das equipes</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Desenvolvimento de uma cultura organizacional mais forte e coesa</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Melhoria na tomada de decisões estratégicas baseadas em dados</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Preparação de sucessores para posições-chave na organização</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Perguntas Frequentes
              </h2>

              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Como funcionam as sessões de mentoria?</h3>
                  <p className="text-muted-foreground">As sessões são individuais e personalizadas, com duração de 1 hora cada. Realizamos encontros semanais ou quinzenais, dependendo das necessidades específicas e disponibilidade do mentoreado.</p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Qual é a duração do programa de mentoria?</h3>
                  <p className="text-muted-foreground">O programa tem duração mínima de 3 meses, podendo se estender conforme os objetivos estabelecidos. A maioria dos clientes obtém resultados significativos entre 6 a 12 meses de acompanhamento.</p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Quem são os mentores da Crie Valor?</h3>
                  <p className="text-muted-foreground">Nossa equipe é formada por profissionais com mais de duas décadas de experiência em liderança empresarial, gestão de equipes e desenvolvimento organizacional em empresas de diversos portes e segmentos.</p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Como são definidos os objetivos da mentoria?</h3>
                  <p className="text-muted-foreground">Na primeira sessão, realizamos um diagnóstico completo para identificar pontos de melhoria, definir metas claras e estabelecer indicadores de progresso que serão acompanhados ao longo do processo.</p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">É possível fazer mentoria em grupo?</h3>
                  <p className="text-muted-foreground">Sim, oferecemos modalidades de mentoria em grupo para equipes de liderança. Essa abordagem é ideal para alinhamento de objetivos e desenvolvimento conjunto de competências em líderes da mesma organização.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Mentorias;
