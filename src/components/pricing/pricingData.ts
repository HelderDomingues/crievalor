
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
  mapaCrescimento: {
    icon: BarChart,
    name: "Mapa de Crescimento",
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
    id: "basic_plan",
    name: "Básico",
    monthlyPrice: "R$ 89,90",
    annualPrice: "R$ 899,00",
    description: "Ideal para pequenas empresas que estão iniciando sua jornada estratégica",
    features: [
      "Diagnóstico inicial do negócio",
      "Análise SWOT básica",
      "Recomendações iniciais",
      "Email de suporte"
    ],
    documents: [
      documentTypes.diagnostico,
      {...documentTypes.planoEstrategico, included: false},
      {...documentTypes.mapaCrescimento, included: false},
      {...documentTypes.relatorioCompleto, included: false}
    ],
    cta: "Começar agora",
    ctaUrl: "/subscription?plan=basic_plan",
  },
  {
    id: "pro_plan",
    name: "Profissional",
    monthlyPrice: "R$ 299,90",
    annualPrice: "R$ 2.999,00",
    description: "Para empresas em crescimento que precisam de estratégias mais estruturadas",
    features: [
      "Tudo do plano Básico",
      "Plano estratégico detalhado",
      "Mapa de crescimento personalizado",
      "2 sessões de mentoria",
      "Suporte prioritário"
    ],
    documents: [
      documentTypes.diagnostico,
      documentTypes.planoEstrategico,
      documentTypes.mapaCrescimento,
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
    description: "Solução completa para empresas que buscam excelência estratégica",
    features: [
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
      documentTypes.mapaCrescimento,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.apresentacao
    ],
    cta: "Falar com Consultor",
    ctaUrl: "/subscription?plan=enterprise_plan",
  },
  {
    id: "corporate_plan",
    name: "Corporativo",
    description: "Solução personalizada para grandes corporações com necessidades específicas",
    features: [
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
      documentTypes.mapaCrescimento,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.apresentacao
    ],
    cta: "Solicitar Proposta",
    ctaUrl: "/contato?assunto=plano-corporativo",
    comingSoon: true
  }
];
