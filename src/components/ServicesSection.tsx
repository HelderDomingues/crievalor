
import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Palette, 
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  route: string;
  color: string;
  details?: string[];
  image?: string;
}

const services: Service[] = [
  {
    icon: BookOpen,
    title: "Escola de Gestão",
    description: "Cursos e treinamentos para aprimorar habilidades de liderança e gestão.",
    route: "/escola-de-gestao",
    color: "bg-emerald-500/10 text-emerald-500",
    details: [
      "Formação de líderes e gestores",
      "Desenvolvimento de habilidades gerenciais",
      "Implementação de metodologias ágeis",
      "Gestão de projetos e processos"
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070"
  },
  {
    icon: Users,
    title: "Mentorias",
    description: "Acompanhamento personalizado com foco especial em Gestão, Marketing e RH.",
    route: "/mentorias",
    color: "bg-purple-500/10 text-purple-500",
    details: [
      "Mentoria em Gestão Estratégica",
      "Mentoria em Marketing",
      "Mentoria em Recursos Humanos",
      "Planos personalizados para cada necessidade"
    ],
    image: "https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=2070"
  },
  {
    icon: Palette,
    title: "Branding",
    description: "Desenvolvimento de marcas e identidades visuais completas para seu negócio.",
    route: "/identidade-visual",
    color: "bg-pink-500/10 text-pink-500",
    details: [
      "Criação de identidade visual",
      "Design de logotipos e materiais",
      "Estratégia de posicionamento de marca",
      "Gestão de presença online"
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000"
  },
  {
    icon: Briefcase,
    title: "Projetos sob Medida",
    description: "Projetos customizados para necessidades específicas da sua empresa.",
    route: "/projetos",
    color: "bg-indigo-500/10 text-indigo-500",
    details: [
      "Consultoria estratégica personalizada",
      "Desenvolvimento de projetos específicos",
      "Transformação digital de processos",
      "Implantação de sistemas e metodologias"
    ],
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2076"
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Outros Serviços
          </h2>
          <p className="text-lg text-muted-foreground">
            Soluções especializadas para impulsionar o crescimento e o desenvolvimento do seu negócio.
          </p>
        </div>
        
        <div className="space-y-20">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="rounded-xl overflow-hidden relative aspect-video">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
              
              <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <Card className="border border-border hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`rounded-full ${service.color} p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                      {React.createElement(service.icon, { className: "h-6 w-6" })}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    
                    {service.details && (
                      <ul className="space-y-2 mb-6">
                        {service.details.map((detail, i) => (
                          <li key={i} className="flex items-center">
                            <span className={`w-2 h-2 rounded-full ${service.color.replace('text-', 'bg-')} mr-2`}></span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <Button variant="outline" asChild className="mt-4">
                      <Link to={service.route}>
                        Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
