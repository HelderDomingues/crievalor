import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, Palette, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSections = () => {
  const services = [
    {
      id: 'oficina-lideres',
      icon: BookOpen,
      title: 'Oficina de Líderes',
      subtitle: 'Desenvolva sua liderança com excelência',
      description: 'Transforme seu potencial de liderança com nossa metodologia exclusiva. Desenvolva habilidades gerenciais que geram resultados extraordinários.',
      features: [
        'Formação completa de líderes e gestores',
        'Desenvolvimento de habilidades gerenciais avançadas',
        'Implementação de metodologias ágeis',
        'Gestão eficaz de projetos e processos',
        'Desenvolvimento de inteligência emocional',
        'Técnicas de comunicação assertiva'
      ],
      benefits: [
        'Aumento de 40% na produtividade da equipe',
        'Redução de 60% no turnover',
        'Melhoria significativa no clima organizacional',
        'Resultados mensuráveis em 90 dias'
      ],
      ctaText: 'Desenvolver Liderança',
      ctaUrl: '/oficina-de-lideres',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
      background: 'bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-emerald-500/5',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'branding',
      icon: Palette,
      title: 'Branding & Identidade Visual',
      subtitle: 'Construa uma marca memorável e impactante',
      description: 'Criamos identidades visuais que conectam, comunicam e convertem. Sua marca será lembrada pelos motivos certos.',
      features: [
        'Criação de identidade visual completa',
        'Design de logotipos únicos e memoráveis',
        'Estratégia de posicionamento de marca',
        'Manual de marca detalhado',
        'Aplicações em diversos materiais',
        'Gestão de presença digital'
      ],
      benefits: [
        'Aumento de 35% no reconhecimento da marca',
        'Melhoria na percepção de qualidade',
        'Diferenciação competitiva efetiva',
        'ROI positivo em campanhas de marketing'
      ],
      ctaText: 'Criar Identidade',
      ctaUrl: '/identidade-visual',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000',
      background: 'bg-gradient-to-br from-pink-500/5 via-pink-500/10 to-pink-500/5',
      iconColor: 'text-pink-500'
    },
    {
      id: 'projetos',
      icon: Briefcase,
      title: 'Projetos sob Medida',
      subtitle: 'Soluções customizadas para sua empresa',
      description: 'Desenvolvemos projetos únicos que atendem exatamente às suas necessidades específicas. Cada solução é pensada estrategicamente.',
      features: [
        'Consultoria estratégica personalizada',
        'Desenvolvimento de projetos específicos',
        'Transformação digital de processos',
        'Implantação de sistemas e metodologias',
        'Automação de processos',
        'Integração de tecnologias'
      ],
      benefits: [
        'Otimização de até 50% nos processos',
        'Redução significativa de custos operacionais',
        'Aumento da eficiência organizacional',
        'Escalabilidade sustentável'
      ],
      ctaText: 'Solicitar Projeto',
      ctaUrl: '/projetos',
      image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2076',
      background: 'bg-gradient-to-br from-indigo-500/5 via-indigo-500/10 to-indigo-500/5',
      iconColor: 'text-indigo-500'
    }
  ];

  return (
    <div className="space-y-32">
      {services.map((service, index) => (
        <section 
          key={service.id}
          className={`py-16 md:py-24 relative ${service.background}`}
          id={service.id}
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`blur-dot w-64 h-64 ${index % 2 === 0 ? 'top-20 -left-32' : 'bottom-20 -right-32'} opacity-5`} aria-hidden="true"></div>
            <div className={`blur-dot w-96 h-96 ${index % 2 === 0 ? '-bottom-48 -right-48' : 'top-48 -left-48'} opacity-5`} aria-hidden="true"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Content */}
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="flex items-center gap-4">
                  <div className={`rounded-full bg-background/80 p-4 ${service.iconColor}`}>
                    {React.createElement(service.icon, { className: "h-8 w-8" })}
                  </div>
                  <div className="h-px bg-border flex-1"></div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {service.title}
                  </h2>
                  <p className="text-xl text-primary font-medium">
                    {service.subtitle}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">O que está incluído:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full ${service.iconColor.replace('text-', 'bg-')} mt-2 flex-shrink-0`}></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Resultados esperados:</h3>
                    <div className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${service.iconColor.replace('text-', 'bg-')}`}></div>
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link to={service.ctaUrl}>
                      {service.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to={`/contato?servico=${encodeURIComponent(service.title)}`}>
                      Solicitar Proposta
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ServicesSections;