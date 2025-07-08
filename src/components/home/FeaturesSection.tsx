
import React from "react";
import FeatureCard from "@/components/FeatureCard";
import { Brain, Target, Zap, Lightbulb, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Expertise Humana",
      description: "Consultores experientes refinam e personalizam as estratégias geradas pelo nosso sistema proprietário.",
      ariaLabel: "Ícone representando pessoas, simbolizando a expertise humana"
    }, 
    {
      icon: Target,
      title: "Estratégia Orientada",
      description: "Desenvolvemos planos estratégicos focados em resultados mensuráveis e acionáveis.",
      ariaLabel: "Ícone de alvo, simbolizando estratégia orientada a resultados"
    }, 
    {
      icon: Brain,
      title: "Sistema Proprietário",
      description: "Utilizamos nossa metodologia exclusiva para processar e analisar dados de mercado com precisão e velocidade únicas.",
      ariaLabel: "Ícone de cérebro, representando sistema proprietário de inteligência"
    }, 
    {
      icon: Zap,
      title: "Implementação Rápida",
      description: "Acelere o tempo de desenvolvimento estratégico de meses para semanas.",
      ariaLabel: "Ícone de raio, simbolizando implementação rápida"
    }, 
    {
      icon: Lightbulb,
      title: "Inovação Contínua",
      description: "Identificamos oportunidades não óbvias e ideias disruptivas para o seu negócio.",
      ariaLabel: "Ícone de lâmpada, representando inovação contínua"
    }, 
    {
      icon: TrendingUp,
      title: "Crescimento Sustentável",
      description: "Criamos estratégias que permitem um crescimento consistente e escalável.",
      ariaLabel: "Ícone de gráfico crescente, simbolizando crescimento sustentável"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30 relative" id="diferenciais" aria-labelledby="diferenciaisHeading">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5" aria-hidden="true"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5" aria-hidden="true"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="diferenciaisHeading" className="text-3xl md:text-4xl font-bold mb-4">
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
              iconAriaLabel={feature.ariaLabel}
            />
          ))}
        </div>
        
        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" size="lg" asChild className="hover:bg-primary/10">
            <Link to="/mar" aria-label="Descubra o MAR - Mapa para Alto Rendimento">
              Descubra o MAR <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/projetos" aria-label="Conheça nossos projetos - Veja casos de sucesso">
              Conheça nossos projetos <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
