import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Target, Users, TrendingUp, Brain, Compass } from "lucide-react";

const MentorProposito = () => {
  const handleDemonstration = () => {
    const message = encodeURIComponent("Olá, gostaria de agendar uma demonstração do Mentor de Propósito.");
    window.open(`https://wa.me/5547996542991?text=${message}`, '_blank');
  };

  const problems = [
    "Decisões inconsistentes que parecem sempre levar a direções diferentes",
    "Equipes desengajadas que trabalham apenas pelo salário, sem conexão emocional",
    "Dificuldade em reter talentos que buscam mais significado em suas carreiras",
    "Comunicação fragmentada que não ressoa com colaboradores nem clientes",
    "Estratégias que não se sustentam porque falta um 'porquê' claro e convincente",
    "Diferenciação frágil em um mercado onde todos parecem oferecer o mesmo"
  ];

  const steps = [
    {
      number: "1",
      title: "CONEXÃO E CONTEXTUALIZAÇÃO",
      description: "Estabelecemos o cenário para uma exploração significativa, compreendendo o contexto único da sua organização."
    },
    {
      number: "2", 
      title: "COLETA DE HISTÓRIAS",
      description: "Exploramos momentos de excelência, realizações marcantes e experiências formativas que revelam padrões de valor."
    },
    {
      number: "3",
      title: "IDENTIFICAÇÃO DE PADRÕES", 
      description: "Analisamos temas recorrentes, valores fundamentais e contribuições únicas que emergem das histórias compartilhadas."
    },
    {
      number: "4",
      title: "ARTICULAÇÃO DO PROPÓSITO",
      description: "Formulamos uma declaração de propósito clara, inspiradora e acionável que ressoa com a verdadeira essência do seu negócio."
    },
    {
      number: "5",
      title: "APLICAÇÃO E INTEGRAÇÃO",
      description: "Desenvolvemos estratégias práticas para incorporar o propósito descoberto em todas as dimensões da sua organização."
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "CLAREZA ESTRATÉGICA",
      items: [
        "Decisões mais rápidas e alinhadas",
        "Priorização natural do que realmente importa", 
        "Filtro claro para oportunidades e investimentos"
      ]
    },
    {
      icon: Users,
      title: "CULTURA FORTALECIDA",
      items: [
        "Engajamento profundo dos colaboradores",
        "Atração e retenção de talentos alinhados",
        "Colaboração autêntica entre equipes"
      ]
    },
    {
      icon: TrendingUp,
      title: "MARCA DIFERENCIADA", 
      items: [
        "Comunicação que ressoa em nível emocional",
        "Conexão genuína com clientes e parceiros",
        "Posicionamento único em mercados saturados"
      ]
    },
    {
      icon: Brain,
      title: "INOVAÇÃO DIRECIONADA",
      items: [
        "Criatividade ancorada em valores fundamentais",
        "Soluções que refletem o DNA da organização",
        "Evolução consistente com a essência do negócio"
      ]
    }
  ];

  const testimonials = [
    {
      text: "O Mentor de Propósito nos ajudou a articular algo que sempre sentimos, mas nunca conseguimos expressar claramente. Hoje, nosso propósito orienta cada decisão que tomamos, desde o desenvolvimento de produtos até a experiência do cliente.",
      author: "CEO, Empresa de Tecnologia"
    },
    {
      text: "Estávamos crescendo rapidamente, mas perdendo nossa essência no processo. O Mentor de Propósito nos reconectou com o que realmente importa. O resultado foi uma cultura mais forte e uma equipe muito mais engajada.",
      author: "Diretor de RH, Empresa de Varejo"
    },
    {
      text: "Como empresa familiar em transição para a segunda geração, precisávamos encontrar o que nos unia além do sobrenome. O Mentor de Propósito revelou nosso verdadeiro legado e nos deu uma base sólida para o futuro.",
      author: "Fundador, Empresa Familiar"
    }
  ];

  const faqs = [
    {
      question: "O que é exatamente o Mentor de Propósito?",
      answer: "O Mentor de Propósito é uma ferramenta de inteligência conversacional que guia pessoas e organizações na descoberta de seu propósito fundamental, utilizando metodologia baseada no Círculo Dourado de Simon Sinek e enriquecida com técnicas de PNL e psicologia organizacional."
    },
    {
      question: "Como o Mentor de Propósito se integra ao Ecossistema de Inteligência Organizacional?",
      answer: "O Mentor de Propósito é a bússola que orienta todo o Ecossistema, trabalhando em sinergia com o MAR (que traduz o propósito em rotas de ação), a Lumia (que potencializa a busca por respostas) e a Oficina de Líderes (que cultiva mentalidades alinhadas ao propósito)."
    },
    {
      question: "Quanto tempo leva o processo de descoberta do propósito?",
      answer: "O processo é personalizado e varia conforme a complexidade da organização, tipicamente envolvendo de 1 a 6 sessões distribuídas ao longo de algumas semanas."
    },
    {
      question: "Como medimos o retorno sobre o investimento (ROI)?",
      answer: "O ROI é medido através de indicadores quantitativos (engajamento, retenção, produtividade) e qualitativos (clareza estratégica, coerência nas decisões, fortalecimento da cultura)."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Mentor de Propósito - Crie Valor</title>
        <meta name="description" content="Descubra o 'Por Quê' que transforma empresas comuns em marcas extraordinárias. Ferramenta de inteligência conversacional para descoberta do propósito organizacional." />
        <meta property="og:title" content="Mentor de Propósito - Crie Valor" />
        <meta property="og:description" content="A ferramenta de inteligência conversacional que guia líderes e organizações na descoberta do propósito que impulsiona resultados extraordinários." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mentor de Propósito - Crie Valor" />
        <meta name="twitter:description" content="Descubra o 'Por Quê' que transforma empresas comuns em marcas extraordinárias." />
        <link rel="canonical" href="https://crievalor.com.br/mentor-proposito" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Ecossistema de Inteligência Organizacional
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MENTOR DE PROPÓSITO
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                Descubra o "Por Quê" que transforma empresas comuns em marcas extraordinárias
              </p>
              <p className="text-lg mb-8 max-w-3xl mx-auto">
                A ferramenta de inteligência conversacional que guia líderes e organizações na descoberta do propósito que impulsiona resultados extraordinários.
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 shadow-glow"
                onClick={handleDemonstration}
              >
                <Compass className="mr-2 h-5 w-5" />
                Agende uma Demonstração
              </Button>
            </div>
          </div>
        </section>

        {/* Opening Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                O PROPÓSITO É A BÚSSOLA QUE ORIENTA GRANDES JORNADAS
              </h2>
              <div className="prose prose-lg mx-auto text-center">
                <p className="text-lg mb-6">
                  Em um mercado onde todos competem por atenção, o que realmente diferencia uma empresa não é o que ela faz, mas por que ela existe.
                </p>
                <p className="text-lg mb-6">
                  O Mentor de Propósito é a ferramenta revolucionária do Ecossistema de Inteligência Organizacional da Crie Valor que guia você e sua equipe na descoberta do propósito autêntico que está no coração do seu negócio.
                </p>
                <p className="text-lg mb-6">
                  Não se trata apenas de palavras inspiradoras em uma parede.
                </p>
                <p className="text-lg mb-8">
                  Trata-se de encontrar a verdade fundamental que orienta decisões, inspira equipes e cria conexões genuínas com seus clientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                RECONHECE ESTES DESAFIOS?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {problems.map((problem, index) => (
                  <Card key={index} className="border-destructive/20">
                    <CardContent className="p-6">
                      <p className="text-foreground">{problem}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center">
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Estes não são apenas problemas operacionais. São sintomas de uma questão mais profunda: 
                  a ausência de um propósito claro e autêntico que conecte pessoas, decisões e ações.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                APRESENTAMOS O MENTOR DE PROPÓSITO
              </h2>
              <div className="prose prose-lg mx-auto">
                <p className="text-lg mb-6">
                  O Mentor de Propósito é uma ferramenta de inteligência conversacional desenvolvida pela Crie Valor que combina:
                </p>
                <ul className="text-lg mb-8 space-y-2">
                  <li>Metodologia comprovada baseada no Círculo Dourado de Simon Sinek</li>
                  <li>Tecnologia avançada de processamento de linguagem natural e análise de padrões</li>
                  <li>Décadas de experiência em consultoria estratégica e desenvolvimento organizacional</li>
                </ul>
                <p className="text-lg mb-8">
                  Através de conversas profundas e análise de padrões, o Mentor de Propósito guia você em uma jornada de descoberta que revela o verdadeiro "Por Quê" do seu negócio – aquela verdade fundamental que sempre esteve presente, mas talvez nunca tenha sido claramente articulada.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 italic text-lg">
                  "Com o Mentor de Propósito, ajudamos líderes a iluminarem a real motivação por trás do negócio, criando uma bússola interna que orienta desde o planejamento até a execução." — Manifesto Crie Valor
                </blockquote>
              </div>
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleDemonstration}
                >
                  Descubra Seu Propósito
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                UMA JORNADA TRANSFORMADORA EM 5 ETAPAS
              </h2>
              <p className="text-lg text-center text-muted-foreground mb-12">
                O Mentor de Propósito conduz você através de um processo estruturado e profundo:
              </p>
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                            {step.number}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-3 text-primary">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-12">
                <p className="text-xl font-semibold text-primary">
                  Não é apenas uma conversa. É uma transformação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                QUANDO O PROPÓSITO É CLARO, TUDO MAIS SE ALINHA
              </h2>
              <p className="text-lg text-center text-muted-foreground mb-12">
                O Mentor de Propósito não entrega apenas uma declaração de missão. Ele desbloqueia:
              </p>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {benefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <benefit.icon className="h-8 w-8 text-primary mr-3" />
                        <h3 className="text-xl font-bold text-primary">
                          {benefit.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {benefit.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 italic text-lg text-center">
                "E seguiremos firmes, pois acreditamos que quando cada líder desperta para o que realmente importa, toda a empresa se transforma. Quando a equipe eleva seu nível de compromisso, o mercado percebe." — Manifesto Crie Valor
              </blockquote>
            </div>
          </div>
        </section>

        {/* Differentiation Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                ALÉM DE UMA SIMPLES FERRAMENTA DE IA
              </h2>
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-primary">
                      PARTE DE UM ECOSSISTEMA COMPLETO
                    </h3>
                    <p className="text-muted-foreground">
                      Integrado ao Ecossistema de Inteligência Organizacional da Crie Valor, que inclui o MAR (Mapa de Alto Rendimento), Lumia (Sistema de Consultores Virtuais) e a Oficina de Líderes.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-primary">
                      FUNDAMENTADO EM METODOLOGIA COMPROVADA
                    </h3>
                    <p className="text-muted-foreground">
                      Baseado no Círculo Dourado de Simon Sinek e enriquecido com técnicas avançadas de PNL e psicologia organizacional.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-primary">
                      COMBINAÇÃO DE TECNOLOGIA E TOQUE HUMANO
                    </h3>
                    <p className="text-muted-foreground">
                      Alia a eficiência da inteligência artificial com a profundidade da experiência humana em consultoria estratégica.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                O QUE NOSSOS CLIENTES DESCOBRIRAM
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-8">
                      <p className="text-muted-foreground mb-6 italic">
                        "{testimonial.text}"
                      </p>
                      <p className="font-semibold text-primary">
                        — {testimonial.author}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                DESCUBRA O PROPÓSITO QUE TRANSFORMA SEU NEGÓCIO
              </h2>
              <p className="text-xl mb-8 opacity-90">
                O verdadeiro diferencial competitivo não está no que você faz, mas no por que você faz.
              </p>
              <p className="text-lg mb-8 opacity-90">
                O Mentor de Propósito está pronto para guiar você e sua organização nessa jornada transformadora de descoberta.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
                onClick={handleDemonstration}
              >
                Agende uma Demonstração Gratuita
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                PERGUNTAS FREQUENTES
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-4 text-primary">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Crie Valor Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                SOBRE A CRIE VALOR
              </h2>
              <div className="prose prose-lg mx-auto text-center">
                <p className="text-lg mb-6">
                  A Crie Valor é uma empresa de consultoria estratégica que une a criatividade nascida da publicidade, a profundidade da psicologia organizacional e um Ecossistema de Inteligência Organizacional que se expande para além da consultoria tradicional.
                </p>
                <p className="text-lg mb-6">
                  Vivemos a realidade de quem empreende: a pressão, a urgência, a busca incansável por soluções que tragam retorno e possam ser sentidas no faturamento, no clima da equipe e na satisfação de ver um negócio prosperar.
                </p>
                <p className="text-lg mb-8">
                  Nosso propósito não é entregar meros relatórios ou promessas vazias. É inspirar líderes a serem a mudança que desejam ver em suas organizações.
                </p>
              </div>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <a href="/">Conheça Nosso Ecossistema</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                PRONTO PARA INICIAR SUA JORNADA DE PROPÓSITO?
              </h2>
              <p className="text-lg mb-8 text-muted-foreground">
                Entre em contato para uma conversa inicial sem compromisso ou para agendar uma demonstração do Mentor de Propósito.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold mb-2">Telefone</h4>
                    <p className="text-muted-foreground">(67) 99654-2991</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold mb-2">E-mail</h4>
                    <p className="text-muted-foreground">contato@crievalor.com.br</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold mb-2">Site</h4>
                    <p className="text-muted-foreground">www.crievalor.com.br</p>
                  </CardContent>
                </Card>
              </div>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleDemonstration}
              >
                Entre em Contato
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default MentorProposito;