
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Essencial",
    price: "R$ 3.997",
    description: "Plano ideal para pequenas empresas que buscam um direcionamento estratégico inicial.",
    features: [
      "Análise estratégica básica",
      "Diagnóstico de mercado",
      "Plano de ação para 3 meses",
      "1 sessão de consultoria",
      "Relatório estratégico simplificado"
    ],
    cta: "Começar agora"
  },
  {
    name: "Profissional",
    price: "R$ 6.997",
    description: "Nossa solução mais popular para empresas que buscam um plano estratégico completo.",
    features: [
      "Análise estratégica avançada",
      "Diagnóstico de mercado e concorrência",
      "Plano de ação para 6 meses",
      "3 sessões de consultoria",
      "Relatório estratégico completo",
      "Indicadores de desempenho (KPIs)"
    ],
    cta: "Selecionar plano",
    popular: true
  },
  {
    name: "Empresarial",
    price: "R$ 11.997",
    description: "Solução completa para médias empresas que necessitam de uma estratégia robusta.",
    features: [
      "Análise estratégica premium",
      "Diagnóstico de mercado, concorrência e tendências",
      "Plano de ação para 12 meses",
      "6 sessões de consultoria",
      "Relatório estratégico detalhado",
      "Indicadores de desempenho (KPIs)",
      "Acompanhamento trimestral",
      "Análise de risco e oportunidades"
    ],
    cta: "Falar com um consultor"
  }
];

const PricingSection = () => {
  return (
    <section className="py-16 md:py-24 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-64 h-64 -top-32 -left-20 opacity-10"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -right-48 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Investimento acessível para resultados extraordinários
          </h2>
          <p className="text-muted-foreground text-lg">
            Democratizamos o acesso a planejamentos estratégicos de alto nível,
            tornando-os acessíveis para empresas de todos os tamanhos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden transition-all ${
                plan.popular 
                  ? "border-primary shadow-lg shadow-primary/20 relative scale-105 z-10" 
                  : "border-border"
              } border bg-card hover:shadow-lg hover:shadow-primary/10`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Mais Popular
                  </div>
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-primary shrink-0 mr-2 h-5 w-5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Precisa de uma solução personalizada? 
            <a href="#contato" className="text-primary hover:text-primary/80 ml-1">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
