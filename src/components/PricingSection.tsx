
import React from "react";
import { Check, Compass, FileText, Calendar, CreditCard, BadgePercent, FolderArchive, Files, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  name: string;
  monthlyPrice?: string;
  annualPrice?: string;
  description: string;
  features: string[];
  documents?: {
    icon: React.ElementType;
    name: string;
    included: boolean;
  }[];
  cta: string;
  ctaUrl: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Self Service",
    monthlyPrice: "Em breve",
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
    monthlyPrice: "R$ 333,08",
    annualPrice: "R$ 3.597",
    description: "Plano ideal para pequenas empresas que buscam um direcionamento estratégico inicial e foco em resultados práticos.",
    features: [
      "Análise estratégica básica",
      "Criado pela IA com revisão humana",
      "Relatório com recomendações práticas",
      "1 sessão de consultoria (1h)",
      "Plano de ação para 3 meses",
      "Foco em ações imediatas para melhorar vendas"
    ],
    documents: [
      {
        icon: FileText,
        name: "Relatório de Recomendações",
        included: true
      },
      {
        icon: FileCheck,
        name: "Plano de Ação Simplificado",
        included: true
      },
      {
        icon: Files,
        name: "Análises Detalhadas",
        included: false
      },
      {
        icon: FolderArchive,
        name: "Acesso à Pasta Compartilhada",
        included: false
      }
    ],
    cta: "Escolher plano",
    ctaUrl: "#contato"
  },
  {
    name: "Profissional",
    monthlyPrice: "R$ 583,08",
    annualPrice: "R$ 6.297",
    description: "Nossa solução mais completa para empresas que buscam um plano estratégico detalhado e acesso a todas as análises.",
    features: [
      "Análise estratégica avançada",
      "Relatório estratégico completo",
      "Acesso a todas análises detalhadas",
      "2 sessões de consultoria",
      "Plano de ação para 6 meses",
      "Indicadores de desempenho (KPIs)",
      "Pasta compartilhada com todos os arquivos"
    ],
    documents: [
      {
        icon: FileText,
        name: "Relatório Estratégico Completo",
        included: true
      },
      {
        icon: FileCheck,
        name: "Plano de Ação Detalhado",
        included: true
      },
      {
        icon: Files,
        name: "Análises de Mercado e Competitivas",
        included: true
      },
      {
        icon: FolderArchive,
        name: "Acesso Total à Pasta Compartilhada",
        included: true
      }
    ],
    cta: "Selecionar plano",
    ctaUrl: "#contato",
    popular: true
  },
  {
    name: "Personalizado",
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
                
                {/* Updated pricing display */}
                {plan.comingSoon ? (
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl md:text-4xl font-bold">{plan.monthlyPrice}</span>
                  </div>
                ) : plan.name === "Personalizado" ? (
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl md:text-4xl font-bold">Sob consulta</span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-baseline mb-1">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <span className="text-2xl md:text-3xl font-bold">{plan.monthlyPrice}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        /mês
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-7">
                      em 12x no cartão de crédito
                    </div>
                    
                    <div className="flex items-baseline mt-3 pt-3 border-t border-border">
                      <BadgePercent className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-green-500">Economia de 10%</span>
                          <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                            À vista
                          </Badge>
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-base font-bold">{plan.annualPrice}</span>
                          <span className="text-muted-foreground ml-1 text-xs">
                            pagamento único
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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
                
                {/* Document access section */}
                {plan.documents && (
                  <div className="mb-8">
                    <h4 className="text-sm font-medium mb-3 border-b border-border pb-2">Documentos Incluídos</h4>
                    <ul className="space-y-3">
                      {plan.documents.map((doc, i) => (
                        <li key={i} className="flex items-start">
                          <div className={`shrink-0 mr-2 h-5 w-5 mt-0.5 ${doc.included ? 'text-green-500' : 'text-muted-foreground opacity-50'}`}>
                            <doc.icon className="h-5 w-5" />
                          </div>
                          <span className={`text-sm ${doc.included ? '' : 'text-muted-foreground line-through opacity-50'}`}>
                            {doc.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <BadgePercent className="text-green-500 h-6 w-6 mr-2" />
                <h4 className="font-semibold">Pagamento à vista</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Ganhe 10% de desconto pagando o valor integral em uma única parcela.
              </p>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span>Cartão de crédito</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 14.25h18M3 18.75h13.5M3 9.75h18M7.5 5.25h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Boleto bancário</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 10l8 3 8-3-8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 22l8-4 8 4M4 16l8-4 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>PIX</span>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Calendar className="text-primary h-6 w-6 mr-2" />
                <h4 className="font-semibold">Parcelamento</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Divida o valor em até 12x mensais no cartão de crédito.
              </p>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span>Visa, Mastercard, Elo, Amex</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Sem juros em até 12x</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>Aprovação instantânea</span>
                </div>
              </div>
            </div>
          </div>
          
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
