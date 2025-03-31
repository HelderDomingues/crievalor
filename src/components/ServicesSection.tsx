
import React from "react";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Users, 
  Lightbulb, 
  BookOpen, 
  Palette, 
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  route: string;
  color: string;
}

const services: Service[] = [
  {
    icon: Zap,
    title: "MAR",
    description: "Mapa para Alto Rendimento - Estratégias personalizadas combinando IA e consultoria humana.",
    route: "/mar",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: Users,
    title: "Mentorias",
    description: "Acompanhamento personalizado para desenvolvimento de líderes e equipes.",
    route: "/mentorias",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: Lightbulb,
    title: "Consultoria",
    description: "Soluções estratégicas personalizadas para desafios específicos do seu negócio.",
    route: "/consultoria",
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    icon: BookOpen,
    title: "Escola de Gestão",
    description: "Cursos e treinamentos para aprimorar habilidades de liderança e gestão.",
    route: "/escola-de-gestao",
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    icon: Palette,
    title: "Branding",
    description: "Desenvolvimento de marcas e identidades visuais completas para seu negócio.",
    route: "/identidade-visual",
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    icon: Briefcase,
    title: "Projetos sob Medida",
    description: "Projetos customizados para necessidades específicas da sua empresa.",
    route: "/projetos",
    color: "bg-indigo-500/10 text-indigo-500"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 bottom-20 -left-32 opacity-5"></div>
        <div className="blur-dot w-96 h-96 top-48 -right-48 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos soluções estratégicas customizadas para impulsionar 
            o crescimento e a transformação digital do seu negócio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 border border-border hover:glow-border transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`rounded-full ${service.color} p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Button variant="link" className="px-0" asChild>
                  <Link to={service.route}>
                    Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
