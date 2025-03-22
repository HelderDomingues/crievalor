
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { Lightbulb, Search, BarChart, Zap } from "lucide-react";

const Consultoria = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Consultoria Estratégica Personalizada"
          subtitle="Consultoria"
          description="Soluções estratégicas sob medida para transformar os desafios do seu negócio em oportunidades de crescimento e inovação."
          ctaText="Solicite uma Proposta"
          ctaUrl="#contato"
          secondaryCtaText="Nosso Processo"
          secondaryCtaUrl="#processo"
        />
        
        {/* Process Section */}
        <section id="processo" className="py-16 md:py-24 bg-secondary/10 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Processo de Consultoria
              </h2>
              <p className="text-lg text-muted-foreground">
                Uma abordagem estruturada para identificar desafios e 
                implementar soluções que geram resultados reais.
              </p>
            </div>
            
            <div className="space-y-12 mt-12 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-full shrink-0">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Diagnóstico Aprofundado</h3>
                  <p className="text-muted-foreground">
                    Realizamos uma análise completa do seu negócio, mercado e concorrência,
                    utilizando metodologias avançadas e inteligência artificial para 
                    identificar oportunidades de melhoria.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-amber-500/10 p-4 rounded-full shrink-0">
                  <Lightbulb className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">2. Desenvolvimento Estratégico</h3>
                  <p className="text-muted-foreground">
                    Com base nos insights obtidos, elaboramos estratégias personalizadas
                    e planos de ação detalhados, com métricas claras para acompanhamento.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-blue-500/10 p-4 rounded-full shrink-0">
                  <Zap className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">3. Implementação Ágil</h3>
                  <p className="text-muted-foreground">
                    Acompanhamos a implementação das estratégias, garantindo agilidade
                    e adaptabilidade, com suporte contínuo da nossa equipe especializada.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-emerald-500/10 p-4 rounded-full shrink-0">
                  <BarChart className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">4. Avaliação de Resultados</h3>
                  <p className="text-muted-foreground">
                    Monitoramos constantemente os KPIs definidos, realizando ajustes
                    quando necessário para garantir os melhores resultados possíveis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Areas Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Áreas de Atuação
              </h2>
              <p className="text-lg text-muted-foreground text-center">
                Nossa consultoria especializada abrange diversas áreas críticas para o sucesso do seu negócio.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-medium mb-3">Estratégia de Negócios</h3>
                <p className="text-muted-foreground">
                  Planejamento estratégico, análise de mercado e posicionamento competitivo.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-medium mb-3">Transformação Digital</h3>
                <p className="text-muted-foreground">
                  Implementação de tecnologias e processos digitais para otimizar operações.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-medium mb-3">Marketing e Vendas</h3>
                <p className="text-muted-foreground">
                  Estratégias de crescimento, aquisição de clientes e otimização de canais.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-medium mb-3">Gestão Operacional</h3>
                <p className="text-muted-foreground">
                  Otimização de processos, redução de custos e aumento de eficiência.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-medium mb-3">Desenvolvimento Organizacional</h3>
                <p className="text-muted-foreground">
                  Cultura, estrutura e desenvolvimento de equipes de alto desempenho.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-medium mb-3">Inovação</h3>
                <p className="text-muted-foreground">
                  Desenvolvimento de novos produtos, serviços e modelos de negócios.
                </p>
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

export default Consultoria;
