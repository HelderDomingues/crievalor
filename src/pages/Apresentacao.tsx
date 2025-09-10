import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, Target, Users, Brain, Lightbulb, Palette, Zap, ExternalLink, QrCode, Mail, Phone, Globe } from 'lucide-react';
import { FlagIcon } from '@/components/ui/flag-icon';
import crieValorLogo from '@/assets/crie-valor-logo.png';
import marLogo from '@/assets/mar-logo.png';
import lumiaLogo from '@/assets/lumia-logo.png';
import WaveBackground from '@/components/WaveBackground';
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
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <img src={crieValorLogo} alt="Crie Valor" className="h-32 mb-12" />
          <p className="text-4xl text-muted-foreground max-w-4xl leading-relaxed">
            Transformando organizações por meio de estratégias claras que conectam propósito com resultados
          </p>
          <div className="mt-16">
            
          </div>
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
            <h3 className="text-5xl font-semibold text-primary leading-tight">
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
                <p className="text-xl text-muted-foreground">Cultivamos mindset de crescimento e execução</p>
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
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <h2 className="text-6xl font-bold mb-12">O Que Fazemos</h2>
          <div className="max-w-6xl">
            <p className="text-3xl text-muted-foreground mb-20 leading-relaxed">
              Desenvolvemos soluções integradas de inteligência organizacional que conectam estratégia, tecnologia e pessoas para acelerar o crescimento sustentável das empresas.
            </p>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-8">
                <Brain className="h-20 w-20 text-primary mx-auto" />
                <h3 className="text-3xl font-semibold">Inteligência Estratégica</h3>
                <p className="text-2xl text-muted-foreground">
                  Transformamos dados em insights acionáveis através de metodologias proprietárias e tecnologia de ponta
                </p>
              </div>
              <div className="space-y-8">
                <Lightbulb className="h-20 w-20 text-primary mx-auto" />
                <h3 className="text-3xl font-semibold">Inovação Aplicada</h3>
                <p className="text-2xl text-muted-foreground">
                  Criamos soluções personalizadas que aceleram a implementação de estratégias e maximizam resultados
                </p>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 4 - Ecossistema de Inteligência
  {
    id: 'ecossistema',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <h2 className="text-6xl font-bold mb-12">Ecossistema de Inteligência Organizacional</h2>
          <div className="max-w-6xl">
            <p className="text-2xl text-muted-foreground mb-16">
              Uma suite integrada de produtos e serviços que trabalham em sinergia para transformar sua organização
            </p>
            <div className="grid grid-cols-3 gap-12">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
                <img src={marLogo} alt="MAR" className="h-24 mx-auto" />
                <h3 className="text-2xl font-semibold">MAR</h3>
                <p className="text-xl text-muted-foreground">Metodologia para Alto Rendimento</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
                <img src={lumiaLogo} alt="Lumia" className="h-24 mx-auto" />
                <h3 className="text-2xl font-semibold">Lumia</h3>
                <p className="text-xl text-muted-foreground">Consultor Virtual Inteligente</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
                <FlagIcon size={96} className="text-primary mx-auto" />
                <h3 className="text-2xl font-semibold">Mentor de Propósito</h3>
                <p className="text-xl text-muted-foreground">Inteligência Conversacional</p>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 5 - MAR
  {
    id: 'mar',
    content: <div className="flex items-center justify-center h-full">
          <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
            <div className="space-y-10">
              <img src={marLogo} alt="MAR" className="h-32" />
              <h2 className="text-5xl font-bold">MAR - Mapa para Alto Rendimento</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Metodologia proprietária que identifica oportunidades de crescimento através de diagnósticos precisos e planos de ação estruturados.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Diagnóstico 360° da organização</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Identificação de gaps estratégicos</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Plano de ação personalizado</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">PRODUTO INOVADOR - Rápido e Acessível</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-center space-y-8">
                  <img src={marLogo} alt="MAR" className="h-32 mx-auto" />
                  <h3 className="text-3xl font-semibold">Metodologia Inovadora</h3>
                  <p className="text-xl text-muted-foreground">Resultados mensuráveis em 90 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 6 - Lumia
  {
    id: 'lumia',
    content: <div className="flex items-center justify-center h-full">
          <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
            <div className="space-y-10">
              <img src={lumiaLogo} alt="Lumia" className="h-32" />
              <h2 className="text-5xl font-bold">Lumia - Consultor Virtual</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Primeira consultora virtual do Brasil especializada em estratégia empresarial, oferecendo insights 24/7 para acelerar decisões.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-2xl">Análise estratégica em tempo real</span>
                </div>
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
                  <span className="text-2xl">Relatórios automatizados</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-primary/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-center space-y-8">
                  <img src={lumiaLogo} alt="Lumia" className="h-32 mx-auto" />
                  <h3 className="text-3xl font-semibold">Consultora Virtual</h3>
                  <p className="text-xl text-muted-foreground">Conhecimento de 1000+ consultores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 7 - Mentor de Propósito
  {
    id: 'mentor-proposito',
    content: <div className="flex items-center justify-center h-full">
          <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
            <div className="space-y-10">
              <div className="flex items-center space-x-6">
                <FlagIcon size={128} className="text-primary" />
              </div>
              <h2 className="text-5xl font-bold">Mentor de Propósito</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Ferramenta de inteligência conversacional que ajuda organizações a descobrir e articular seu propósito autêntico através de diálogos estruturados.
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
              <div className="bg-gradient-to-br from-orange-500/20 to-primary/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-center space-y-8">
                  <FlagIcon size={128} className="text-primary mx-auto" />
                  <h3 className="text-3xl font-semibold">Propósito Autêntico</h3>
                  <p className="text-xl text-muted-foreground">Conectando essência com estratégia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 8 - Serviços
  {
    id: 'servicos',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <h2 className="text-6xl font-bold mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-2 gap-12 max-w-6xl">
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
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
              <Lightbulb className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-2xl font-semibold">Planejamento Estratégico</h3>
              <p className="text-xl text-muted-foreground">Visão de longo prazo com execução estruturada</p>
            </div>
          </div>
        </div>
  },
  // Slide 9 - Educação Corporativa
  {
    id: 'educacao',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <h2 className="text-6xl font-bold mb-12">Educação Corporativa</h2>
          <div className="max-w-5xl space-y-16">
            <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-12 rounded-2xl border border-border backdrop-blur-sm">
              <div className="space-y-8">
                <Users className="h-20 w-20 text-primary mx-auto" />
                <h3 className="text-4xl font-semibold">Oficina de Líderes</h3>
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
                    <div className="text-3xl font-bold text-primary">4</div>
                    <div className="text-lg text-muted-foreground">módulos especializados</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <div className="text-lg text-muted-foreground">líderes formados</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-lg text-muted-foreground">satisfação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  },
  // Slide 10 - Fechamento CTA
  {
    id: 'fechamento',
    content: <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <img src={crieValorLogo} alt="Crie Valor" className="h-24 mb-12" />
          <h2 className="text-6xl font-bold mb-12">Vamos Transformar Sua Empresa?</h2>
          <p className="text-3xl text-muted-foreground max-w-5xl mb-16">
            Agende uma conversa estratégica e descubra como podemos acelerar seus resultados
          </p>
          
          <div className="grid grid-cols-2 gap-20 max-w-5xl w-full">
            <div className="space-y-8">
              <h3 className="text-3xl font-semibold">Contatos</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Mail className="h-8 w-8 text-primary" />
                  <span className="text-2xl">contato@crievalor.com.br</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Phone className="h-8 w-8 text-primary" />
                  <span className="text-2xl">(47) 99215-0289</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Globe className="h-8 w-8 text-primary" />
                  <span className="text-2xl">crievalor.com.br</span>
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
          
          <div className="mt-20 text-2xl text-muted-foreground">
            Obrigado pela atenção!
          </div>
        </div>
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <WaveBackground />
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
            {slides.map(slide => <CarouselItem key={slide.id} className="h-screen flex items-center justify-center px-16">
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
    </div>;
};
export default ApresentacaoPage;