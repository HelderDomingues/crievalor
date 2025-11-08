import React from "react";
import { Link } from "react-router-dom";
import { Compass, Target, Brain, Users, TrendingUp, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const MentorPropositoHighlight = () => {
  return (
    <section className="py-16 md:py-24 relative bg-gradient-to-b from-background to-secondary/20" id="mentor-proposito-produto" aria-labelledby="mentorPropositoProdutoHeading">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-72 h-72 -top-36 -left-36 opacity-10" style={{ background: 'linear-gradient(135deg, hsl(40, 75%, 65%), hsl(30, 70%, 60%))' }}></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-10" style={{ background: 'linear-gradient(135deg, hsl(30, 75%, 65%), hsl(20, 70%, 60%))' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-amber-500/10 text-amber-400 rounded-full px-4 py-2 mb-4">
            <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
            <span className="font-medium">A Bússola do Ecossistema</span>
          </div>
          <h2 id="mentorPropositoProdutoHeading" className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            Mentor de Propósito: o "Por Quê" que transforma
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
            A ferramenta de <strong>inteligência conversacional</strong> que guia você na descoberta do propósito que orienta decisões e inspira equipes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="relative">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl" style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' }}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-amber-600 to-amber-500 p-3 rounded-lg mr-3">
                        <Compass className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Mentor de Propósito</h3>
                        <p className="text-muted-foreground text-sm">Descoberta de Propósito</p>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-amber-400" aria-hidden="true" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Target className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Conexão e Contextualização</h4>
                        <p className="text-xs text-muted-foreground">Compreensão do contexto único</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Brain className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Coleta de Histórias</h4>
                        <p className="text-xs text-muted-foreground">Momentos de excelência e padrões</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Users className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Identificação de Padrões</h4>
                        <p className="text-xs text-muted-foreground">Valores fundamentais e essência</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-500/10 rounded-lg flex items-start gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <TrendingUp className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Articulação e Integração</h4>
                        <p className="text-xs text-muted-foreground">Propósito acionável na prática</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          Metodologia <span className="text-amber-400 font-medium">proprietária Crie Valor</span>
                        </p>
                        <p className="text-xs text-green-400 font-medium mt-1">
                          🎁 BETA Gratuito até 30/11/2025
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://proposito.crievalor.com.br" target="_blank" rel="noopener noreferrer">
                          Cadastrar
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="bg-amber-500/10 text-amber-400 rounded-full px-4 py-2 inline-block mb-4">
              Bússola Organizacional
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              O propósito que conecta estratégia e pessoas
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Através de conversas profundas e análise de padrões, o Mentor de Propósito revela 
              o verdadeiro "Por Quê" do seu negócio — aquela verdade fundamental que orienta decisões e inspira equipes.
            </p>
            
            {/* Benefícios */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-full mt-1">
                  <Target className="h-4 w-4 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Clareza estratégica</h4>
                  <p className="text-sm text-muted-foreground">Decisões mais rápidas e alinhadas ao propósito</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-full mt-1">
                  <Users className="h-4 w-4 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Cultura fortalecida</h4>
                  <p className="text-sm text-muted-foreground">Engajamento profundo dos colaboradores</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-full mt-1">
                  <TrendingUp className="h-4 w-4 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Marca diferenciada</h4>
                  <p className="text-sm text-muted-foreground">Comunicação que ressoa em nível emocional</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-full mt-1">
                  <Brain className="h-4 w-4 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Inovação direcionada</h4>
                  <p className="text-sm text-muted-foreground">Criatividade ancorada em valores fundamentais</p>
                </div>
              </div>
            </div>
            
            {/* Micro provas */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-card border border-border rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">5</div>
                <div className="text-sm text-muted-foreground">etapas de descoberta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">100%</div>
                <div className="text-sm text-muted-foreground">metodologia comprovada</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">10+</div>
                <div className="text-sm text-muted-foreground">anos de experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">1</div>
                <div className="text-sm text-muted-foreground">propósito transformador</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="shadow-glow bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600" asChild>
                <a href="https://proposito.crievalor.com.br" target="_blank" rel="noopener noreferrer">
                  Começar Jornada Grátis <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://proposito.crievalor.com.br" target="_blank" rel="noopener noreferrer">
                  Conhecer o Mentor <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4 text-center sm:text-left">
              <span className="text-green-400 font-medium">🎁 Acesso 100% gratuito até 30/11/2025.</span> Baseado no Círculo Dourado de Simon Sinek. Privacidade garantida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorPropositoHighlight;
