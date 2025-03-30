
import { FileText, FileCheck, Users, Presentation, BarChart, Award, BookOpen, ClipboardCheck } from "lucide-react";
import { DocumentType, PricingPlan } from "./types";

// Tipos de documentos disponíveis
const documentTypes: Record<string, DocumentType> = {
  planoEstrategico: {
    icon: FileText,
    name: "Plano Estratégico",
    included: true
  },
  relatorioCompleto: {
    icon: FileCheck,
    name: "Relatórios Completos",
    included: true
  },
  workshop: {
    icon: Users,
    name: "Workshop de Implementação",
    included: true
  },
  vip: {
    icon: Award,
    name: "Conteúdos exclusivos",
    included: true
  },
  mentoria: {
    icon: BookOpen,
    name: "Mentoria Especializada",
    included: true
  },
  revisao: {
    icon: ClipboardCheck,
    name: "Revisão do MAR",
    included: true 
  }
};

// Dados dos planos
export const plans: PricingPlan[] = [
  {
    id: "basic_plan",
    name: "Essencial",
    monthlyPrice: "12 x de R$ 179,90",
    annualPrice: "R$ 1.942,92",
    annualDiscount: true,
    description: "Combinação ideal de expertise humana e IA para empreendedores iniciando sua jornada estratégica",
    features: [
      "Plano Estratégico simplificado:",
      "• Estratégias de Negócios e Comerciais",
      "• Estratégias de Marketing",
      "• Planos de Ação prontos para executar",
      "Recomendações 100% personalizadas",
      "Workshop de implantação",
      "Suporte por e-mail",
      "Acesso à comunidade",
      "Apenas 1 usuário",
      "1 revisão geral do MAR"
    ],
    documents: [
      documentTypes.planoEstrategico,
      documentTypes.revisao,
      {...documentTypes.relatorioCompleto, included: false},
      {...documentTypes.mentoria, included: false}
    ],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=basic_plan"
  },
  {
    id: "pro_plan",
    name: "Profissional",
    monthlyPrice: "12 x de R$ 299,90",
    annualPrice: "R$ 3.238,92",
    annualDiscount: true,
    description: "Para empreendedores em crescimento que precisam de estratégias mais estruturadas e detalhamento técnico",
    features: [
      "Plano Estratégico detalhado e personalizado",
      "Relatórios completos de todo o processo:",
      "• Análise de Segmento",
      "• Análise de presença digital",
      "• Análise da concorrência",
      "• Relatório de Inteligência Competitiva",
      "• Posicionamento Estratégico",
      "• Branding e Identidade da Marca",
      "• Estratégias de Negócios e Comercial",
      "• Estratégias de Marketing",
      "• Planos de Ação prontos para executar",
      "Recomendações 100% personalizadas",
      "Revisão por especialistas",
      "Workshop de implantação",
      "Sessão estratégica exclusiva",
      "Suporte via Whatsapp por 30 dias",
      "Acesso à comunidade",
      "Até 3 usuários",
      "2 revisões gerais do MAR"
    ],
    documents: [
      documentTypes.planoEstrategico,
      {...documentTypes.relatorioCompleto, included: true},
      {...documentTypes.workshop, included: true},
      {...documentTypes.mentoria, included: true},
      {...documentTypes.revisao, included: true}
    ],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=pro_plan",
    popular: true
  },
  {
    id: "enterprise_plan",
    name: "Empresarial",
    monthlyPrice: "12 x de R$ 799,90",
    annualPrice: "R$ 8.638,92",
    annualDiscount: true,
    description: "Solução completa para empresas que buscam excelência estratégica e implementação assistida",
    features: [
      "Plano Estratégico completo",
      "Relatórios completos de todo o processo:",
      "• Análise de Segmento",
      "• Análise de presença digital",
      "• Análise da concorrência",
      "• Relatório de Inteligência Competitiva",
      "• Posicionamento Estratégico",
      "• Branding e Identidade da Marca",
      "• Estratégias de Negócios e Comercial",
      "• Estratégias de Marketing",
      "• Planos de Ação prontos para executar",
      "Recomendações 100% personalizadas",
      "Revisão por especialistas",
      "Workshop de implantação",
      "Suporte via Whatsapp por 30 dias",
      "Acesso à comunidade",
      "4 sessões de mentoria estratégica",
      "Acesso VIP a conteúdos exclusivos",
      "Traga sua equipe para construir junto",
      "• Até 5 usuários",
      "até 3 revisões gerais do MAR"
    ],
    documents: [
      documentTypes.planoEstrategico,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.vip,
      documentTypes.revisao
    ],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=enterprise_plan"
  },
  {
    id: "corporate_plan",
    name: "Corporativo",
    description: "Solução totalmente personalizada para grandes corporações com necessidades específicas",
    features: [
      "Plano Estratégico corporativo personalizado",
      "Estratégia completamente personalizada",
      "Equipe de consultores",
      "Implementação assistida",
      "Workshops para equipe de liderança",
      "Acompanhamento contínuo por 30 dias",
      "Acesso à comunidade",
      "Sessões de mentoria estratégica",
      "Acesso VIP a conteúdos exclusivos",
      "Traga sua equipe para construir junto",
      "• Até 5 usuários",
      "Até 3 revisões gerais do MAR"
    ],
    documents: [
      documentTypes.planoEstrategico,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.vip,
      documentTypes.revisao
    ],
    cta: "Falar com consultor",
    ctaUrl: "https://wa.me/+5547992152089",
    customPrice: true
  }
];
