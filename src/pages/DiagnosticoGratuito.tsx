import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Users, Zap, ArrowRight } from "lucide-react";
import OficinaLideresLeadForm from "@/components/OficinaLideresLeadForm";

const DiagnosticoGratuito = () => {
  useScrollToTop();
  
  const beneficios = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Análise Completa da Situação Atual",
      description: "Mapeamento detalhado dos principais desafios e oportunidades do seu negócio"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Identificação de Gargalos Críticos",
      description: "Pontos específicos que estão limitando o crescimento da sua empresa"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Consultoria Especializada",
      description: "Reunião online de 30 minutos com um dos nossos consultores seniores"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Plano de Ação Imediato",
      description: "3 primeiras ações práticas que você pode implementar ainda esta semana"
    }
  ];

  const processo = [
    {
      numero: "01",
      titulo: "Preenchimento do Formulário",
      descricao: "Responda algumas perguntas sobre seu negócio (leva apenas 3 minutos)"
    },
    {
      numero: "02", 
      titulo: "Análise Prévia",
      descricao: "Nossa equipe analisa suas respostas e prepara insights personalizados"
    },
    {
      numero: "03",
      titulo: "Reunião de Diagnóstico",
      descricao: "Apresentamos os resultados e discutimos oportunidades em uma reunião online"
    },
    {
      numero: "04",
      titulo: "Entrega do Relatório",
      descricao: "Você recebe um relatório completo com recomendações específicas"
    }
  ];

  const entregaveis = [
    "Relatório de Diagnóstico Empresarial (PDF, 8-12 páginas)",
    "Mapa de Oportunidades personalizado para seu segmento",
    "Lista de 3 ações prioritárias para implementação imediata",
    "Cronograma sugerido para os próximos 90 dias",
    "Reunião online de apresentação dos resultados (30min)"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Diagnóstico Gratuito | Descubra o potencial do seu negócio | Crie Valor</title>
        <meta name="description" content="Receba um diagnóstico completo e gratuito do seu negócio. Identifique oportunidades, elimine gargalos e acelere seu crescimento com a metodologia Crie Valor." />
        <meta property="og:title" content="Diagnóstico Gratuito | Descubra o potencial do seu negócio" />
        <meta property="og:description" content="Análise completa e gratuita do seu negócio com recomendações práticas para acelerar o crescimento." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br/diagnostico-gratuito" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://crievalor.com.br/diagnostico-gratuito" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
                <span className="text-primary font-medium px-4 py-2 bg-primary/20 rounded-full text-sm">
                  🎯 100% Gratuito • Sem Compromisso
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Descubra o <span className="text-primary">verdadeiro potencial</span> do seu negócio
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Receba um diagnóstico completo que revelará as <strong>oportunidades ocultas</strong> 
                na sua empresa e um plano de ação para os próximos 90 dias.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Análise em 48h</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Consultoria incluída</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Plano de ação prático</span>
                </div>
              </div>
              
              <Button size="lg" className="shadow-glow animate-pulse" asChild>
                <a href="#formulario">
                  Quero meu diagnóstico gratuito agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                ⏱️ Leva apenas 3 minutos para preencher
              </p>
            </div>
          </div>
        </section>

        {/* Benefícios Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                O que você vai receber no seu diagnóstico
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Muito mais do que um simples questionário. Uma análise profunda 
                e personalizada do seu negócio.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {beneficios.map((beneficio, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                      {beneficio.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{beneficio.title}</h3>
                      <p className="text-muted-foreground">{beneficio.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Processo Section */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Como funciona o processo
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Um processo simples e rápido para você começar a transformar seu negócio ainda esta semana.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processo.map((etapa, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {etapa.numero}
                      </div>
                      {index < processo.length - 1 && (
                        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -translate-y-1/2" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{etapa.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Entregáveis Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Tudo isso você recebe <span className="text-primary">gratuitamente</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Um pacote completo de análise e consultoria que normalmente custaria R$ 2.500,00
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                <div className="space-y-4">
                  {entregaveis.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                  <p className="text-center font-semibold text-lg">
                    💡 <strong>Bônus exclusivo:</strong> Acesso a um template de planejamento estratégico 
                    usado por empresas que faturam mais de R$ 1 milhão por ano.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário Section */}
        <section id="formulario" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Solicite seu diagnóstico gratuito agora
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato em até 4 horas 
                para agendar sua reunião de diagnóstico.
              </p>
              
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>100% gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Sem spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Dados protegidos</span>
                </div>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <OficinaLideresLeadForm />
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">
                Empresas que já transformaram seus resultados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-lg mb-4 italic">
                    "O diagnóstico revelou oportunidades que estavam bem na nossa frente, 
                    mas não conseguíamos enxergar. Em 60 dias aumentamos nossa receita em 40%."
                  </p>
                  <div className="font-semibold">
                    — Marina Santos, Diretora Comercial
                  </div>
                  <div className="text-sm text-muted-foreground">
                    TechSolutions Ltda
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-lg mb-4 italic">
                    "Finalmente entendemos onde estávamos perdendo dinheiro. 
                    As recomendações eram práticas e fáceis de implementar."
                  </p>
                  <div className="font-semibold">
                    — Carlos Eduardo, CEO
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Indústria Omega
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="shadow-glow" asChild>
                <a href="#formulario">
                  Eu também quero esses resultados
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiagnosticoGratuito;