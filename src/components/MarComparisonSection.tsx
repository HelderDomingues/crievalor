import React from "react";
import { Check, X, Zap, Clock, DollarSign, Lightbulb, CreditCard, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
const MarComparisonSection = () => {
  const isMobile = useIsMobile();

  // Data for the comparison table
  const comparisonItems = [{
    icon: <Clock className="h-5 w-5 text-primary" />,
    title: "Tempo de Entrega",
    mar: {
      value: "Uma semana",
      description: "Agilidade para implementação imediata"
    },
    traditional: {
      value: "3-6 meses",
      description: "Processos longos e burocráticos"
    }
  }, {
    icon: <DollarSign className="h-5 w-5 text-primary" />,
    title: "Investimento",
    mar: {
      value: "R$ 799,00 à vista ou 10x de R$ 89,90",
      description: "Acessível para empresas de todos os portes"
    },
    traditional: {
      value: "R$ 10.000 - R$ 100.000+",
      description: "Custos elevados e pouco escaláveis"
    }
  }, {
    icon: <Zap className="h-5 w-5 text-primary" />,
    title: "Tecnologia",
    mar: {
      value: "Sistema Proprietário + Expertise Humana",
      description: "Combinação poderosa para insights precisos"
    },
    traditional: {
      value: "Principalmente humana",
      description: "Limitada pela capacidade manual"
    }
  }, {
    icon: <Lightbulb className="h-5 w-5 text-primary" />,
    title: "Personalização",
    mar: {
      value: "Altamente personalizado",
      description: "Análise específica do seu negócio e mercado"
    },
    traditional: {
      value: "Parcialmente padronizado",
      description: "Modelos pré-formatados adaptados"
    }
  }, {
    icon: <CreditCard className="h-5 w-5 text-primary" />,
    title: "Pagamento",
    mar: {
      value: "Flexível",
      description: "À vista com desconto ou parcelado"
    },
    traditional: {
      value: "Contrato fixo",
      description: "Geralmente com valores altos"
    }
  }, {
    icon: <PieChart className="h-5 w-5 text-primary" />,
    title: "Resultados",
    mar: {
      value: "Métricas claras e objetivas",
      description: "KPIs específicos para seu negócio"
    },
    traditional: {
      value: "Resultados subjetivos",
      description: "Raramente com métricas específicas"
    }
  }];
  return <section className="py-20 relative bg-gradient-to-b from-secondary/20 to-background">
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
        
        {/* Comparison Table - Desktop version */}
        {!isMobile && <div className="mb-16 rounded-lg overflow-hidden border border-border shadow-md">
            <div className="grid grid-cols-3 gap-0">
              <div className="p-4 bg-muted/20 flex items-center justify-center">
                <span className="font-semibold text-lg text-center">Aspecto</span>
              </div>
              <div className="p-4 bg-primary/10 text-center">
                <h3 className="text-xl font-bold text-primary">MAR - Mapa para Alto Rendimento</h3>
              </div>
              <div className="p-4 bg-muted/30 text-center">
                <h3 className="text-xl font-bold text-muted-foreground">Consultoria Tradicional</h3>
              </div>
            </div>
            
            <Table className="w-full">
              <TableBody>
                {comparisonItems.map((item, index) => <TableRow key={index} className="border-t border-border">
                    <TableCell className="w-1/3 p-4 bg-muted/10">
                      <div className="flex items-center gap-3 justify-center">
                        {item.icon}
                        <span className="font-semibold">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/3 p-6 bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">{item.mar.value}</div>
                        <p className="text-sm text-muted-foreground">{item.mar.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/3 p-6 bg-muted/20">
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">{item.traditional.value}</div>
                        <p className="text-sm text-muted-foreground">{item.traditional.description}</p>
                      </div>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>}
        
        {/* Comparison Cards - Mobile version */}
        {isMobile && <div className="mb-16 space-y-6">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <h3 className="text-base font-bold text-primary">MAR</h3>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <h3 className="text-base font-bold text-muted-foreground">Tradicional</h3>
              </div>
            </div>
            
            {comparisonItems.map((item, index) => <div key={index} className="border border-border rounded-lg overflow-hidden">
                <div className="p-3 bg-muted/10 flex items-center justify-center gap-2 border-b border-border">
                  {item.icon}
                  <span className="font-semibold">{item.title}</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4 bg-gradient-to-b from-primary/5 to-primary/20 border-r border-border">
                    <div className="text-center">
                      <div className="font-bold text-sm mb-1">{item.mar.value}</div>
                      <p className="text-xs text-muted-foreground">{item.mar.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/20">
                    <div className="text-center">
                      <div className="font-bold text-sm mb-1">{item.traditional.value}</div>
                      <p className="text-xs text-muted-foreground">{item.traditional.description}</p>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
        
        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center bg-card rounded-xl p-8 border border-border shadow-lg glow-border">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Tenha clareza estratégica agora com o MAR</h3>
          <p className="text-lg mb-6">
            Líderes visionários como você já descobriram o poder do MAR para acelerar a tomada de decisão 
            e obter vantagem competitiva no mercado. A cada dia que passa sem uma estratégia clara, 
            são oportunidades perdidas para seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="shadow-glow" asChild>
              <a href="#pricing">
                Contrate o MAR agora 
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
    </section>;
};
export default MarComparisonSection;