import { File, FileText, FileCheck, Users, Presentation, BarChart } from "lucide-react";
import { DocumentType, PricingPlan } from "./types";

// Tipos de documentos disponíveis
const documentTypes: Record<string, DocumentType> = {
  diagnostico: {
    icon: File,
    name: "Diagnóstico Inicial",
    included: true
  },
  planoEstrategico: {
    icon: FileText,
    name: "Plano Estratégico",
    included: true
  },
  relatorioCompleto: {
    icon: FileCheck,
    name: "Relatório Completo",
    included: true
  },
  workshop: {
    icon: Users,
    name: "Workshop de Implementação",
    included: true
  },
  apresentacao: {
    icon: Presentation,
    name: "Apresentação Executiva",
    included: true
  }
};

// Dados dos planos
export const plans: PricingPlan[] = [
  {
    id: "plano_essencial_mensal",
    name: "Essencial",
    monthlyPrice: "R$ 49,90",
    description: "Solução self-service com assistência de IA para empreendedores que querem autonomia",
    features: [
      "Plano Estratégico guiado por IA",
      "Assistência de IA para diagnóstico",
      "Templates estratégicos",
      "Suporte por email"
    ],
    documents: [
      {...documentTypes.diagnostico, included: true},
      {...documentTypes.planoEstrategico, included: true},
      {...documentTypes.relatorioCompleto, included: false}
    ],
    cta: "Começar agora",
    ctaUrl: "/subscription?plan=plano_essencial_mensal"
  },
  {
    id: "basic_plan",
    name: "Básico",
    monthlyPrice: "R$ 179,90",
    annualPrice: "R$ 1.799,00",
    annualDiscount: true,
    description: "Combinação ideal de IA e expertise humana para empreendedores iniciando sua jornada estratégica",
    features: [
      "Plano Estratégico assistido por especialistas",
      "Diagnóstico inicial do negócio",
      "Análise SWOT assistida por IA",
      "Recomendações personalizadas",
      "Email de suporte prioritário"
    ],
    documents: [
      documentTypes.diagnostico,
      documentTypes.planoEstrategico,
      {...documentTypes.relatorioCompleto, included: false}
    ],
    cta: "Começar agora",
    ctaUrl: "/subscription?plan=basic_plan"
  },
  {
    id: "pro_plan",
    name: "Profissional",
    monthlyPrice: "R$ 299,90",
    annualPrice: "R$ 2.999,00",
    annualDiscount: true,
    description: "Para empreendedores em crescimento que precisam de estratégias mais estruturadas e acompanhamento",
    features: [
      "Plano Estratégico detalhado e personalizado",
      "Tudo do plano Básico",
      "2 sessões de mentoria especializada",
      "Suporte prioritário com especialistas",
      "Acesso à comunidade exclusiva"
    ],
    documents: [
      documentTypes.diagnostico,
      documentTypes.planoEstrategico,
      {...documentTypes.relatorioCompleto, included: false},
      {...documentTypes.workshop, included: false}
    ],
    cta: "Escolher Profissional",
    ctaUrl: "/subscription?plan=pro_plan",
    popular: true
  },
  {
    id: "enterprise_plan",
    name: "Empresarial",
    monthlyPrice: "R$ 799,90",
    annualPrice: "R$ 7.999,00",
    annualDiscount: true,
    description: "Solução completa para empresas que buscam excelência estratégica e implementação assistida",
    features: [
      "Plano Estratégico completo com KPIs e métricas",
      "Tudo do plano Profissional",
      "Relatório completo com KPIs",
      "Workshop de implementação",
      "4 sessões de mentoria avançada",
      "Acesso VIP a eventos exclusivos",
      "Consultoria especializada"
    ],
    documents: [
      documentTypes.diagnostico,
      documentTypes.planoEstrategico,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.apresentacao
    ],
    cta: "Falar com Consultor",
    ctaUrl: "/subscription?plan=enterprise_plan"
  },
  {
    id: "corporate_plan",
    name: "Corporativo",
    description: "Solução totalmente personalizada para grandes corporações com necessidades específicas",
    features: [
      "Plano Estratégico corporativo personalizado",
      "Estratégia completamente personalizada",
      "Equipe dedicada de consultores",
      "Implementação assistida",
      "Workshops para equipe de liderança",
      "Acompanhamento contínuo",
      "Relatórios trimestrais de progresso"
    ],
    documents: [
      documentTypes.diagnostico,
      documentTypes.planoEstrategico,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.apresentacao
    ],
    cta: "Solicitar Proposta",
    ctaUrl: "/contato?assunto=plano-corporativo",
    customPrice: true
  }
];
