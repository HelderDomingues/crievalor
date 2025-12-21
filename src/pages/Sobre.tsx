import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Anchor, Users, Lightbulb, TrendingUp, Building, Star, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { OrganizationSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import FounderJourneySection from "@/components/home/FounderJourneySection";

const Sobre = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>O que é Inteligência Organizacional e Como Aplicá-la em Empresas Brasileiras? | Crie Valor</title>
        <meta
          name="description"
          content="Helder Domingues e Paulo Gaudioso, fundadores da Crie Valor, criaram o primeiro Ecossistema de Inteligência Organizacional com IA do Brasil. 26+ e 27+ anos de experiência transformando empresas desde 2015."
        />
        <meta
          name="keywords"
          content="inteligência organizacional, o que é inteligência organizacional, como implementar inteligência organizacional, sistema de inteligência organizacional, consultoria em IA, transformação digital, planejamento estratégico com IA, helder domingues, paulo gaudioso, crie valor"
        />
        <link rel="canonical" href="https://crievalor.com.br/sobre" />
        <meta property="og:title" content="O que é Inteligência Organizacional? | Crie Valor" />
        <meta
          property="og:description"
          content="Conheça Helder Domingues e Paulo Gaudioso, arquitetos do primeiro Ecossistema de Inteligência Organizacional com IA do Brasil."
        />
        <meta property="og:url" content="https://crievalor.com.br/sobre" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.jpg" />
      </Helmet>

      {/* Enhanced Organization Schema with Entity Chaining */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://crievalor.com.br/#organization",
          "name": "Crie Valor - Inteligência Organizacional",
          "url": "https://crievalor.com.br",
          "logo": "https://crievalor.com.br/lovable-uploads/fc868084-d22b-4877-907b-fe02e64fc501.png",
          "description": "Primeiro Ecossistema de Inteligência Organizacional com IA do Brasil",
          "foundingDate": "2015-04",
          "founder": [
            {
              "@type": "Person",
              "@id": "https://crievalor.com.br/#helder-domingues",
              "name": "Helder Domingues",
              "jobTitle": "Fundador e Arquiteto do Ecossistema",
              "sameAs": [
                "https://www.linkedin.com/in/helderdomingues/"
              ],
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Universidade Católica Dom Bosco"
              },
              "knowsAbout": ["Marketing", "Branding", "Planejamento Estratégico", "Inteligência Artificial", "Desenvolvimento de Produtos"]
            },
            {
              "@type": "Person",
              "@id": "https://crievalor.com.br/#paulo-gaudioso",
              "name": "Paulo Gaudioso",
              "jobTitle": "Co-fundador e Co-autor do Método MAR",
              "sameAs": [
                "https://www.linkedin.com/in/paulogaudioso/"
              ],
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Universidade Católica Dom Bosco"
              },
              "knowsAbout": ["Gestão de Pessoas", "Coaching", "Desenvolvimento Organizacional", "Mentoria", "Transformação de Negócios"]
            }
          ],
          "address": [
            {
              "@type": "PostalAddress",
              "addressLocality": "Campo Grande",
              "addressRegion": "MS",
              "addressCountry": "BR"
            },
            {
              "@type": "PostalAddress",
              "addressLocality": "Navegantes",
              "addressRegion": "SC",
              "addressCountry": "BR"
            }
          ]
        })}
      </script>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "Sobre", url: "https://crievalor.com.br/sobre" },
        ]}
      />

      <Header />

      <main className="flex-grow pt-16">

        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-full">
              <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover opacity-20">
                <source
                  src="https://elements-video-cover-images-0.imgix.net/files/127898251/preview.mp4?auto=compress&crop=edges&fit=crop&fm=webm&h=630&w=1200&s=c02f382afdd899a14a67fa1c8d348947"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="blur-dot w-96 h-96 -top-48 -left-48 opacity-10"></div>
            <div className="blur-dot w-64 h-64 top-1/2 right-0 opacity-5"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* H1 como Pergunta (AEO/GEO) */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                O que é <span className="text-primary">Inteligência Organizacional</span> e Como Aplicá-la em Empresas Brasileiras?
              </h1>

              {/* Answer Capsule (40-60 palavras) */}
              <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-6 text-left">
                <p className="text-lg leading-relaxed">
                  A Crie Valor é a <strong>primeira plataforma brasileira</strong> de Inteligência Organizacional com IA que combina metodologia estratégica robusta (Mapeamento do DNA de Liderança + BSC + Porter) com agentes especializados. Fundada em abril/2015 por Helder Domingues e Paulo Gaudioso, entregamos planos estratégicos em 7 dias (vs 90 dias tradicional) para empresas com 15+ funcionários e faturamento a partir de R$ 150k/mês.
                </p>
              </div>

              <p className="text-xl text-muted-foreground">
                Conheça a plataforma que democratizou planejamento estratégico com IA no Brasil.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-xl p-1">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                      alt="Equipe Crie Valor"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Nossa Jornada</h2>
                <p className="text-muted-foreground mb-4">
                  A Crie Valor é uma empresa de Inteligência Organizacional com mais de dez anos de experiência,
                  dedicada a auxiliar empresas a atingirem seus objetivos por meio de projetos personalizados que
                  atendem às necessidades específicas de cada negócio.
                </p>
                <p className="text-muted-foreground mb-4">
                  Adotamos uma abordagem holística, reconhecendo que cada área de uma organização influencia as demais,
                  funcionando como um organismo vivo onde pequenas variações podem afetar o todo.
                </p>
                <p className="text-muted-foreground">
                  Com escritórios em Navegantes, Santa Catarina, e Campo Grande, Mato Grosso do Sul, estamos
                  posicionados para atender clientes em diferentes regiões, oferecendo serviços e produtos que abrangem
                  desde estratégia e gestão até branding e identidade visual.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="py-16 md:py-24 bg-secondary/30 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blur-dot w-72 h-72 top-1/3 -right-36 opacity-10"></div>
            <div className="blur-dot w-64 h-64 bottom-1/4 -left-32 opacity-5"></div>
            <div className="absolute w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M0,0 L100,0 L100,100 L0,100 Z"
                  fill="none"
                  stroke="rgba(59,130,246,0.1)"
                  strokeWidth="0.5"
                ></path>
                <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"></path>
                <path d="M0,30 Q25,50 50,30 T100,30" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"></path>
                <path d="M0,70 Q25,50 50,70 T100,70" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"></path>
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Manifesto Crie Valor</h2>
                <div className="flex justify-center mb-6">
                  <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg font-medium">Ações revelam crenças.</p>

                <p className="text-lg">
                  O que você faz, ou deixa de fazer, mostra no que realmente acredita. Não o que diz, mas o que suas
                  escolhas diárias provam.
                </p>

                <p className="text-lg">
                  Tem algo que bloqueia esse caminho entre crença e ação: <strong>ruído</strong>.
                </p>

                <p className="text-lg">
                  Não é só barulho. O ruído é Informação demais, desconectada, que gera mais dúvida que esclarece. É
                  apagar incêndios todo dia, enquanto o que é realmente importante fica pra depois.
                </p>

                <p className="text-lg">E no meio de tudo isso, vem o pior: a paralisia.</p>

                <p className="text-lg">
                  Você não age porque não tem clareza. Não decide porque não enxerga direção. Não avança porque não sabe
                  qual passo dar primeiro.
                </p>

                <p className="text-lg">
                  E quando não agimos, a gente, mesmo sem perceber, começa a acreditar que estamos perdidos, que não
                  temos rumo, que mudança é impossível.
                </p>

                <p className="text-lg">A crença vira profecia. A paralisia vira identidade.</p>

                <p className="text-lg font-medium">A Crie Valor existe pra quebrar esse ciclo.</p>

                <p className="text-lg">
                  Acreditamos que a transformação não acontece em insights brilhantes, em passe de mágica. Acontece
                  quando a clareza substitui a confusão. Quando direção substitui deriva. Quando atitude substitui a
                  paralisia.
                </p>

                <p className="text-lg">
                  Por isso, a gente não vende sonhos. Não promete atalho. A gente corta o ruído e gera clareza, sobre
                  quem você é, sobre onde está, e pra onde pode ir.
                </p>

                <p className="text-lg">
                  Quando você tem clareza sobre suas crenças, seu propósito, seu comportamento, o cenário que enfrenta,
                  a decisão deixa de parecer impossível, o caminho deixa de ser incerto e a ação deixa de ser
                  assustadora.
                </p>

                <p className="text-lg">
                  Estrutura não prende, liberta. Processo não engessa, acelera. Planejamento não limita, multiplica.
                </p>

                <p className="text-lg">
                  E quando a ação volta a fluir em sintonia com a crença, tudo muda. Não só a empresa. A vida, a
                  família, a equipe, a história, a satisfação.
                </p>

                <p className="text-lg">
                  <strong>
                    Nosso propósito é gerar clareza e direção para empresas, fazendo da atitude o motor do crescimento.
                  </strong>
                </p>

                <p className="text-lg">Porque ações revelam crenças.</p>

                <p className="text-lg font-medium">E a gente age com propósito!</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founder Journey Section - Hero's Journey Narrative */}
        <FounderJourneySection />

        {/* Services Section */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* H2 como Pergunta (AEO/GEO) */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Quais serviços oferecem soluções para análise de Inteligência Organizacional?
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça o Ecossistema de Inteligência Organizacional da Crie Valor
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: Anchor,
                  title: "MAR - Mapa para Alto Rendimento",
                  description:
                    "Sistema de planejamento estratégico com IA que entrega em 7 dias (vs 90 dias tradicional). Personalizado com Mapeamento do DNA de Liderança + BSC + Porter.",
                  link: "/mar"
                },
                {
                  icon: Sparkles,
                  title: "LUMIA - Consultores Virtuais",
                  description:
                    "6 agentes de IA especializados (Estratégia, Marketing, Vendas, Finanças, Operações, Pessoas) disponíveis 24/7 para decisões do dia a dia.",
                  link: "/lumia"
                },
                {
                  icon: Lightbulb,
                  title: "Mentor de Propósito",
                  description:
                    "Jornada guiada por agente especializado de IA para descobrir o propósito organizacional. Bússola digital para clareza estratégica.",
                  link: "/mentor-proposito"
                },
                {
                  icon: Users,
                  title: "Oficina de Líderes",
                  description:
                    "Programa completo de desenvolvimento de competências de liderança com módulos práticos ministrados por especialistas com vasta experiência empresarial.",
                  link: "/oficina-lideres"
                },
                {
                  icon: TrendingUp,
                  title: "Implementação Assistida",
                  description:
                    "Acompanhamento hands-on para executar o plano do MAR. Reuniões semanais, suporte WhatsApp e validação de execução por 3-6 meses.",
                  link: "/contato"
                },
                {
                  icon: Star,
                  title: "Mentoria Executiva",
                  description:
                    "Sessões estratégicas quinzenais com fundadores (Helder ou Paulo). LUMIA incluso. Sparring partner estratégico contínuo.",
                  link: "/mentorias"
                },
              ].map((service, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <a
                    href={service.link}
                    className="block h-full bg-card border border-border rounded-xl p-6 hover:glow-border hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                          <service.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground flex-1">{service.description}</p>
                      <div className="mt-4 flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
                        Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Client Profile Section */}
        <section className="py-16 md:py-24 bg-secondary/30 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nosso Cliente Ideal</h2>
              <p className="text-lg text-muted-foreground">
                Trabalhamos com líderes visionários que buscam transformação e crescimento
              </p>
            </motion.div>

            <motion.div
              className="bg-card rounded-xl border border-border p-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg mb-6">
                O perfil ideal para o produto MAR – Mapa para Alto Rendimento não se resume apenas a "empresas e
                empreendedores", mas a líderes que já compreendem (ou desejam compreender) o valor de uma estratégia bem
                estruturada para o crescimento sustentável.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Mentalidade de Crescimento</h4>
                    <p className="text-muted-foreground">
                      São donos de empresas, CEOs ou gestores que não se contentam com o status quo e estão sempre em
                      busca de maneiras de melhorar e escalar seus negócios.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Valorizam Decisões Baseadas em Dados</h4>
                    <p className="text-muted-foreground">
                      Buscam eliminar o "achismo" das decisões e preferem investir em análises estratégicas que lhes
                      ofereçam clareza e direcionamento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Foco na Personalização</h4>
                    <p className="text-muted-foreground">
                      Valorizam uma abordagem customizada, onde as estratégias são desenhadas de acordo com as
                      necessidades específicas da sua empresa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Buscam Diferenciação Competitiva</h4>
                    <p className="text-muted-foreground">
                      São empresários que desejam sair na frente da concorrência e que entendem que um planejamento
                      estratégico sólido é o "mapa" que lhes permitirá navegar em um ambiente de alta competitividade.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
