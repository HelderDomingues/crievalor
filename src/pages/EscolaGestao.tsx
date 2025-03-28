
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Target, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EscolaGestaoLeadForm from "@/components/EscolaGestaoLeadForm";

const EscolaGestao = () => {
  // Hero images for the carousel
  const heroImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
    "https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=2083",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="Escola de Gestão"
          subtitle="Formação Executiva Presencial"
          description="Um programa completo de desenvolvimento de líderes e gestores para empresas do Baixo Vale do Itajaí (SC), com metodologias práticas e aplicação imediata."
          ctaText="Inscreva-se Agora"
          ctaUrl="#lead-form"
          backgroundImages={heroImages}
        />
        
        {/* About Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block">
                    Exclusivo para o Baixo Vale do Itajaí
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Formação Executiva Presencial
                </h2>
                
                <p className="text-lg text-muted-foreground mb-4">
                  A Escola de Gestão é um programa completo de desenvolvimento de competências gerenciais voltado exclusivamente para empresas e profissionais da região do Baixo Vale do Itajaí em Santa Catarina.
                </p>
                
                <p className="text-lg text-muted-foreground mb-6">
                  Nosso programa visa transformar gestores em líderes estratégicos através de módulos práticos ministrados por especialistas com vasta experiência empresarial.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center p-4 bg-card rounded-lg border border-border">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Encontros Presenciais</h4>
                      <p className="text-sm text-muted-foreground">Módulos mensais imersivos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-card rounded-lg border border-border">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Turmas Reduzidas</h4>
                      <p className="text-sm text-muted-foreground">Atenção personalizada</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <a href="#lead-form">
                      Quero saber mais <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:+5547992150289">
                      <Phone className="mr-2 h-4 w-4" /> Falar com consultor
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-5 -left-5 w-full h-full border-2 border-primary rounded-xl"></div>
                  <img 
                    src="/lovable-uploads/fc868084-d22b-4877-907b-fe02e64fc501.png" 
                    alt="Escola de Gestão" 
                    className="w-full h-auto rounded-xl shadow-lg relative z-10"
                  />
                  <div className="absolute -bottom-5 -right-5 bg-primary/10 w-24 h-24 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blur-dot w-64 h-64 top-20 -right-32 opacity-5"></div>
            <div className="blur-dot w-96 h-96 -bottom-48 -left-48 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Target className="mr-2 h-4 w-4" />
                <span className="font-medium">Metodologia</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Como Funciona a Escola de Gestão
              </h2>
              <p className="text-lg text-muted-foreground">
                Um programa estruturado com metodologia prática e aplicação imediata, 
                desenvolvido especialmente para as necessidades empresariais da nossa região.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="absolute -top-5 -left-2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">Diagnóstico</h3>
                <p className="text-muted-foreground mb-4">
                  Identificação das necessidades específicas de desenvolvimento de competências da sua empresa e equipe.
                </p>
                <div className="w-12 h-1 bg-primary/50 rounded-full"></div>
              </div>
              
              {/* Step 2 */}
              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="absolute -top-5 -left-2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">Capacitação</h3>
                <p className="text-muted-foreground mb-4">
                  Módulos presenciais com foco nas competências essenciais para gestores, com metodologia prática e aplicável.
                </p>
                <div className="w-12 h-1 bg-primary/50 rounded-full"></div>
              </div>
              
              {/* Step 3 */}
              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="absolute -top-5 -left-2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">Implementação</h3>
                <p className="text-muted-foreground mb-4">
                  Aplicação prática dos conhecimentos com acompanhamento e suporte personalizado para gestores.
                </p>
                <div className="w-12 h-1 bg-primary/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Modules Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span className="font-medium">Conteúdo Especializado</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Módulos Especializados
              </h2>
              <p className="text-lg text-muted-foreground">
                Desenvolvimento completo de competências essenciais para gestores do Baixo Vale do Itajaí,
                com conteúdo adaptado à realidade local.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Liderança e Gestão de Pessoas</h3>
                <p className="text-muted-foreground mb-4">
                  Desenvolvimento de habilidades de liderança, comunicação efetiva, feedback e gestão de equipes de alto desempenho.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Liderança situacional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Comunicação assertiva</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Gestão de conflitos</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Gestão Estratégica</h3>
                <p className="text-muted-foreground mb-4">
                  Ferramentas para tomada de decisão, planejamento estratégico e implementação de objetivos organizacionais.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Análise de mercado regional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Definição de metas e KPIs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Gestão de projetos</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Gestão Financeira</h3>
                <p className="text-muted-foreground mb-4">
                  Análise financeira, controle de custos e orçamentos, interpretação de demonstrativos financeiros.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Indicadores financeiros</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Análise de investimentos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Precificação estratégica</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Gestão Comercial e Marketing</h3>
                <p className="text-muted-foreground mb-4">
                  Estratégias de vendas, negociação, marketing digital e relacionamento com clientes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Técnicas de vendas consultivas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Marketing digital para negócios locais</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>CRM e fidelização</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild>
                <a href="#lead-form">
                  Solicitar programa completo <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blur-dot w-64 h-64 bottom-20 -right-32 opacity-5"></div>
            <div className="blur-dot w-96 h-96 top-48 -left-48 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Award className="mr-2 h-4 w-4" />
                <span className="font-medium">Resultados Comprovados</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Benefícios para sua Empresa
              </h2>
              <p className="text-lg text-muted-foreground">
                Ao investir na capacitação dos seus gestores com a Escola de Gestão, sua empresa obtém 
                resultados imediatos e de longo prazo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gestores mais capacitados</h3>
                <p className="text-muted-foreground">
                  Desenvolvimento de competências técnicas e comportamentais para lidar com desafios empresariais da região.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Aplicação imediata</h3>
                <p className="text-muted-foreground">
                  Conteúdo prático que pode ser implementado no dia a dia da empresa, gerando resultados de curto prazo.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Networking regional</h3>
                <p className="text-muted-foreground">
                  Conexão com outros gestores e empresas da região, promovendo trocas de experiências e parcerias.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Aumento de produtividade</h3>
                <p className="text-muted-foreground">
                  Processos mais eficientes e pessoas mais engajadas, resultando em maior produtividade e resultados.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Resultados mensuráveis</h3>
                <p className="text-muted-foreground">
                  Implementação de KPIs e sistemas de avaliação que permitem medir o impacto do programa na empresa.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Vantagem competitiva</h3>
                <p className="text-muted-foreground">
                  Equipe preparada para enfrentar desafios e aproveitar oportunidades específicas do mercado local.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Program Details */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="font-medium">Informações do Programa</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Detalhes da Escola de Gestão
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Formato</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Encontros presenciais mensais</p>
                          <p className="text-sm text-muted-foreground">Em Navegantes/SC</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">8 módulos completos</p>
                          <p className="text-sm text-muted-foreground">Com carga horária de 8h cada</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Turmas reduzidas</p>
                          <p className="text-sm text-muted-foreground">Máximo de 15 participantes</p>
                        </div>
                      </li>
                    </ul>
                    
                    <h3 className="text-xl font-medium mt-6 mb-4">Público-alvo</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Empresários</p>
                          <p className="text-sm text-muted-foreground">De pequenas e médias empresas</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Gestores</p>
                          <p className="text-sm text-muted-foreground">De departamentos e áreas</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Profissionais em ascensão</p>
                          <p className="text-sm text-muted-foreground">Com potencial de liderança</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4">Região Atendida</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-3">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Baixo Vale do Itajaí - SC</h4>
                      </div>
                      <ul className="pl-7 space-y-1 text-muted-foreground">
                        <li>• Navegantes</li>
                        <li>• Itajaí</li>
                        <li>• Balneário Camboriú</li>
                        <li>• Penha</li>
                        <li>• Cidades próximas</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-4">Investimento</h3>
                    <p className="text-muted-foreground mb-4">
                      Opções de investimento personalizadas para cada empresa, com 
                      condições especiais para grupos de colaboradores da mesma organização.
                    </p>
                    
                    <div className="mt-6">
                      <Button size="lg" className="w-full" asChild>
                        <a href="#lead-form">
                          Solicitar proposta personalizada
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Lead Capture Form */}
        <section id="lead-form" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
            <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8 md:p-10 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Transforme sua gestão agora
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Preencha o formulário abaixo para receber mais informações sobre a
                    Escola de Gestão e garantir sua vaga.
                  </p>
                </div>
                
                <EscolaGestaoLeadForm />
                
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="font-medium mb-2">Prefere falar diretamente conosco?</h4>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-2" />
                    <a href="tel:+5547992150289" className="text-primary hover:underline">
                      (47) 99215-0289
                    </a>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Paulo (Navegantes/SC)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default EscolaGestao;
