import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Target,
  Users,
} from "lucide-react";
import OficinaLideresLeadForm from "@/components/OficinaLideresLeadForm";
import VideoSection from "@/components/VideoSection";
import { Helmet } from "react-helmet-async";
import { ServiceSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
const OficinaLideres = () => {
  const heroImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
    "https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=2083",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
  ];
  const heroDescription =
    "Formação de líderes que dominam as ferramentas essenciais para gerir pessoas e processos.\n\n" +
    "Treinamentos práticos desenvolvidos por especialistas com mais de 25 anos de experiência no mercado.\n\n" +
    "Métodos testados e aprovados em centenas de empresas, garantindo resultados rápidos e mensuráveis.";
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Oficina de Líderes - Formação Executiva Presencial | Baixo Vale do Itajaí/SC</title>
        <meta name="description" content="Programa completo de desenvolvimento de liderança para o Baixo Vale do Itajaí/SC. Treinamentos práticos com mais de 25 anos de experiência. Navegantes, Santa Catarina." />
        <meta name="keywords" content="oficina de líderes, formação executiva navegantes, curso liderança baixo vale itajaí, desenvolvimento gestores sc, treinamento líderes santa catarina, capacitação empresarial navegantes" />
        <link rel="canonical" href="https://crievalor.com.br/oficina-de-lideres" />
        <meta property="og:title" content="Oficina de Líderes - Formação Executiva Presencial" />
        <meta property="og:description" content="Desenvolva seu potencial de liderança. Programa exclusivo para o Baixo Vale do Itajaí com métodos testados e aprovados." />
        <meta property="og:url" content="https://crievalor.com.br/oficina-de-lideres" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.jpg" />
      </Helmet>
      
      <ServiceSchema 
        name="Oficina de Líderes - Formação Executiva Presencial"
        description="Programa completo de desenvolvimento de competências de liderança voltado exclusivamente para profissionais e empresários da região do Baixo Vale do Itajaí em Santa Catarina."
        provider={{
          name: "Crie Valor - Inteligência Organizacional",
          url: "https://crievalor.com.br"
        }}
        url="https://crievalor.com.br/oficina-de-lideres"
        areaServed="Baixo Vale do Itajaí, Santa Catarina"
      />
      
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "Oficina de Líderes", url: "https://crievalor.com.br/oficina-de-lideres" }
        ]}
      />
      
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="OFICINA DE LÍDERES"
          subtitle="Desperte SEU potencial de liderança com:"
          description={heroDescription}
          ctaText="QUERO TRANSFORMAR MINHA LIDERANÇA"
          ctaUrl="https://wa.me/+5547992150289?text=Quero%20garantir%20minha%20vaga%20na%20próxima%20turma%20da%20Oficina%20de%20Líderes"
          backgroundImages={heroImages}
          isOficinaLideresHero={true}
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

                <h2 className="text-3xl md:text-4xl font-bold mb-6">Formação Executiva Presencial</h2>

                <p className="text-lg text-muted-foreground mb-4">
                  A Oficina de Líderes é um programa completo de desenvolvimento de competências de liderança voltado
                  exclusivamente para você, profissional e empresário da região do Baixo Vale do Itajaí em Santa
                  Catarina.
                </p>

                <p className="text-lg text-muted-foreground mb-6">
                  Nosso programa visa transformar você em um líder estratégico através de módulos práticos ministrados
                  por especialistas com vasta experiência empresarial.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center p-4 bg-card rounded-lg border border-border">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Encontros Presenciais</h4>
                      <p className="text-sm text-muted-foreground">Módulos semanais imersivos</p>
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
                    <a href="https://wa.me/+5547992150289" target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> Falar com consultor
                    </a>
                  </Button>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <VideoSection title="" description="" videoUrl="https://www.youtube.com/embed/Lr_L7MAIUnM" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que a Oficina de Líderes é diferente?</h2>
              <p className="text-lg text-muted-foreground">
                Um programa estruturado com metodologia prática e aplicação imediata, desenvolvido especialmente para
                suas necessidades como líder da nossa região.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3 text-center">Não é teoria genérica</h3>
                <p className="text-muted-foreground text-center">
                  Trazemos o que realmente funciona, testado e aprovado em centenas de empresas.
                </p>
              </div>

              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3 text-center">Não é demorado</h3>
                <p className="text-muted-foreground text-center">Conteúdo direto ao ponto, sem enrolação.</p>
              </div>

              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3 text-center">Não é desconectado da realidade</h3>
                <p className="text-muted-foreground text-center">Aplicação imediata no dia a dia da sua empresa.</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Módulos Especializados</h2>
              <p className="text-lg text-muted-foreground">
                Desenvolvimento completo de competências essenciais para gestores do Baixo Vale do Itajaí, com conteúdo
                adaptado à realidade local.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Módulo Geral */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">MÓDULO GERAL (Base Essencial para Todo Gestor)</h3>
                <ul className="space-y-2">
                  {[
                    "Introdução a gestão: identificar habilidades e quebrar paradigmas",
                    "Análise de Perfil",
                    "Análise de Cenário",
                    "Planos de ação",
                    "Indicadores e Monitoramento",
                    "Feedback",
                    "Reuniões Produtivas",
                    "Gestão do Tempo",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Módulo RH */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">MÓDULO RH/GESTÃO DE PESSOAS</h3>
                <ul className="space-y-2">
                  {[
                    "Recrutamento e Seleção",
                    "Admissão e Integração",
                    "Desenvolvimento & Análise de Habilidades e Competências",
                    "Feedback e PDI",
                    "Cultura Organizacional & Indicadores de Gente",
                    "Gestão de Cargos e Salários & Plano de Carreira",
                    "Política de Benefícios & Programas de Saúde e Qualidade de Vida",
                    "Educação Corporativa & Aprendizagem Contínua",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Módulo Comercial */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">MÓDULO COMERCIAL</h3>
                <ul className="space-y-2">
                  {[
                    "Estabelecimento de Metas",
                    "Canais de vendas",
                    "Funis de Vendas",
                    "Integração com Marketing",
                    "Indicadores Comerciais",
                    "Análise e Monitoramento",
                    "Desenvolvimento de Líderes Comerciais",
                    "Equipes de alto rendimento e engajamento de equipe",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Módulo Financeiro */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">MÓDULO FINANCEIRO</h3>
                <ul className="space-y-2">
                  {[
                    "Teoria financeira básica",
                    "Indicadores Financeiros e sua Aplicação",
                    "Planejamento Financeiro e Orçamentário",
                    "Impostos",
                    "Fluxos de Caixa",
                    "Dashboards BI",
                    "DRE",
                    "Cobrança",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            {/* New Banner */}
            <div className="max-w-3xl mx-auto mb-16 bg-destructive/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-destructive">
                O que você perde SEM uma gestão profissional:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Equipes desalinhadas = Prejuízos mensuráveis",
                  "Decisões no escuro = Risco financeiro",
                  "Talento subutilizado = Potencial desperdiçado",
                  "Time desmotivado = Rotatividade alta",
                  "Falta de KPIs/indicadores de resultados = Navio sem bússola",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-destructive/5 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-destructive"></div>
                    <p className="text-sm font-medium text-destructive">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Award className="mr-2 h-4 w-4" />
                <span className="font-medium">Resultados Comprovados</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefícios para VOCÊ e sua Empresa</h2>
              <p className="text-lg text-muted-foreground">
                Ao investir no desenvolvimento da sua liderança com a Oficina de Líderes, você e sua empresa obtém
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
                  Desenvolvimento de competências técnicas e comportamentais para lidar com desafios empresariais da
                  região.
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
                  <h2 className="text-3xl font-bold mb-4">Detalhes da Oficina de Líderes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Formato</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Encontros presenciais semanais de 2h</p>
                          <p className="text-sm text-muted-foreground">
                            Região do Baixo Vale/SC e em breve, também em Campo Grande/MS.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">04 módulos completos</p>
                          <p className="text-sm text-muted-foreground">Com carga horária de 20h cada - Total de 80h</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Turmas reduzidas</p>
                          <p className="text-sm text-muted-foreground">Máximo de 20 participantes</p>
                        </div>
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium mt-6 mb-4">Público-alvo</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Empresários e Gestores</p>
                          <p className="text-sm text-muted-foreground">
                            Micros, pequenas e médias empresas. Empresas de grande porte - Consulte-nos para programas
                            customizados
                          </p>
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
                    <h3 className="text-xl font-medium mb-4">Regiões Atendidas</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 mb-4">
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

                    <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-3">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Campo Grande - MS</h4>
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Em breve</span>
                      </div>
                      <p className="pl-7 text-sm text-muted-foreground">
                        Turmas presenciais em Campo Grande/MS em breve
                      </p>
                    </div>

                    <h3 className="text-xl font-medium mb-4">Investimento</h3>
                    <p className="text-muted-foreground mb-4">
                      Opções de investimento personalizadas para cada empresa, com condições especiais para grupos de
                      colaboradores da mesma organização.
                    </p>

                    <div className="mt-6">
                      <Button size="lg" className="w-full" asChild>
                        <a href="#lead-form">Solicitar proposta personalizada</a>
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
                  <h2 className="text-3xl font-bold mb-4">Transforme sua gestão agora</h2>
                  <p className="text-lg text-muted-foreground">
                    Preencha o formulário abaixo para receber mais informações sobre a Oficina de Líderes e garantir sua
                    vaga.
                  </p>
                </div>

                <OficinaLideresLeadForm />

                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="font-medium mb-2">Prefere falar diretamente conosco?</h4>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-primary mr-2" />
                    <a
                      href="https://wa.me/+5547992150289"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
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

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Perguntas Frequentes</h2>

              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">A Oficina de Líderes é presencial ou online?</h3>
                  <p className="text-muted-foreground">
                    A Oficina de Líderes é 100% presencial. Acreditamos que o networking e a troca de experiências
                    presenciais são fundamentais para o desenvolvimento de líderes.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Qual é a carga horária total do curso?</h3>
                  <p className="text-muted-foreground">
                    O programa tem carga horária de 120 horas, distribuídas em módulos semanais de 4 horas cada, ao
                    longo de 6 meses. Incluímos também atividades práticas e networking entre os participantes.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Preciso ter experiência prévia em gestão?</h3>
                  <p className="text-muted-foreground">
                    Não é necessário ter experiência prévia. O programa é estruturado desde conceitos básicos até
                    técnicas avançadas, sendo adequado tanto para novos gestores quanto para líderes experientes que
                    buscam aperfeiçoamento.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Quantas pessoas participam de cada turma?</h3>
                  <p className="text-muted-foreground">
                    Mantemos turmas reduzidas com máximo de 20 participantes para garantir atenção personalizada,
                    qualidade nas discussões e maior aproveitamento do conteúdo por cada participante.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Recebo certificado ao final do curso?</h3>
                  <p className="text-muted-foreground">
                    Sim, ao concluir a Oficina de Líderes, você recebe certificado de conclusão reconhecido, além de
                    acesso vitalício ao material didático e à comunidade de ex-alunos para networking contínuo.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Quando será a próxima turma?</h3>
                  <p className="text-muted-foreground">
                    As turmas iniciam trimestralmente. Para saber sobre a próxima turma disponível e garantir sua vaga,
                    entre em contato conosco através do WhatsApp ou preencha o formulário de interesse.
                  </p>
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
export default OficinaLideres;
