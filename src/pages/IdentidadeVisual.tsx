
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { Palette, Image, Eye, PenTool, Layout } from "lucide-react";

const IdentidadeVisual = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection
          title="Identidade Visual"
          subtitle="Branding e Design"
          description="Desenvolvimento de marcas e identidades visuais que comunicam a essência do seu negócio e conectam-se com seu público-alvo."
          ctaText="Solicitar Orçamento"
          ctaUrl="#contato"
          secondaryCtaText="Ver Portfólio"
          secondaryCtaUrl="#portfolio"
        />
        
        {/* Services Section */}
        <section className="py-16 md:py-24 bg-secondary/10 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossos Serviços de Design
              </h2>
              <p className="text-lg text-muted-foreground">
                Criamos identidades visuais que transmitem valor, geram reconhecimento 
                e fortalecem o posicionamento da sua marca.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="bg-pink-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Palette className="text-pink-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Desenvolvimento de Marca</h3>
                <p className="text-muted-foreground">
                  Criação de logos, símbolos e sistemas visuais completos que representam 
                  a essência e os valores da sua empresa.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="bg-purple-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Eye className="text-purple-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Brand Strategy</h3>
                <p className="text-muted-foreground">
                  Desenvolvimento de estratégias de posicionamento e comunicação 
                  para fortalecer a percepção da sua marca no mercado.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="bg-blue-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Layout className="text-blue-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Design de Interfaces</h3>
                <p className="text-muted-foreground">
                  Criação de interfaces digitais intuitivas e atraentes para sites e 
                  aplicativos, alinhadas à identidade da sua marca.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="bg-amber-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <PenTool className="text-amber-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Design Editorial</h3>
                <p className="text-muted-foreground">
                  Desenvolvimento de materiais impressos e digitais com layouts 
                  profissionais que transmitem credibilidade.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="bg-emerald-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Image className="text-emerald-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Social Media Design</h3>
                <p className="text-muted-foreground">
                  Criação de templates e peças visuais para redes sociais que 
                  geram engajamento e fortalecem a presença digital.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                <div className="bg-indigo-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Palette className="text-indigo-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Brand Guidelines</h3>
                <p className="text-muted-foreground">
                  Desenvolvimento de manuais de identidade visual com diretrizes 
                  claras para aplicação consistente da marca.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Process Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Processo Criativo
              </h2>
              <p className="text-lg text-muted-foreground">
                Um método estruturado que alia criatividade e estratégia para 
                desenvolver identidades visuais de alto impacto.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative border-l border-primary/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary transform -translate-x-2"></div>
                <h3 className="text-xl font-medium mb-2">1. Descoberta</h3>
                <p className="text-muted-foreground">
                  Entendemos a fundo o seu negócio, valores, público-alvo e objetivos 
                  através de um processo detalhado de imersão e pesquisa.
                </p>
              </div>
              
              <div className="relative border-l border-primary/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary transform -translate-x-2"></div>
                <h3 className="text-xl font-medium mb-2">2. Estratégia</h3>
                <p className="text-muted-foreground">
                  Definimos o posicionamento visual da marca, alinhando elementos 
                  estéticos aos objetivos estratégicos do negócio.
                </p>
              </div>
              
              <div className="relative border-l border-primary/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary transform -translate-x-2"></div>
                <h3 className="text-xl font-medium mb-2">3. Criação</h3>
                <p className="text-muted-foreground">
                  Desenvolvemos conceitos visuais e exploramos possibilidades criativas
                  que traduzam a essência da marca em elementos gráficos.
                </p>
              </div>
              
              <div className="relative border-l border-primary/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary transform -translate-x-2"></div>
                <h3 className="text-xl font-medium mb-2">4. Refinamento</h3>
                <p className="text-muted-foreground">
                  Aprimoramos as propostas com base em feedback, garantindo que todos os 
                  elementos visuais estejam alinhados e coesos.
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary transform -translate-x-2"></div>
                <h3 className="text-xl font-medium mb-2">5. Implementação</h3>
                <p className="text-muted-foreground">
                  Entregamos todos os arquivos e guias necessários para aplicação 
                  consistente da identidade visual em diferentes meios.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Portfolio Placeholder Section */}
        <section id="portfolio" className="py-16 md:py-24 bg-secondary/10 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Portfólio
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça alguns dos projetos de identidade visual que desenvolvemos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className="aspect-square bg-secondary/50 flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground opacity-30" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Projeto {item}</h3>
                    <p className="text-sm text-muted-foreground">Identidade Visual</p>
                  </div>
                </div>
              ))}
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

export default IdentidadeVisual;
