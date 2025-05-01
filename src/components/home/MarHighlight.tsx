
import React from "react";
import { Link } from "react-router-dom";
import { Anchor, Brain, Target, BarChart3, Zap, ArrowRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarHighlight = () => {
  return (
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
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
            A solução que combina <strong>inteligência artificial</strong> e <strong>consultoria humana</strong> para criar estratégias de negócios excepcionais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in" style={{animationDelay: "0.3s"}}>
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
          
          <div className="order-1 lg:order-2 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="relative">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl glow-border">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <img src="/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" alt="MAR" className="h-10 mr-3" />
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
                        A partir de <span className="text-primary font-bold">R$ 179,90</span>
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
  );
};

export default MarHighlight;
