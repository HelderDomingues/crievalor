
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { Briefcase, Layers, Shield, Heart, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const Projetos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Projetos sob Medida"
          subtitle="Soluções Customizadas"
          description="Desenvolvemos projetos especiais completamente customizados para atender às necessidades específicas do seu negócio."
          ctaText="Solicite uma Proposta"
          ctaUrl="#contato"
          secondaryCtaText="Ver Exemplos"
          secondaryCtaUrl="#exemplos"
        />
        
        {/* Overview Section */}
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
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="bg-blue-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Target className="text-blue-500 h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Objetivos Específicos</h3>
                  <p className="text-sm text-muted-foreground">
                    Projetos desenvolvidos para atingir metas claras e mensuráveis.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="bg-purple-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Layers className="text-purple-500 h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Abordagem Integrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Combinamos diferentes especialidades para criar soluções completas.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="bg-emerald-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Zap className="text-emerald-500 h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Implementação Ágil</h3>
                  <p className="text-sm text-muted-foreground">
                    Metodologias ágeis para entregas rápidas e adaptativas.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="bg-amber-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Shield className="text-amber-500 h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Resultados Garantidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Compromisso com entregas que realmente geram impacto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Examples Section */}
        <section id="exemplos" className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Exemplos de Projetos Especiais
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça alguns casos de projetos personalizados que desenvolvemos 
                para clientes com necessidades específicas.
              </p>
            </div>
            
            <div className="space-y-12">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8">
                    <div className="bg-blue-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Briefcase className="text-blue-500 h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-medium mb-3">Transformação Digital</h3>
                    <p className="text-muted-foreground mb-4">
                      Desenvolvemos um projeto completo de transformação digital para 
                      uma empresa de varejo tradicional, incluindo estratégia omnichannel, 
                      implementação de e-commerce e integração de sistemas.
                    </p>
                    
                    <h4 className="font-medium mb-2">Resultados:</h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Aumento de 130% nas vendas digitais</p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Redução de 40% nos custos operacionais</p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Melhoria de 60% na experiência do cliente</p>
                      </li>
                    </ul>
                    
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                  
                  <div className="bg-secondary/20 flex items-center justify-center p-8">
                    <div className="bg-primary/10 p-8 rounded-full">
                      <Briefcase className="h-16 w-16 text-primary opacity-70" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="order-2 md:order-1 bg-secondary/20 flex items-center justify-center p-8">
                    <div className="bg-purple-500/10 p-8 rounded-full">
                      <Heart className="h-16 w-16 text-purple-500 opacity-70" />
                    </div>
                  </div>
                  
                  <div className="order-1 md:order-2 p-8">
                    <div className="bg-purple-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Heart className="text-purple-500 h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-medium mb-3">Cultura Organizacional</h3>
                    <p className="text-muted-foreground mb-4">
                      Desenvolvemos um programa completo de transformação cultural para 
                      uma empresa em processo de fusão, incluindo diagnóstico, 
                      definição de valores e implementação de novas práticas.
                    </p>
                    
                    <h4 className="font-medium mb-2">Resultados:</h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Redução de 70% na rotatividade</p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Aumento de 85% no engajamento dos colaboradores</p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Integração cultural bem-sucedida em 6 meses</p>
                      </li>
                    </ul>
                    
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </div>
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

export default Projetos;
