import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

// Partner data structure
interface Partner {
  name: string;
  logo: string;
  url: string;
  alt: string;
}

// Partners data
const partners: Partner[] = [{
  name: "ACIN Navegantes",
  logo: "/lovable-uploads/13b8123c-b433-45b1-b28e-b31e909eaa43.png",
  url: "http://www.acin.com.br",
  alt: "Logo da ACIN Navegantes - Associação Empresarial de Navegantes"
}, {
  name: "Loged Tecnologias",
  logo: "/lovable-uploads/f2e3d880-52d7-440f-8b86-64541a85056d.png",
  url: "https://loged.pages.net.br",
  alt: "Logo da Loged Tecnologias"
}];
const PartnersSection: React.FC = () => {
  return <section id="parceiros" aria-labelledby="parceirosHeading" className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="parceirosHeading" className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Parceiros
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Empresas e organizações que confiam em nossa expertise e trabalham conosco
            para impulsionar o crescimento empresarial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {partners.map(partner => <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-card hover:bg-accent/10 rounded-lg border border-border transition-colors duration-300" aria-label={`Visite o site da ${partner.name}`}>
              <div className="h-28 flex items-center justify-center mb-4 w-full">
                <img src={partner.logo} alt={partner.alt} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex items-center text-primary font-medium">
                <span>{partner.name}</span>
                <ExternalLink className="h-4 w-4 ml-1" aria-hidden="true" />
              </div>
            </a>)}
        </div>
      </div>
    </section>;
};
export default PartnersSection;