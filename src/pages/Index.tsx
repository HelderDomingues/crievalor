import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import EditableText from "@/components/EditableText";
import { Link } from "react-router-dom";
import { Brain, Target, Zap, Lightbulb, TrendingUp, Users } from "lucide-react";
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
          title="Transforme com estratégias personalizadas"
          subtitle="Crie Valor"
          description="Somos especialistas em desenvolver estratégias de alto impacto que combinam o poder da inteligência artificial com a experiência humana."
          ctaText="Conheça o MAR"
          ctaUrl="/mar"
          secondaryCtaText="Fale Conosco"
          secondaryCtaUrl="#contato"
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
              <EditableText 
                initialText="Desenvolvemos estratégias que geram resultados"
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-4"
              />
              <EditableText 
                initialText="Nossa abordagem combina tecnologia de ponta com expertise de mercado para criar estratégias que realmente funcionam."
                as="p"
                className="text-lg text-muted-foreground"
              />
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
        
        {/* MAR Product Highlight */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-72 h-72 -top-36 -right-36 opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block mb-4">
                  <EditableText initialText="Nosso Produto Principal" as="span" />
                </div>
                <EditableText 
                  initialText="MAR - Mapa para Alto Rendimento"
                  as="h2"
                  className="text-3xl md:text-4xl font-bold mb-4"
                />
                <EditableText 
                  initialText="Um método híbrido revolucionário que combina o poder da inteligência artificial com o conhecimento de consultores humanos para gerar planos estratégicos com análises aprofundadas."
                  as="p"
                  className="text-lg text-muted-foreground mb-6"
                />
                <EditableText 
                  initialText="Essa abordagem disruptiva não apenas acelera o processo, como também barateia e democratiza o desenvolvimento de planejamentos estratégicos de alto nível."
                  as="p"
                  className="text-lg text-muted-foreground mb-8"
                />
                <Button size="lg" asChild>
                  <Link to="/mar">
                    <EditableText initialText="Saiba mais sobre o MAR" as="span" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl glow-border">
                  <div className="px-6 py-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-xl font-bold">MAR</h3>
                        <p className="text-muted-foreground text-sm">Mapa para Alto Rendimento</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>Análise de mercado por IA</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>Estratégias personalizadas</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>Desenvolvimento em semanas, não meses</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>Custo acessível para PMEs</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>Acompanhamento de consultores</span>
                      </li>
                    </ul>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Transforme sua estratégia de negócios com o poder da IA + expertise humana
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <EditableText 
                initialText="O que nossos clientes dizem"
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-4"
              />
              <EditableText 
                initialText="Transformamos a estratégia de negócios de diversas empresas. Veja o que elas têm a dizer."
                as="p"
                className="text-lg text-muted-foreground"
              />
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
              <EditableText 
                initialText="Pronto para transformar sua estratégia?"
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-4"
              />
              <EditableText 
                initialText="Descubra como o MAR - Mapa para Alto Rendimento pode impulsionar os resultados da sua empresa com estratégias personalizadas."
                as="p"
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              />
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/mar">
                    <EditableText initialText="Conheça o MAR" as="span" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#contato">
                    <EditableText initialText="Fale Conosco" as="span" />
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
