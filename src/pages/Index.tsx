
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import ServicesSection from "@/components/ServicesSection";
import ClientLogosCarousel from "@/components/ClientLogosCarousel";
import { Link } from "react-router-dom";
import { Brain, Target, Zap, Lightbulb, TrendingUp, Users, ArrowRight, Anchor, Map, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "Inteligência Artificial",
      description: "Utilizamos algoritmos avançados para processar e analisar dados de mercado com precisão e velocidade."
    },
    {
      icon: Target,
      title: "Estratégia Orientada",
      description: "Desenvolvemos planos estratégicos focados em resultados mensuráveis e acionáveis."
    },
    {
      icon: Zap,
      title: "Implementação Rápida",
      description: "Acelere o tempo de desenvolvimento estratégico de meses para semanas."
    },
    {
      icon: Lightbulb,
      title: "Inovação Contínua",
      description: "Identificamos oportunidades não óbvias e ideias disruptivas para o seu negócio."
    },
    {
      icon: TrendingUp,
      title: "Crescimento Sustentável",
      description: "Criamos estratégias que permitem um crescimento consistente e escalável."
    },
    {
      icon: Users,
      title: "Expertise Humana",
      description: "Consultores experientes refinam e personalizam as estratégias geradas pela IA."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Transforme sua empresa com estratégias personalizadas"
          subtitle="Bem-vindo(a) à Crie Valor"
          description="Somos especialistas em desenvolver estratégias de alto impacto que combinam o poder da inteligência artificial com a experiência humana."
          ctaText="Conheça o MAR"
          ctaUrl="/mar"
          secondaryCtaText="Fale Conosco"
          secondaryCtaUrl="#contato"
          useParticleWaves={true}
        />
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/30 relative">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
            <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Desenvolvemos estratégias que geram resultados
              </h2>
              <p className="text-lg text-muted-foreground">
                Nossa abordagem combina tecnologia de ponta com expertise de mercado para
                criar estratégias que realmente funcionam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* MAR Product Highlight - Melhorado */}
        <section className="py-16 md:py-24 relative bg-gradient-to-b from-background to-secondary/20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-72 h-72 -top-36 -right-36 opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Anchor className="mr-2 h-4 w-4" />
                <span className="font-medium">Nosso Produto Principal</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                MAR - Mapa para Alto Rendimento
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
                A solução que combina <strong>inteligência artificial</strong> e <strong>consultoria humana</strong> para criar estratégias de negócios excepcionais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block mb-4">
                  Transforme sua estratégia
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Acelere o crescimento do seu negócio com o MAR
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Um método híbrido revolucionário que combina o poder da inteligência 
                  artificial com o conhecimento de consultores humanos para gerar planos 
                  estratégicos com análises aprofundadas.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Essa abordagem disruptiva não apenas acelera o processo, como também
                  barateia e democratiza o desenvolvimento de planejamentos estratégicos
                  de alto nível.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center mb-2">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-medium">IA + Humano</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Combine o melhor dos dois mundos para resultados superiores
                    </p>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center mb-2">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-medium">Rapidez</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Estratégias entregues em semanas, não meses
                    </p>
                  </div>
                </div>
                
                <Button size="lg" className="shadow-glow" asChild>
                  <Link to="/mar">
                    Conheça o MAR <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="relative">
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl glow-border">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                          <img 
                            src="/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" 
                            alt="MAR" 
                            className="h-10 mr-3" 
                          />
                          <div>
                            <h3 className="text-xl font-bold">MAR</h3>
                            <p className="text-muted-foreground text-sm">Mapa para Alto Rendimento</p>
                          </div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Map className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Brain className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Análise Inteligente</h4>
                            <p className="text-sm text-muted-foreground">IA + expertise humana para insights precisos</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Estratégia Personalizada</h4>
                            <p className="text-sm text-muted-foreground">Planos sob medida para seu negócio</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Métricas e KPIs</h4>
                            <p className="text-sm text-muted-foreground">Indicadores claros para medir resultados</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            A partir de <span className="text-primary font-bold">R$ 3.997</span>
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/mar">Ver detalhes</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section (New) */}
        <ServicesSection />
        
        {/* Client Logos Section (New) */}
        <ClientLogosCarousel />
        
        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O que nossos clientes dizem
              </h2>
              <p className="text-lg text-muted-foreground">
                Transformamos a estratégia de negócios de diversas empresas. 
                Veja o que elas têm a dizer.
              </p>
            </div>
            
            <TestimonialCarousel />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blur-dot w-96 h-96 -top-48 -left-48 opacity-10"></div>
            <div className="blur-dot w-64 h-64 top-1/2 right-0 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl p-8 md:p-12 max-w-4xl mx-auto text-center glow-border">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para transformar sua estratégia?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Descubra como o MAR - Mapa para Alto Rendimento pode impulsionar os resultados 
                da sua empresa com estratégias personalizadas.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/mar">
                    Conheça o MAR
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#contato">
                    Fale Conosco
                  </a>
                </Button>
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

export default Index;
