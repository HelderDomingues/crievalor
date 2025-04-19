
import React from "react";
import { Button } from "@/components/ui/button";
import { Target, Layers, Shield, Heart, Zap } from "lucide-react";

const ProjectOverview = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/10 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Soluções que se adaptam exatamente ao que você precisa
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Sabemos que cada negócio é único, com desafios e oportunidades específicas.
              Por isso, desenvolvemos projetos completamente personalizados, alinhados 
              aos seus objetivos estratégicos e realidade operacional.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe multidisciplinar trabalha em estreita colaboração com você 
              para entender suas necessidades e desenvolver soluções que realmente fazem 
              a diferença para o seu negócio.
            </p>
            
            <Button size="lg" className="shadow-glow">
              Converse com um Especialista
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={Target}
              color="blue"
              title="Objetivos Específicos"
              description="Projetos desenvolvidos para atingir metas claras e mensuráveis."
            />
            <FeatureCard
              icon={Layers}
              color="purple"
              title="Abordagem Integrada"
              description="Combinamos diferentes especialidades para criar soluções completas."
            />
            <FeatureCard
              icon={Zap}
              color="emerald"
              title="Implementação Ágil"
              description="Metodologias ágeis para entregas rápidas e adaptativas."
            />
            <FeatureCard
              icon={Shield}
              color="amber"
              title="Resultados Garantidos"
              description="Compromisso com entregas que realmente geram impacto."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
