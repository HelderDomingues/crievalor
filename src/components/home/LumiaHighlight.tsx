import React from "react";
import { Link } from "react-router-dom";
import { Brain, BarChart3, Users, Cog, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const LumiaHighlight = () => {
  return (
    <section className="py-16 md:py-24 relative bg-gradient-to-b from-secondary/20 to-background" id="lumia-produto" aria-labelledby="lumiaProdutoHeading">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-72 h-72 -top-36 -left-36 opacity-10" style={{ background: 'linear-gradient(135deg, hsl(280, 75%, 65%), hsl(260, 70%, 60%))' }}></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-10" style={{ background: 'linear-gradient(135deg, hsl(260, 75%, 65%), hsl(240, 70%, 60%))' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-purple-500/10 text-purple-400 rounded-full px-4 py-2 mb-4">
            <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
            <span className="font-medium">Novidade no Ecossistema</span>
          </div>
          <h2 id="lumiaProdutoHeading" className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            Lumia: da estratégia à execução, todos os dias
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
            Consultores virtuais em <strong>Vendas, Marketing, Operações e Finanças</strong> — calibrados pelo MAR e guiados pelo seu Por Quê.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-1 lg:order-1 animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="bg-purple-500/10 text-purple-400 rounded-full px-4 py-2 inline-block mb-4">
              Consultoria Virtual 24/7
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              O Lumia conecta sua estratégia à prática
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Reúne dados, contexto e metodologia em um sistema que gera recomendações 
              acionáveis, acompanha resultados e evolui com o seu negócio.
            </p>
            
            {/* Benefícios */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/10 p-2 rounded-full mt-1">
                  <Brain className="h-4 w-4 text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Clareza contínua</h4>
                  <p className="text-sm text-muted-foreground">Recomendações práticas alinhadas às prioridades do MAR</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/10 p-2 rounded-full mt-1">
                  <Cog className="h-4 w-4 text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Execução guiada</h4>
                  <p className="text-sm text-muted-foreground">Rotinas, checklists e análises sob demanda</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/10 p-2 rounded-full mt-1">
                  <Users className="h-4 w-4 text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Especialistas 24/7</h4>
                  <p className="text-sm text-muted-foreground">Vendas, Marketing, Operações e Finanças</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/10 p-2 rounded-full mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Evolução com propósito</h4>
                  <p className="text-sm text-muted-foreground">Decisões orientadas pelo seu Por Quê</p>
                </div>
              </div>
            </div>
            
            {/* Micro provas */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-card border border-border rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">10+</div>
                <div className="text-sm text-muted-foreground">anos de consultoria aplicada</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">500+</div>
                <div className="text-sm text-muted-foreground">empresas impactadas pelo MAR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">4</div>
                <div className="text-sm text-muted-foreground">consultores virtuais integrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">1</div>
                <div className="text-sm text-muted-foreground">ecossistema completo</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="shadow-glow bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600" asChild>
                <a href="https://lumia.crievalor.com.br" target="_blank" rel="noopener noreferrer">
                  Começar com o Lumia <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/sobre">
                  Entender o Ecossistema <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4 text-center sm:text-left">
              Metodologia proprietária Crie Valor. Privacidade e segurança em primeiro lugar.
            </p>
          </div>
          
          <div className="order-2 lg:order-2 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="relative">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl" style={{ boxShadow: '0 0 30px rgba(147, 51, 234, 0.2)' }}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-purple-600 to-purple-500 p-3 rounded-lg mr-3">
                        <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Lumia</h3>
                        <p className="text-muted-foreground text-sm">Consultoria Virtual</p>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-full">
                      <Brain className="h-6 w-6 text-purple-400" aria-hidden="true" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <BarChart3 className="h-4 w-4 text-purple-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Consultor de Vendas</h4>
                        <p className="text-xs text-muted-foreground">Estratégias de conversão e crescimento</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <TrendingUp className="h-4 w-4 text-purple-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Consultor de Marketing</h4>
                        <p className="text-xs text-muted-foreground">Campanhas e posicionamento estratégico</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <Cog className="h-4 w-4 text-purple-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Consultor de Operações</h4>
                        <p className="text-xs text-muted-foreground">Processos e eficiência operacional</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <BarChart3 className="h-4 w-4 text-purple-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Consultor de Finanças</h4>
                        <p className="text-xs text-muted-foreground">Gestão financeira e planejamento</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Integrado ao <span className="text-purple-400 font-medium">MAR</span>
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://lumia.crievalor.com.br" target="_blank" rel="noopener noreferrer">Conhecer</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumiaHighlight;