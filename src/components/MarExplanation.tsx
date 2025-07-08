
import React from "react";
import { 
  Brain, 
  User, 
  Zap, 
  BarChart3, 
  Clock, 
  DollarSign,
  Lightbulb,
  FileText,
  Target,
  LucideIcon 
} from "lucide-react";

interface StepProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  index: number;
}

const Step = ({ title, description, icon: Icon, bgColor, index }: StepProps) => (
  <div className="flex items-start space-x-4 relative animate-slide-in-bottom" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
    <div className={`${bgColor} rounded-xl p-3 text-white shrink-0`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    {index < 4 && (
      <div className="absolute h-full w-0.5 bg-border left-6 top-12 -z-10 hidden md:block"></div>
    )}
  </div>
);

const MarExplanation = () => {
  const steps = [
    {
      title: "Coleta de Dados",
      description: "Utilizamos nosso sistema proprietário para coletar e analisar dados internos e externos da sua empresa de forma rápida e precisa.",
      icon: BarChart3,
      bgColor: "bg-blue-600"
    },
    {
      title: "Análise de Mercado",
      description: "Nossa tecnologia proprietária processa milhares de informações para identificar tendências, oportunidades e ameaças do seu mercado.",
      icon: Target,
      bgColor: "bg-indigo-600"
    },
    {
      title: "Processamento Inteligente",
      description: "Algoritmos avançados processam os dados para gerar insights estratégicos preliminares.",
      icon: Brain,
      bgColor: "bg-violet-600"
    },
    {
      title: "Refinamento Humano",
      description: "Consultores experientes revisam, refinam e personalizam as estratégias geradas pelo nosso sistema proprietário.",
      icon: User,
      bgColor: "bg-purple-600"
    },
    {
      title: "Entrega do MAR",
      description: "Apresentamos seu Mapa para Alto Rendimento, um plano estratégico completo e acionável.",
      icon: FileText,
      bgColor: "bg-fuchsia-600"
    }
  ];

  const benefits = [
    {
      title: "Velocidade",
      description: "Reduza o tempo de desenvolvimento estratégico de meses para semanas.",
      icon: Clock
    },
    {
      title: "Economia",
      description: "Custo significativamente menor que consultorias tradicionais.",
      icon: DollarSign
    },
    {
      title: "Precisão",
      description: "Análises baseadas em dados reais e processamento avançado da nossa metodologia proprietária.",
      icon: Target
    },
    {
      title: "Inovação",
      description: "Identificação de oportunidades não óbvias e ideias disruptivas.",
      icon: Lightbulb
    }
  ];

  return (
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Como funciona o MAR?
          </h2>
          <p className="text-lg text-muted-foreground">
            O Mapa para Alto Rendimento combina o melhor da nossa metodologia proprietária com a
            experiência de consultores humanos para criar estratégias poderosas que transformam seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:gap-16">
          <div className="space-y-12 max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
                bgColor={step.bgColor}
                index={index}
              />
            ))}
          </div>

          <div className="bg-card rounded-xl p-8 border border-border mt-8 glow-border">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Benefícios do MAR
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarExplanation;
