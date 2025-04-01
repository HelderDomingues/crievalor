
import React from "react";
import { Check, X, Zap, Clock, DollarSign, Lightbulb, CreditCard, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarComparisonSection = () => {
  return (
    <section className="py-20 relative bg-gradient-to-b from-secondary/20 to-background">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-96 h-96 -top-48 right-0 opacity-5"></div>
        <div className="blur-dot w-64 h-64 bottom-20 -left-32 opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que o MAR revoluciona a consultoria estratégica
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Descubra como nosso método inovador supera as limitações da consultoria tradicional, 
            entregando resultados ágeis, personalizados e acessíveis.
          </p>
        </div>
        
        {/* Pain Point Introduction */}
        <div className="max-w-4xl mx-auto mb-16 bg-card border border-border rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-primary">Você já sentiu que...</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="min-w-6 mt-1">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-lg">Os processos de consultoria tradicional são <span className="font-bold">lentos e burocráticos</span>, sem entregar o valor esperado?</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="min-w-6 mt-1">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-lg">Os custos são <span className="font-bold">proibitivos</span> para o retorno que você realmente obtém?</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="min-w-6 mt-1">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-lg">As recomendações são <span className="font-bold">genéricas</span> e parecem as mesmas para todas as empresas?</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="min-w-6 mt-1">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-lg">Você precisa esperar <span className="font-bold">meses</span> para ver qualquer resultado prático?</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-semibold">
              Se você respondeu sim a qualquer uma dessas perguntas, o MAR foi criado para resolver precisamente esses desafios.
            </p>
          </div>
        </div>
        
        {/* Comparison Table */}
        <div className="relative mb-16 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="col-span-1"></div>
                <div className="bg-primary/5 p-4 rounded-t-lg text-center">
                  <h3 className="text-xl font-bold text-primary">MAR - Mapa para Alto Rendimento</h3>
                </div>
                <div className="bg-muted/30 p-4 rounded-t-lg text-center">
                  <h3 className="text-xl font-bold text-muted-foreground">Consultoria Tradicional</h3>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Tempo */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Tempo de Entrega</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">2-4 semanas</span>
                    <p className="text-sm text-muted-foreground">Agilidade para implementação imediata</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">3-6 meses</span>
                    <p className="text-sm text-muted-foreground">Processos longos e burocráticos</p>
                  </div>
                </div>
                
                {/* Custo */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Investimento</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">A partir de R$ 179,90</span>
                    <p className="text-sm text-muted-foreground">Acessível para empresas de todos os portes</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">R$ 10.000 - R$ 100.000+</span>
                    <p className="text-sm text-muted-foreground">Custos elevados e pouco escaláveis</p>
                  </div>
                </div>
                
                {/* Tecnologia */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Tecnologia</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">IA + Expertise Humana</span>
                    <p className="text-sm text-muted-foreground">Combinação poderosa para insights precisos</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Principalmente humana</span>
                    <p className="text-sm text-muted-foreground">Limitada pela capacidade manual</p>
                  </div>
                </div>
                
                {/* Personalização */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Personalização</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Altamente personalizado</span>
                    <p className="text-sm text-muted-foreground">Análise específica do seu negócio e mercado</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Parcialmente padronizado</span>
                    <p className="text-sm text-muted-foreground">Modelos pré-formatados adaptados</p>
                  </div>
                </div>
                
                {/* Flexibilidade */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Pagamento</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Flexível</span>
                    <p className="text-sm text-muted-foreground">À vista com desconto ou parcelado</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Contrato fixo</span>
                    <p className="text-sm text-muted-foreground">Geralmente com valores altos</p>
                  </div>
                </div>
                
                {/* Resultados */}
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Resultados</span>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Métricas claras e objetivas</span>
                    <p className="text-sm text-muted-foreground">KPIs específicos para seu negócio</p>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="font-bold text-lg">Resultados subjetivos</span>
                    <p className="text-sm text-muted-foreground">Raramente com métricas específicas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center bg-card rounded-xl p-8 border border-border shadow-lg glow-border">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Transforme sua estratégia agora com o MAR
          </h3>
          <p className="text-lg mb-6">
            Líderes visionários como você já descobriram o poder do MAR para acelerar a tomada de decisão 
            e obter vantagem competitiva no mercado. A cada dia que passa sem uma estratégia clara, 
            são oportunidades perdidas para seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="shadow-glow" asChild>
              <a href="#pricing">
                Escolha seu plano MAR
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#contato">
                Falar com um consultor
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            "O MAR revolucionou nossa abordagem estratégica, trazendo clareza e direção que não tínhamos antes."
            <br />
            <span className="font-medium">— Carlos Silva, CEO da TechSolutions</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarComparisonSection;
