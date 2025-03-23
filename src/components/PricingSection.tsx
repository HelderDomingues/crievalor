
import React from "react";
import { Check, Compass, FileText, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Self Service",
    price: "Em breve",
    description: "Uma ferramenta self-service para empresas que querem criar seu próprio plano estratégico com auxílio de IA.",
    features: [
      "Criação autoguiada",
      "Assistência de IA em etapas-chave",
      "Modelo de relatório básico",
      "Autonomia na criação de estratégias",
      "Acesso à ferramenta por 30 dias"
    ],
    cta: "Em desenvolvimento",
    ctaUrl: "#",
    comingSoon: true
  },
  {
    name: "Essencial",
    price: "R$ 3.997",
    description: "Plano ideal para pequenas empresas que buscam um direcionamento estratégico inicial.",
    features: [
      "Análise estratégica básica",
      "Criado pela IA com revisão humana",
      "Relatório estratégico simplificado",
      "1 sessão de consultoria (1h)",
      "Plano de ação para 3 meses"
    ],
    cta: "Escolher plano",
    ctaUrl: "#contato"
  },
  {
    name: "Profissional",
    price: "R$ 6.997",
    description: "Nossa solução mais completa para empresas que buscam um plano estratégico detalhado.",
    features: [
      "Análise estratégica avançada",
      "Relatório estratégico completo",
      "Acesso a todas análises detalhadas",
      "2 sessões de consultoria",
      "Plano de ação para 6 meses",
      "Indicadores de desempenho (KPIs)",
      "Armazenamento em pasta compartilhada"
    ],
    cta: "Selecionar plano",
    ctaUrl: "#contato",
    popular: true
  },
  {
    name: "Personalizado",
    price: "Sob consulta",
    description: "Solução customizada para empresas com necessidades específicas e maior interação humana.",
    features: [
      "Consultoria estratégica aprofundada",
      "Suporte personalizado",
      "Quantidade de reuniões flexível",
      "Plano de ação adaptado à sua realidade",
      "Relatórios e análises sob medida",
      "Acompanhamento personalizado",
      "Implementação assistida"
    ],
    cta: "Solicitar proposta",
    ctaUrl: "#contato"
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-64 h-64 -top-32 -left-20 opacity-10"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Invista no futuro do seu negócio
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano que melhor se adapta às necessidades da sua empresa
            e transforme sua visão em resultados concretos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden transition-all ${
                plan.popular 
                  ? "border-primary shadow-lg shadow-primary/20 relative md:scale-105 z-10" 
                  : plan.comingSoon
                    ? "border-border opacity-75"
                    : "border-border"
              } border bg-card hover:shadow-lg hover:shadow-primary/10`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Recomendado
                  </div>
                </div>
              )}
              
              {plan.comingSoon && (
                <div className="absolute top-0 right-0">
                  <div className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Em breve
                  </div>
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                  {!plan.comingSoon && plan.name !== "Personalizado" && (
                    <span className="text-muted-foreground ml-2 text-sm">
                      à vista ou em até 12x
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-primary shrink-0 mr-2 h-5 w-5 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : plan.comingSoon
                        ? "bg-secondary/50 text-foreground/50 hover:bg-secondary/50 cursor-not-allowed"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  disabled={plan.comingSoon}
                  asChild={!plan.comingSoon}
                >
                  {plan.comingSoon ? (
                    <span>{plan.cta}</span>
                  ) : (
                    <a href={plan.ctaUrl}>{plan.cta}</a>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-card border border-border rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">Opções de Pagamento</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="text-primary shrink-0 mr-2 h-5 w-5 mt-0.5" />
              <div>
                <span className="font-medium">Pagamento à vista</span>
                <p className="text-sm text-muted-foreground">Ganhe 10% de desconto ao pagar o valor integral em uma única parcela.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="text-primary shrink-0 mr-2 h-5 w-5 mt-0.5" />
              <div>
                <span className="font-medium">Parcelamento</span>
                <p className="text-sm text-muted-foreground">Divida o valor em até 12x com parcelas mensais sem desconto.</p>
              </div>
            </li>
          </ul>
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Tem perguntas sobre os planos ou formas de pagamento?
              <a href="#contato" className="text-primary hover:text-primary/80 ml-1">
                Entre em contato com nossa equipe
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
