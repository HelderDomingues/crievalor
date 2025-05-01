
import React from "react";
import FeatureCard from "@/components/FeatureCard";
import { Brain, Target, Zap, Lightbulb, TrendingUp, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Expertise Humana",
      description: "Consultores experientes refinam e personalizam as estratégias geradas pela IA."
    }, 
    {
      icon: Target,
      title: "Estratégia Orientada",
      description: "Desenvolvemos planos estratégicos focados em resultados mensuráveis e acionáveis."
    }, 
    {
      icon: Brain,
      title: "Inteligência Artificial",
      description: "Utilizamos algoritmos avançados para processar e analisar dados de mercado com precisão e velocidade."
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
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30 relative" id="diferenciais" aria-labelledby="diferenciaisHeading">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
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
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
