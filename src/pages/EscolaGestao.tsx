
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { BookOpen, GraduationCap, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EscolaGestao = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Escola de Gestão"
          subtitle="Desenvolvimento de Líderes"
          description="Programas de formação e desenvolvimento para gestores, com foco em liderança, estratégia e resultados."
          ctaText="Conheça os Cursos"
          ctaUrl="#cursos"
          secondaryCtaText="Fale Conosco"
          secondaryCtaUrl="#contato"
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
                  Formando os líderes que transformarão o futuro
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Nossa Escola de Gestão combina conhecimento teórico com aplicação prática,
                  preparando gestores para enfrentar os desafios reais do mercado com confiança e competência.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Com um corpo docente formado por consultores experientes e metodologias 
                  inovadoras, oferecemos uma formação completa e diferenciada.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p>Teoria aplicada à prática</p>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p>Metodologias inovadoras</p>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p>Estudos de caso reais</p>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p>Rede de networking</p>
                  </div>
                </div>
                
                <Button size="lg" className="shadow-glow">
                  Solicitar Informações
                </Button>
              </div>
              
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl glow-border">
                <div className="p-1">
                  <img 
                    src="/lovable-uploads/escola-gestao.png" 
                    alt="Escola de Gestão" 
                    className="w-full h-auto rounded-t-lg object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-bold">Escola de Gestão</h3>
                      </div>
                      <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm">
                        Certificado
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      "A formação me proporcionou ferramentas práticas que aplico diariamente na gestão da minha equipe."
                    </p>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Programas de 2 a 6 meses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Courses Section */}
        <section id="cursos" className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossos Programas
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça nossa grade de cursos e programas desenvolvidos para 
                atender às necessidades específicas de cada nível de gestão.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle>Liderança Estratégica</CardTitle>
                  <CardDescription>Para gestores de alto escalão</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Pensamento estratégico e visão de longo prazo</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Tomada de decisão baseada em dados</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Gestão de mudanças organizacionais</p>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-primary font-medium">6 meses</span>
                    <Button variant="outline" size="sm">Saiba mais</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle>Gestão de Equipes</CardTitle>
                  <CardDescription>Para líderes de equipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Comunicação eficaz e feedback construtivo</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Desenvolvimento e motivação de equipes</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Gestão de conflitos e negociação</p>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-primary font-medium">4 meses</span>
                    <Button variant="outline" size="sm">Saiba mais</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle>Gestão de Projetos</CardTitle>
                  <CardDescription>Para coordenadores de projetos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Metodologias ágeis e tradicionais</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Planejamento e controle de recursos</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm">Gestão de riscos e oportunidades</p>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-primary font-medium">3 meses</span>
                    <Button variant="outline" size="sm">Saiba mais</Button>
                  </div>
                </CardContent>
              </Card>
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

export default EscolaGestao;
