
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ContactSection from "@/components/ContactSection";
import PortfolioGallery from "@/components/PortfolioGallery";
import { Palette, Image, Eye, PenTool, Layout, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { getPortfolioProjects } from "@/services/portfolioService";
import { PortfolioProject } from "@/types/portfolio";

const heroImages = [
  "https://images.unsplash.com/photo-1561069934-eee225952461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583396796390-1c1a482d3c9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
];

const IdentidadeVisual = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([]);
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['portfolioProjects'],
    queryFn: getPortfolioProjects
  });

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(projects.map(project => project.category)))];

  // Filter projects when activeFilter or projects change
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter, projects]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <section className="relative h-[80vh] overflow-hidden">
          <HeroCarousel images={heroImages}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                Identidade Visual
              </h1>
              <p className="text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Criamos marcas memoráveis que comunicam a essência do seu negócio
                e conectam-se com seu público-alvo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button size="lg" asChild>
                  <a href="#portfolio">Ver Portfólio</a>
                </Button>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black" size="lg" asChild>
                  <a href="#contato">Solicitar Orçamento</a>
                </Button>
              </div>
            </div>
          </HeroCarousel>
        </section>
        
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
        
        {/* Portfolio Section */}
        <section id="portfolio" className="py-16 md:py-24 bg-secondary/10 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nosso Portfólio
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Conheça alguns dos projetos de identidade visual que desenvolvemos.
              </p>
              
              {/* Filtros de categoria */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeFilter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(category)}
                    className="capitalize"
                  >
                    {category === "all" ? "Todos" : category}
                  </Button>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">Carregando projetos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Erro ao carregar projetos. Por favor, tente novamente.
              </div>
            ) : filteredProjects.length > 0 ? (
              <PortfolioGallery projects={filteredProjects} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum projeto encontrado nesta categoria.
              </div>
            )}
            
            {/* Link para área administrativa */}
            <div className="mt-12 text-center">
              <Link to="/portfolio-admin" className="inline-flex items-center text-primary hover:underline">
                Gerenciar projetos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Showcase: Before and After */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Transformações de Marca
              </h2>
              <p className="text-lg text-muted-foreground">
                Veja o impacto visual de algumas das nossas transformações de marca.
              </p>
            </div>
            
            <Tabs defaultValue="case1" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="case1">Caso 1</TabsTrigger>
                <TabsTrigger value="case2">Caso 2</TabsTrigger>
                <TabsTrigger value="case3">Caso 3</TabsTrigger>
              </TabsList>
              
              <TabsContent value="case1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-card border border-border rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                        <span className="text-muted-foreground">Antes</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">Marca Original</h3>
                    <p className="text-muted-foreground">
                      Identidade visual desatualizada que não refletia os valores modernos da empresa.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="aspect-video bg-card border border-border rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <span className="text-primary">Depois</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">Nova Identidade</h3>
                    <p className="text-muted-foreground">
                      Redesenho moderno e versátil que captura a essência inovadora da marca.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="case2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-card border border-border rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                        <span className="text-muted-foreground">Antes</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">Marca Original</h3>
                    <p className="text-muted-foreground">
                      Logo com problemas de legibilidade e aplicação em diferentes mídias.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="aspect-video bg-card border border-border rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <span className="text-primary">Depois</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">Nova Identidade</h3>
                    <p className="text-muted-foreground">
                      Sistema visual consistente e adaptável para múltiplas plataformas.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="case3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-card border border-border rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                        <span className="text-muted-foreground">Antes</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">Marca Original</h3>
                    <p className="text-muted-foreground">
                      Identidade visual inconsistente e sem diretrizes claras de aplicação.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="aspect-video bg-card border border-border rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <span className="text-primary">Depois</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium">Nova Identidade</h3>
                    <p className="text-muted-foreground">
                      Sistema visual coeso com manual completo de aplicação em diferentes contextos.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 relative bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para transformar sua marca?
              </h2>
              <p className="text-lg text-muted-foreground">
                Entre em contato conosco para uma consulta gratuita e 
                descubra como podemos ajudar a elevar a identidade visual do seu negócio.
              </p>
              <Button size="lg" asChild>
                <a href="#contato">Solicitar Orçamento</a>
              </Button>
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
