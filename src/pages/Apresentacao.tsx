import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, Target, Users, Brain, Lightbulb, Palette, Zap, ExternalLink, QrCode, Mail, Phone, Globe } from 'lucide-react';
import { FlagIcon } from '@/components/ui/flag-icon';
import crieValorLogo from '@/assets/crie-valor-logo.png';
import marLogo from '@/assets/mar-logo.png';
import marLogoHorizontal from '@/assets/mar-logo-horizontal.png';
import lumiaLogo from '@/assets/lumia-logo.png';
import VideoBackground from '@/components/VideoBackground';
import mentorPropositoTransparent from '@/assets/mentor-proposito-transparent.png';
import mentorPropositoHorizontal from '@/assets/mentor-proposito-horizontal.png';
import oficinaLideresTransparent from '@/assets/oficina-lideres-logo-transparent.png';

// Using transparent logos
const mentorPropositoLogo = mentorPropositoTransparent;
const oficinaLideresLogo = oficinaLideresTransparent;
const ApresentacaoPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  const slides = [
  // Slide 1 - Capa
  {
    id: 'capa',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12 px-20">
          <img src={crieValorLogo} alt="Crie Valor" className="h-24 mb-12" />
          
        </div>
  },
  // Slide 2 - Nosso Propósito
  {
    id: 'proposito',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <div className="flex items-center space-x-6 mb-12">
            <FlagIcon size={64} className="text-primary" />
            <h2 className="text-6xl font-bold">Nosso Propósito</h2>
          </div>
          <div className="max-w-6xl space-y-12">
            <h3 className="text-5xl font-semibold text-white leading-tight">
              "Gerar clareza e direção para as empresas, fazendo da atitude o motor do crescimento"
            </h3>
            <div className="grid grid-cols-3 gap-12 mt-20">
              <div className="space-y-6">
                <Target className="h-16 w-16 text-primary mx-auto" />
                <h4 className="text-3xl font-semibold">Clareza Estratégica</h4>
                <p className="text-xl text-muted-foreground">Definimos direções precisas e objetivos alcançáveis</p>
              </div>
              <div className="space-y-6">
                <Zap className="h-16 w-16 text-primary mx-auto" />
                <h4 className="text-3xl font-semibold">Atitude Transformadora</h4>
                <p className="text-xl text-muted-foreground">Agimos com foco em crescimento e execução</p>
              </div>
              <div className="space-y-6">
                <Users className="h-16 w-16 text-primary mx-auto" />
                <h4 className="text-3xl font-semibold">Resultados Sustentáveis</h4>
                <p className="text-xl text-muted-foreground">Entregamos crescimento consistente e duradouro</p>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 3 - O que Fazemos
  {
    id: 'o-que-fazemos',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12 px-20">
          <h2 className="text-6xl font-bold mb-12">O Que Fazemos</h2>
          <div className="max-w-6xl">
            <p className="text-3xl text-muted-foreground leading-relaxed">
              Desenvolvemos soluções integradas de inteligência organizacional que conectam estratégia, tecnologia e pessoas.
            </p>
          </div>
        </div>
  },
  // Slide 4 - Ecossistema de Inteligência
  {
    id: 'ecossistema',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-20 px-20">
          <h2 className="text-6xl font-bold">Ecossistema de Inteligência Organizacional</h2>
          <div className="grid grid-cols-2 gap-16 max-w-5xl">
            <div className="flex items-center justify-center">
              <img src={marLogoHorizontal} alt="MAR" className="h-32" />
            </div>
            <div className="flex items-center justify-center">
              <img src={lumiaLogo} alt="Lumia" className="h-32" />
            </div>
            <div className="flex items-center justify-center">
              <img src={mentorPropositoHorizontal} alt="Mentor de Propósito" className="h-40" />
            </div>
            <div className="flex items-center justify-center">
              <img src={oficinaLideresLogo} alt="Oficina de Líderes" className="h-36" />
            </div>
          </div>
        </div>
  },
  // Slide 5 - MAR
  {
    id: 'mar',
    content: <div className="flex items-center justify-center h-full px-20">
          <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
            <div className="space-y-10">
              <h2 className="text-5xl font-bold">MAR - Mapa para Alto Rendimento</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Ferramenta digital construida por profissionais com mais de 20 anos de mercado que entrega
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Diagnóstico 360º da empresa</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Identificação de gaps</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Definição de Objetivos Estratégicos</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Planos de Ação personalizados e prontos para execução</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl font-bold text-primary">Entregue em até 24h.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-center space-y-8">
                  <img src={marLogo} alt="MAR" className="h-44 mx-auto" />
                  <h3 className="text-3xl font-semibold">Metodologia Inovadora</h3>
                  <p className="text-xl text-muted-foreground">Resultados mensuráveis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 6 - Lumia
  {
    id: 'lumia',
    content: <div className="flex items-center justify-center h-full px-20">
          <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
            <div className="space-y-10">
              <h2 className="text-5xl font-bold">Lumia - Consultores Virtuais</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Sistema de consultores virtuais especializados, oferecendo insights e suporte 24/7 para acelerar o crescimento
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Suporte especializado 24/7</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Integração com metodologia MAR</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Totalmente personalizado para sua empresa.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-primary/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-center space-y-8">
                  <img src={lumiaLogo} alt="Lumia" className="h-32 mx-auto" />
                  <h3 className="text-3xl font-semibold">Sistema de Consultores Virtuais</h3>
                  <p className="text-xl text-muted-foreground">Conhecimento especializado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 7 - Mentor de Propósito
  {
    id: 'mentor-proposito',
    content: <div className="flex items-center justify-center h-full px-20">
          <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
            <div className="space-y-10">
              <h2 className="text-5xl font-bold">Mentor de Propósito</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Ferramenta que ajuda organizações a descobrir e articular seu propósito autêntico por meio de diálogos estruturados.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Descoberta de propósito organizacional</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Alinhamento cultural profundo</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Engajamento de colaboradores</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Diferenciação competitiva</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-primary/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-center space-y-8">
                  <img src={mentorPropositoLogo} alt="Mentor de Propósito" className="h-52 mx-auto" />
                  <h3 className="text-3xl font-semibold">Propósito Autêntico</h3>
                  <p className="text-xl text-muted-foreground">Conectando essência com estratégia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 8 - Educação Corporativa (trocado com serviços)
  {
    id: 'educacao',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12 px-20">
          <h2 className="text-4xl font-bold mb-12">Educação Corporativa</h2>
          <div className="max-w-5xl space-y-16">
            <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
              <div className="space-y-8">
                <img src={oficinaLideresLogo} alt="Oficina de Líderes" className="h-36 mx-auto" />
                <p className="text-2xl text-muted-foreground">
                  Programa intensivo de desenvolvimento de liderança para empresários, gestores, gerentes, supervisores e diretores
                </p>
                <div className="bg-card/50 p-6 rounded-xl mb-6">
                  <h4 className="text-2xl font-semibold mb-4">Metodologia 70/20/10</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">70%</div>
                      <div className="text-lg text-muted-foreground">Prática</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">20%</div>
                      <div className="text-lg text-muted-foreground">Troca Social</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">10%</div>
                      <div className="text-lg text-muted-foreground">Teoria</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-8 mt-8">
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-primary">+ de 1000</div>
                    <div className="text-lg text-muted-foreground">líderes formados</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-lg text-muted-foreground">satisfação</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-primary">4</div>
                    <div className="text-lg text-muted-foreground">módulos especializados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 9 - Serviços (trocado com educação)
  {
    id: 'servicos',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12 px-20">
          <h2 className="text-6xl font-bold mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-3 gap-16 max-w-6xl">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
              <Target className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-2xl font-semibold">Consultorias & Projetos Customizados</h3>
              <p className="text-xl text-muted-foreground">Soluções estratégicas sob medida para desafios específicos</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
              <Users className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-2xl font-semibold">Mentorias Especializadas</h3>
              <p className="text-xl text-muted-foreground">Gestão • Marketing • Recursos Humanos</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
              <Palette className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-2xl font-semibold">Branding & Identidade Visual</h3>
              <p className="text-xl text-muted-foreground">Construção de marca autêntica e diferenciada</p>
            </div>
          </div>
        </div>
  },
  // Slide 10 - Fechamento CTA
  {
    id: 'fechamento',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-16 px-20 py-16">
          <div className="space-y-8">
            <img src={crieValorLogo} alt="Crie Valor" className="h-20 mx-auto" />
            <h2 className="text-6xl font-bold">Vamos Transformar Sua Empresa?</h2>
            <p className="text-3xl text-muted-foreground max-w-5xl">
              Descubra como podemos acelerar seus resultados
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-24 max-w-5xl w-full">
            <div className="space-y-8">
              <h3 className="text-3xl font-semibold">Contatos</h3>
              <div className="space-y-8">
                <div className="flex items-center justify-center space-x-4">
                  <Phone className="h-10 w-10 text-primary" />
                  <span className="text-3xl font-semibold">(67) 99654-2991</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Mail className="h-8 w-8 text-primary" />
                  <span className="text-2xl">contato@crievalor.com.br</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-3xl font-semibold">Acesse Nosso Site</h3>
              <div className="bg-white p-8 rounded-xl">
                <QrCode className="h-40 w-40 text-slate-900 mx-auto" />
                <p className="text-slate-900 mt-6 font-medium text-xl">crievalor.com.br</p>
              </div>
            </div>
          </div>

        </div>
  }];
  return <>
      <Helmet>
        <title>Apresentação Institucional - Crie Valor Consultoria</title>
        <meta name="description" content="Apresentação institucional da Crie Valor. Conheça nossos serviços, projetos e soluções em inteligência organizacional com IA." />
        <link rel="canonical" href="https://crievalor.com.br/apresentacao" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <VideoBackground />
      </div>
      
      {/* Fullscreen functionality */}
      <div className="absolute top-4 left-4 z-20">
        <Button onClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }} variant="outline" size="sm" className="bg-card/80 backdrop-blur-sm border-border">
          Tela Cheia
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Slide Counter */}
        <div className="absolute top-4 right-4 z-20 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
          {current} / {count}
        </div>
        
        {/* Carousel */}
        <Carousel setApi={setApi} className="flex-1">
          <CarouselContent className="h-screen">
            {slides.map(slide => <CarouselItem key={slide.id} className="h-screen flex items-center justify-center">
                {slide.content}
              </CarouselItem>)}
          </CarouselContent>
          
          {/* Navigation */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-card/80 backdrop-blur-sm border-border hover:bg-card" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-card/80 backdrop-blur-sm border-border hover:bg-card" />
        </Carousel>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {Array.from({
            length: count
          }, (_, i) => <button key={i} onClick={() => api?.scrollTo(i)} className={`w-2 h-2 rounded-full transition-all ${i + 1 === current ? 'bg-primary w-8' : 'bg-muted-foreground/50'}`} />)}
        </div>
      </div>
      
      {/* Hide cookies and WhatsApp components */}
      <style>{`
        .cookie-consent, .whatsapp-widget, .floating-cta, .quick-cta, .chatbot-container {
          display: none !important;
        }
      `}</style>
    </div>
    </>;
};
export default ApresentacaoPage;