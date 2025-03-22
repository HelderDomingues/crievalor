import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MarExplanation from "@/components/MarExplanation";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import MaritimeWaves from "@/components/MaritimeWaves";
import CompassAnimation from "@/components/CompassAnimation";
import VideoSection from "@/components/VideoSection";
import { motion } from "framer-motion";
import { 
  Brain, 
  BarChart3, 
  ChevronRight, 
  Check, 
  Clock, 
  DollarSign, 
  FileText, 
  LineChart,
  Anchor,
  Compass,
  Map
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Mar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="pt-16 md:pt-24 pb-16 md:pb-24 relative overflow-hidden">
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
            <MaritimeWaves className="opacity-30" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Anchor className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Mapa para Alto Rendimento</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Navegue rumo ao <span className="text-primary">sucesso</span> com o MAR
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Uma abordagem revolucionária que combina IA e consultoria humana para criar estratégias 
                  de negócios excepcionais com velocidade e custo acessível.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="shadow-glow">
                    <a href="#contato">Solicitar uma demonstração</a>
                  </Button>
                  <Button variant="outline" size="lg">
                    <a href="#precos">Ver preços</a>
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-12">
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">2-4</div>
                    <div className="text-sm text-muted-foreground">Semanas para entrega</div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">80%</div>
                    <div className="text-sm text-muted-foreground">Economia de custos</div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">Personalizado</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <div className="bg-card rounded-xl overflow-hidden shadow-xl border border-border p-6 glow-border">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <Compass className="h-6 w-6 text-primary mr-3" />
                        <div>
                          <h3 className="font-bold">MAR</h3>
                          <p className="text-sm text-muted-foreground">Seu mapa estratégico</p>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Anchor className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Análise Inteligente</h4>
                          <p className="text-xs text-muted-foreground">IA + expertise humana</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Map className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Rota Estratégica</h4>
                          <p className="text-xs text-muted-foreground">Plano de ação detalhado</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-secondary/30 rounded-lg flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Métricas e KPIs</h4>
                          <p className="text-xs text-muted-foreground">Acompanhamento de resultados</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center my-6">
                      <CompassAnimation size={150} className="opacity-80" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path 
                fill="rgba(59,130,246,0.05)" 
                fillOpacity="1" 
                d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,160C672,160,768,128,864,112C960,96,1056,96,1152,112C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>
        
        <VideoSection 
          title="Descubra o MAR em Detalhes"
          description="Assista nossa apresentação completa sobre como o MAR pode transformar sua estratégia de negócios."
        />
        
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 top-20 -right-32 opacity-10"></div>
            <div className="blur-dot w-96 h-96 -bottom-48 -left-48 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  O que é o MAR?
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  O MAR é um método híbrido revolucionário que combina o poder da inteligência 
                  artificial com o conhecimento, prática e experiência de consultores humanos
                  para gerar planos estratégicos com análises aprofundadas.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Essa abordagem disruptiva não apenas acelera o processo, como também
                  barateia e democratiza o desenvolvimento de planejamentos estratégicos
                  de alto nível, permitindo que pequenas e médias empresas possam adquirir
                  esse tipo de consultoria por uma fração do preço tradicional.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mais rápido</h4>
                      <p className="text-sm text-muted-foreground">Semanas em vez de meses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mais acessível</h4>
                      <p className="text-sm text-muted-foreground">Fração do custo tradicional</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mais preciso</h4>
                      <p className="text-sm text-muted-foreground">Análises baseadas em dados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mais completo</h4>
                      <p className="text-sm text-muted-foreground">Estratégia + implementação</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-card rounded-xl overflow-hidden shadow-xl border border-border p-6 glow-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <Brain className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Inteligência Artificial</h4>
                      <p className="text-xs text-muted-foreground mt-1">Processamento de dados e análises</p>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <BarChart3 className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Análise de Mercado</h4>
                      <p className="text-xs text-muted-foreground mt-1">Tendências e oportunidades</p>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <Clock className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Velocidade</h4>
                      <p className="text-xs text-muted-foreground mt-1">Entrega em 2-4 semanas</p>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <DollarSign className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Custo Acessível</h4>
                      <p className="text-xs text-muted-foreground mt-1">Até 80% mais barato</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-secondary/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FileText className="h-5 w-5 text-primary mr-2" />
                      O que você recebe
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-1" />
                        <span>Análise completa de mercado e concorrência</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-1" />
                        <span>Identificação de oportunidades e ameaças</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-1" />
                        <span>Plano estratégico detalhado e personalizado</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-1" />
                        <span>Roadmap de implementação com prazos e métricas</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-1" />
                        <span>Sessões de consultoria para alinhamento</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-secondary/30 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Um processo revolucionário
              </h2>
              <p className="text-lg text-muted-foreground">
                Entenda como o MAR transforma dados em estratégias de negócios poderosas
                através de uma metodologia única que combina IA e expertise humana.
              </p>
            </div>
            
            <MarExplanation />
          </div>
        </section>
        
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 top-1/3 -left-32 opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                MAR vs. Consultoria Tradicional
              </h2>
              <p className="text-lg text-muted-foreground">
                Veja como o MAR se compara às abordagens tradicionais de consultoria estratégica.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="col-span-1 lg:col-span-3 grid grid-cols-3 gap-4 bg-secondary/30 rounded-t-xl p-4">
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center">
                  <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-4 py-2 font-medium">
                    MAR
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="inline-flex items-center justify-center bg-muted/30 text-muted-foreground rounded-full px-4 py-2 font-medium">
                    Consultoria Tradicional
                  </div>
                </div>
              </div>
              
              {[
                {
                  feature: "Tempo de desenvolvimento",
                  mar: "2-4 semanas",
                  traditional: "3-6 meses"
                },
                {
                  feature: "Custo",
                  mar: "R$ 3.997 - R$ 11.997",
                  traditional: "R$ 30.000 - R$ 100.000+"
                },
                {
                  feature: "Análise de dados",
                  mar: "IA + Humana",
                  traditional: "Predominantemente humana"
                },
                {
                  feature: "Personalização",
                  mar: "Alta",
                  traditional: "Alta"
                },
                {
                  feature: "Abrangência da análise",
                  mar: "Ampla (big data)",
                  traditional: "Limitada pela capacidade humana"
                },
                {
                  feature: "Implementação",
                  mar: "Plano detalhado + apoio",
                  traditional: "Geralmente separada (custo adicional)"
                }
              ].map((row, index) => (
                <React.Fragment key={index}>
                  <div className="col-span-1 lg:col-span-3 grid grid-cols-3 gap-4 bg-card border-x border-t last:border-b border-border p-4">
                    <div className="col-span-1 font-medium">{row.feature}</div>
                    <div className="col-span-1 text-center">{row.mar}</div>
                    <div className="col-span-1 text-center text-muted-foreground">{row.traditional}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" asChild className="animate-pulse-subtle">
                <a href="#precos">Ver planos e preços</a>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-secondary/30 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Resultados reais para nossos clientes
              </h2>
              <p className="text-lg text-muted-foreground">
                Veja o impacto que o MAR tem gerado para empresas de diversos segmentos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  metric: "30%",
                  description: "Aumento médio na eficiência operacional",
                  icon: LineChart
                },
                {
                  metric: "25%",
                  description: "Crescimento médio em receita após 6 meses",
                  icon: BarChart3
                },
                {
                  metric: "80%",
                  description: "Economia em relação a consultorias tradicionais",
                  icon: DollarSign
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 border border-border hover:glow-border transition-all duration-300"
                >
                  <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2">{item.metric}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <TestimonialCarousel />
            </div>
          </div>
        </section>
        
        <section id="precos">
          <PricingSection />
        </section>
        
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 -bottom-32 -right-32 opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire suas dúvidas sobre o MAR - Mapa para Alto Rendimento
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Como o MAR é diferente de outras consultorias estratégicas?",
                  answer: "O MAR combina o melhor da inteligência artificial com consultoria humana, permitindo análises muito mais amplas e rápidas do que seria possível apenas com análise humana. Isso resulta em estratégias mais completas, desenvolvidas em uma fração do tempo e do custo de consultorias tradicionais."
                },
                {
                  question: "Quanto tempo leva para desenvolver um MAR para minha empresa?",
                  answer: "O tempo médio de desenvolvimento é de 2 a 4 semanas, dependendo da complexidade do seu negócio e do setor. Este prazo é significativamente menor que os 3 a 6 meses típicos de consultorias estratégicas tradicionais."
                },
                {
                  question: "Como garantir que a estratégia gerada pela IA será adequada para meu negócio?",
                  answer: "Cada análise gerada pela IA é revisada, refinada e personalizada por consultores humanos com experiência no seu setor. Combinamos o poder computacional da IA com a sensibilidade e conhecimento humano para garantir estratégias que façam sentido para o seu contexto específico."
                },
                {
                  question: "O MAR é adequado para qualquer tipo de empresa?",
                  answer: "Sim, o MAR foi projetado para ser escalável e adaptável a empresas de todos os tamanhos e setores. Temos planos específicos para pequenas, médias e grandes empresas, com diferentes níveis de profundidade e customização."
                },
                {
                  question: "Como é feita a implementação das estratégias após receber o MAR?",
                  answer: "Todos os planos incluem um roadmap detalhado de implementação, e dependendo do plano escolhido, também oferecemos sessões de consultoria para ajudar na execução das estratégias. Nosso objetivo é não apenas entregar um plano, mas garantir que você tenha as ferramentas necessárias para implementá-lo com sucesso."
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all"
                >
                  <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Ainda tem dúvidas? Entre em contato conosco.
              </p>
              <Button asChild>
                <a href="#contato">Fale Conosco</a>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 relative">
          <ContactSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mar;
