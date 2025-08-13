import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Zap, BarChart3, Users, Cog, TrendingUp, ArrowRight, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import ContactSection from "@/components/ContactSection";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Lumia = () => {
  useScrollToTop();

  const consultors = [
    {
      icon: BarChart3,
      title: "Consultor de Vendas",
      description: "Estratégias de conversão, análise de funil, técnicas de fechamento e otimização de processos comerciais.",
      features: ["Análise de pipeline", "Estratégias de conversão", "Otimização de processos", "Acompanhamento de métricas"]
    },
    {
      icon: TrendingUp,
      title: "Consultor de Marketing",
      description: "Campanhas, posicionamento estratégico, análise de mercado e otimização de ROI em marketing digital.",
      features: ["Campanhas estratégicas", "Posicionamento de marca", "Análise de mercado", "ROI em marketing"]
    },
    {
      icon: Cog,
      title: "Consultor de Operações",
      description: "Processos eficientes, gestão de qualidade, otimização de recursos e melhoria contínua operacional.",
      features: ["Otimização de processos", "Gestão de qualidade", "Eficiência operacional", "Melhoria contínua"]
    },
    {
      icon: Users,
      title: "Consultor de Finanças",
      description: "Planejamento financeiro, análise de viabilidade, controle de custos e estratégias de investimento.",
      features: ["Planejamento financeiro", "Análise de viabilidade", "Controle de custos", "Estratégias de investimento"]
    }
  ];

  const benefits = [
    "Clareza contínua com recomendações práticas alinhadas às prioridades do MAR",
    "Execução guiada com rotinas, checklists e análises sob demanda",
    "4 especialistas virtuais disponíveis 24/7 em áreas críticas do negócio", 
    "Evolução orientada pelo propósito da empresa (metodologia Simon Sinek)",
    "Integração nativa com o plano estratégico do MAR",
    "Acompanhamento de resultados e métricas em tempo real"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Lumia | Consultoria Virtual da Crie Valor — Estratégia em Ação para PMEs</title>
        <meta name="description" content="O Lumia conecta o plano estratégico do MAR à execução diária com 4 consultores virtuais em Vendas, Marketing, Operações e Finanças. Comece pelo Por Quê, execute com clareza, cresça com consistência." />
        <meta name="keywords" content="consultoria virtual, inteligência organizacional, plano estratégico, Mapa de Alto Rendimento, Simon Sinek, propósito empresarial, crescimento PME" />
        <meta property="og:title" content="Lumia - Consultoria Virtual da Crie Valor" />
        <meta property="og:description" content="4 consultores virtuais calibrados pelo MAR para transformar estratégia em execução diária." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br/lumia" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lumia - Consultoria Virtual da Crie Valor" />
        <meta name="twitter:description" content="Transforme estratégia em execução com consultores virtuais especializados." />
        <link rel="canonical" href="https://crievalor.com.br/lumia" />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-pink-900/20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-purple-500/10 text-purple-400 rounded-full px-4 py-2">
                  <Zap className="mr-2 h-4 w-4" />
                  <span className="font-medium">Novidade no Ecossistema</span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
                      Lumia: consultoria virtual sob medida
                    </span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-purple-200 leading-relaxed">
                    4 especialistas, um plano claro e acionável
                  </p>
                  
                  <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                    Consultores virtuais calibrados pelo MAR e pelo contexto da sua empresa. 
                    Respostas práticas, análises, recomendações e acompanhamento de resultados — 
                    na velocidade do seu negócio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Button 
                    size="lg" 
                    className="text-xl px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white hover:scale-105 transition-all duration-300 shadow-purple-500/25 shadow-2xl font-bold"
                    asChild
                  >
                    <a 
                      href="https://lumia.crievalor.com.br/onboarding?utm_source=site_crievalor&utm_medium=homepage&utm_campaign=ecossistema&utm_content=cta_hero"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Experimente o Lumia <ArrowRight className="ml-3 h-6 w-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-xl px-8 py-6 border-2 border-white/40 bg-black/40 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <a 
                      href="https://wa.me/5547992150289?text=Quero%20conhecer%20o%20Lumia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar com um especialista
                    </a>
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="relative w-96 h-96">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-purple-400/30 animate-pulse" style={{animationDelay: "0.5s"}}></div>
                  <div className="absolute inset-8 rounded-full border-2 border-purple-400/40 animate-pulse" style={{animationDelay: "1s"}}></div>
                  
                  <div className="absolute inset-16 rounded-full bg-gradient-to-br from-black/50 to-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <Zap className="h-32 w-32 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consultores Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                4 Consultores Virtuais Especializados
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Cada consultor é calibrado pelo contexto da sua empresa e integrado ao seu plano estratégico do MAR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {consultors.map((consultor, index) => (
                <Card key={index} className="border-border hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-500/10 p-3 rounded-lg">
                        <consultor.icon className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{consultor.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {consultor.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {consultor.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Por que escolher o Lumia?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  O Lumia conecta sua estratégia à prática diária, oferecendo consultoria 
                  virtual de alto nível integrada ao seu plano estratégico.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card className="border-border shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Ecossistema Integrado</CardTitle>
                        <CardDescription>MAR + Lumia + Propósito</CardDescription>
                      </div>
                      <Brain className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="font-medium">10+ anos</span>
                      <span className="text-sm text-muted-foreground">de consultoria aplicada</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="font-medium">500+ empresas</span>
                      <span className="text-sm text-muted-foreground">impactadas pelo MAR</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="font-medium">4 consultores</span>
                      <span className="text-sm text-muted-foreground">virtuais integrados</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="font-medium">1 ecossistema</span>
                      <span className="text-sm text-muted-foreground">completo</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-purple-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Pronto para transformar estratégia em execução?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Comece pelo Por Quê. Execute com o Lumia. Escale com o MAR.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="text-xl px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 font-bold shadow-xl"
                  asChild
                >
                  <a 
                    href="https://lumia.crievalor.com.br/onboarding?utm_source=site_crievalor&utm_medium=lumia_page&utm_campaign=conversion&utm_content=cta_main"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Começar com o Lumia <ArrowRight className="ml-3 h-6 w-6" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-xl px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold"
                  asChild
                >
                  <Link to="/mar">
                    Entender o MAR
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-purple-200 mt-6">
                Metodologia proprietária Crie Valor. Privacidade e segurança em primeiro lugar.
              </p>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Lumia;