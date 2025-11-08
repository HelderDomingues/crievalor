import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MentorPropostoBetaBanner from "@/components/MentorPropostoBetaBanner";
import { Anchor, Users, Lightbulb, TrendingUp, Building, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { OrganizationSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

const Sobre = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Sobre a Crie Valor - Inteligência Organizacional | Sistema de IA para Empresas</title>
        <meta name="description" content="Conheça a Crie Valor - Inteligência Organizacional. Sistema proprietário com IA para transformação empresarial em Campo Grande/MS e Navegantes/SC. Mais de 10 anos de experiência." />
        <meta name="keywords" content="sobre crie valor, inteligência organizacional, consultoria em IA, transformação digital campo grande ms, consultoria navegantes sc, sistema proprietário empresas, história empresa consultoria" />
        <link rel="canonical" href="https://crievalor.com.br/sobre" />
        <meta property="og:title" content="Sobre a Crie Valor - Inteligência Organizacional" />
        <meta property="og:description" content="Sistema de Inteligência Organizacional com IA que transforma empresas. Escritórios em Campo Grande/MS e Navegantes/SC." />
        <meta property="og:url" content="https://crievalor.com.br/sobre" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.jpg" />
      </Helmet>
      
      <OrganizationSchema 
        url="https://crievalor.com.br"
        logo="https://crievalor.com.br/lovable-uploads/fc868084-d22b-4877-907b-fe02e64fc501.png"
      />
      
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "Sobre", url: "https://crievalor.com.br/sobre" }
        ]}
      />
      
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Mentor de Propósito BETA Banner */}
        <MentorPropostoBetaBanner />
        
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute w-full h-full object-cover opacity-20"
              >
                <source src="https://elements-video-cover-images-0.imgix.net/files/127898251/preview.mp4?auto=compress&crop=edges&fit=crop&fm=webm&h=630&w=1200&s=c02f382afdd899a14a67fa1c8d348947" type="video/mp4" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre a <span className="text-primary">Crie Valor</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Transformando negócios através da inteligência integrada e estratégias personalizadas.
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
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Nossa Jornada
                </h2>
                <p className="text-muted-foreground mb-4">
                  A Crie Valor é uma empresa de consultoria com mais de dez anos de experiência, 
                  dedicada a auxiliar empresas a atingirem seus objetivos por meio de projetos 
                  personalizados que atendem às necessidades específicas de cada negócio.
                </p>
                <p className="text-muted-foreground mb-4">
                  Adotamos uma abordagem holística, reconhecendo que cada área de uma organização 
                  influencia as demais, funcionando como um organismo vivo onde pequenas variações 
                  podem afetar o todo.
                </p>
                <p className="text-muted-foreground">
                  Com escritórios em Navegantes, Santa Catarina, e Campo Grande, Mato Grosso do Sul, 
                  estamos posicionados para atender clientes em diferentes regiões, oferecendo serviços 
                  que abrangem desde estratégia e gestão até branding e identidade visual.
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
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"></path>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Manifesto Crie Valor
                </h2>
                <div className="flex justify-center mb-6">
                  <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg">
                  Na intersecção entre criatividade humana e nossa metodologia proprietária, descobrimos um novo horizonte para a consultoria estratégica. Nascemos do encontro entre a visão criativa da publicidade e a profundidade analítica da psicologia organizacional, e hoje evoluímos ao integrar tecnologias que amplificam o potencial humano.
                </p>
                
                <p className="text-lg">
                  Compreendemos que empresas são, acima de tudo, pessoas. Pessoas que enfrentam diariamente o desafio de tomar decisões complexas em um cenário de incertezas. Sentimos na pele essas mesmas dores em nossa jornada empreendedora. Conhecemos a sobrecarga, a pressão constante, e a busca por clareza quando tudo parece nebuloso.
                </p>
                
                <p className="text-lg">
                  Nossa jornada agora abraça a inovação com tecnologias de ponta, transformando-nos em pioneiros de um modelo híbrido que preserva o que há de mais valioso - a compreensão humana das emoções e contextos - enquanto potencializa resultados através da capacidade analítica da nossa metodologia proprietária.
                </p>
                
                <p className="text-lg">
                  Estamos aqui para proporcionar clareza onde há confusão, confiança onde há dúvida, e direção onde antes havia hesitação. Não somos apenas consultores, somos parceiros na jornada, amplificadores de potencial que enxergam além do óbvio.
                </p>
                
                <p className="text-lg">
                  A Crie Valor existe para iluminar caminhos através da inteligência integrada, transformando dados em insights, desafios em oportunidades, e aspirações em realidades tangíveis.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O que oferecemos
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça nossos serviços e soluções para impulsionar o seu negócio
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
                  description: "Uma ferramenta que utiliza nossa metodologia proprietária para criar planos estratégicos sob medida, visando otimizar suas operações, aumentar suas vendas e alcançar seus objetivos empresariais."
                },
                {
                  icon: Building,
                  title: "Consultoria Estratégica",
                  description: "Serviços personalizados de consultoria para ajudar empresas a definirem direções claras, metas alcançáveis e estratégias eficazes para crescimento sustentável."
                },
                {
                  icon: TrendingUp,
                  title: "Branding e Identidade Visual",
                  description: "Desenvolvimento de marcas fortes e identidades visuais que conectam sua empresa com seu público-alvo, criando reconhecimento e valor."
                },
                {
                  icon: Users,
                  title: "Oficina de Líderes",
                  description: "Programas de desenvolvimento onde você pode aprimorar suas habilidades de liderança e gestão com nossos especialistas de mercado."
                },
                {
                  icon: Lightbulb,
                  title: "Inovação e Transformação Digital",
                  description: "Consultoria para implementação de tecnologias e processos inovadores que modernizam e otimizam a operação do seu negócio."
                },
                {
                  icon: Star,
                  title: "Mentoria Executiva",
                  description: "Acompanhamento personalizado para líderes e gestores, fornecendo orientação estratégica e suporte na tomada de decisões."
                }
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-card rounded-xl p-6 border border-border hover:glow-border transition-all duration-300"
                >
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <service.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Cliente Ideal
              </h2>
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
                O perfil ideal para o produto MAR – Mapa para Alto Rendimento não se resume apenas a "empresas e empreendedores", 
                mas a líderes que já compreendem (ou desejam compreender) o valor de uma estratégia bem estruturada para o crescimento sustentável.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Mentalidade de Crescimento</h4>
                    <p className="text-muted-foreground">
                      São donos de empresas, CEOs ou gestores que não se contentam com o status quo e estão sempre 
                      em busca de maneiras de melhorar e escalar seus negócios.
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
                      Buscam eliminar o "achismo" das decisões e preferem investir em análises estratégicas que 
                      lhes ofereçam clareza e direcionamento.
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
