import React from "react";
import { Link } from "react-router-dom";
import { 
  Target, 
  Brain, 
  Zap, 
  Users, 
  Award, 
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HowWeDoItSection = () => {
  const pillars = [
    {
      icon: Target,
      title: "Foco Estratégico",
      description: "Análise profunda antes da execução. Decisões baseadas em dados e insights.",
      details: "Não acreditamos em soluções genéricas. Cada estratégia é construída após análise minuciosa do seu negócio."
    },
    {
      icon: Brain,
      title: "Metodologias Próprias",
      description: "MAR e outros processos testados em +500 empresas diferentes.",
      details: "Desenvolvemos metodologias exclusivas que combinam as melhores práticas do mercado com inovação."
    },
    {
      icon: Zap,
      title: "Tecnologia & IA",
      description: "Ferramentas modernas a serviço da produtividade e automação inteligente.",
      details: "Utilizamos tecnologia de ponta para acelerar processos e gerar insights mais precisos."
    },
    {
      icon: Users,
      title: "Visão Holística",
      description: "Compreensão sistêmica das organizações e conexão entre todas as áreas.",
      details: "Vemos sua empresa como um ecossistema integrado, onde cada parte influencia o resultado final."
    },
    {
      icon: Award,
      title: "Expertise & Experiência",
      description: "+10 anos de mercado com vivência própria como empresários.",
      details: "Falamos sua língua porque vivemos os mesmos desafios. Nossa experiência prática faz a diferença."
    },
    {
      icon: Heart,
      title: "Psicologia Organizacional",
      description: "Profundo conhecimento em gestão de pessoas e comportamentos.",
      details: "Entendemos que por trás de toda empresa existem pessoas. E pessoas movem resultados."
    }
  ];

  return (
    <section className="py-16 md:py-24 relative bg-gradient-to-b from-secondary/10 via-background to-primary/5" id="como-fazemos" aria-labelledby="comoFazemosHeading">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-96 h-96 -top-48 left-1/4 opacity-5"></div>
        <div className="blur-dot w-64 h-64 top-1/2 -right-32 opacity-5"></div>
        <div className="blur-dot w-80 h-80 -bottom-40 left-10 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-6 py-3 mb-6">
            <CheckCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Nossa Metodologia</span>
          </div>
          
          <h2 id="comoFazemosHeading" className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
            Como Geramos <span className="text-primary">Clareza e Direção</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
            Nosso processo único combina <strong>metodologia proprietária</strong>, <strong>tecnologia avançada</strong> e 
            <strong> expertise humana</strong> para transformar empresas em organizações de alto rendimento.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-background/50 backdrop-blur-sm border border-border hover:border-primary/20 animate-fade-in"
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              <CardContent className="p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="bg-primary/10 rounded-2xl p-4 w-fit group-hover:bg-primary/20 transition-colors duration-300">
                      {React.createElement(pillar.icon, { 
                        className: "h-8 w-8 text-primary" 
                      })}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {pillar.description}
                  </p>
                  
                  <p className="text-sm text-foreground/80 mt-auto pt-4 border-t border-border/50">
                    {pillar.details}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-12 animate-fade-in" style={{animationDelay: "0.8s"}}>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Do Diagnóstico aos Resultados
            </h3>
            <p className="text-muted-foreground">
              Um processo estruturado que garante transformações reais e mensuráveis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Diagnóstico", desc: "Análise profunda da situação atual" },
              { step: "02", title: "Estratégia", desc: "Desenvolvimento do plano personalizado" },
              { step: "03", title: "Implementação", desc: "Execução com acompanhamento contínuo" },
              { step: "04", title: "Resultados", desc: "Mensuração e otimização constante" }
            ].map((phase, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">{phase.step}</span>
                </div>
                <h4 className="font-bold mb-2">{phase.title}</h4>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-5 w-5 text-primary/30 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{animationDelay: "1s"}}>
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para experimentar nossa metodologia?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece com um diagnóstico gratuito e descubra como podemos acelerar 
              o crescimento da sua empresa com clareza e direção estratégica.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="shadow-glow" asChild>
                <Link to="/diagnostico-gratuito" aria-label="Agendar diagnóstico gratuito">
                  Quero meu diagnóstico gratuito <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contato" aria-label="Conhecer o processo completo">
                  Conhecer processo completo <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeDoItSection;