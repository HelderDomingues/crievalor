import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Target, TrendingUp, Calendar, Award, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentoriasSection = () => {
  const mentoriaFeatures = [
    {
      icon: Target,
      title: 'Foco Estratégico',
      description: 'Acompanhamento personalizado para atingir objetivos específicos'
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Acelerado',
      description: 'Metodologias comprovadas para acelerar resultados empresariais'
    },
    {
      icon: Calendar,
      title: 'Sessões Regulares',
      description: 'Encontros estruturados e planejados para máxima efetividade'
    },
    {
      icon: Award,
      title: 'Experiência Comprovada',
      description: 'Mentores com histórico de sucesso em suas áreas de atuação'
    }
  ];

  const mentoriaAreas = [
    'Gestão e Liderança',
    'Marketing Digital',
    'Vendas e Negociação',
    'Recursos Humanos',
    'Planejamento Estratégico',
    'Inovação e Tecnologia'
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 top-20 -left-32 opacity-5" aria-hidden="true"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5" aria-hidden="true"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-background/80 p-4 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Mentorias Empresariais
              </h2>
              <p className="text-xl text-primary font-medium">
                Desenvolvimento executivo personalizado para líderes visionários
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Acelere seu crescimento profissional com acompanhamento individual de especialistas em gestão, marketing e recursos humanos. Desenvolvemos líderes que transformam organizações.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mentoriaFeatures.map((feature, index) => (
                <Card key={index} className="bg-background/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                        {React.createElement(feature.icon, { className: "h-5 w-5 text-primary" })}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Areas de Mentoria */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Áreas de Mentoria:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mentoriaAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resultados */}
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resultados comprovados:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">Aumento de 60% na produtividade gerencial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">Melhoria de 45% na tomada de decisões</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">Redução de 40% no tempo de implementação</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">ROI positivo em 90 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/mentorias">
                  Conhecer Mentorias <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href="https://wa.me/5547992150289?text=Tenho%20interesse%20em%20saber%20mais%20sobre%20as%20Mentorias%20Empresariais"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Agendar Conversa
                </a>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Mentoria empresarial - Desenvolvimento de líderes"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Floating stats */}
            <div className="absolute -top-4 -right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Líderes Desenvolvidos</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentoriasSection;