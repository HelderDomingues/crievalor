
import { 
  FileText, 
  FileCheck, 
  Users, 
  Award, 
  ClipboardCheck,
  GitCompare,
  Target,
  Fingerprint,
  Pin,
  Briefcase,
  LineChart,
  Radar,
  HandMetal
} from "lucide-react";
import { DocumentType, PricingPlan } from "./types";

// Tipos de documentos disponíveis
const documentTypes: Record<string, DocumentType> = {
  planoEstrategicoSimplificado: {
    icon: FileText,
    name: "Plano Estratégico Simplificado",
    included: true
  },
  planoEstrategicoAprofundado: {
    icon: FileText,
    name: "Plano Estratégico Aprofundado com Relatórios Completos",
    included: true
  },
  relatorioCompleto: {
    icon: FileCheck,
    name: "Relatórios Completos",
    included: true
  },
  workshop: {
    icon: Users,
    name: "01 Sessão on line (até 50 min) com consultor para orientações e tira dúvidas",
    included: true
  },
  vip: {
    icon: Award,
    name: "Conteúdos exclusivos",
    included: true
  },
  segmento: {
    icon: Radar,
    name: "Análise sobre o segmento de atuação",
    included: true
  },
  revisao: {
    icon: ClipboardCheck,
    name: "Revisão do MAR",
    included: true 
  },
  benchmarking: {
    icon: GitCompare,
    name: "Análise de Concorrência e Benchmarking",
    included: true 
  },
  posicionamento: {
    icon: Pin,
    name: "Posicionamento de Mercado",
    included: true 
  },
  branding: {
    icon: Fingerprint,
    name: "Branding e Posicionamento de Marca",
    included: true 
  },
  negocios: {
    icon: Briefcase,
    name: "Estratégias de Negócio 100% personalizadas",
    included: true 
  },
  marketing: {
    icon: LineChart,
    name: "Estratégias de Marketing 100% personalizadas",
    included: true 
  },
  planosAcao: {
    icon: ClipboardCheck,
    name: "Planos de Ação prontos para aplicar",
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
      "• Planos de Ação prontos para aplicar",
      "Recomendações 100% personalizadas",
      "01 Sessão on line (até 50 min) com consultor para orientações e tira dúvidas",
      "Suporte por e-mail",
      "Acesso à comunidade",
      "Apenas 1 usuário",
      "1 revisão geral do MAR dentro do prazo de 06 meses"
    ],
    documents: [
      documentTypes.planoEstrategicoSimplificado,
      documentTypes.revisao,
      {...documentTypes.planosAcao, included: true},
      {...documentTypes.negocios, included: true},
      {...documentTypes.marketing, included: true},
      {...documentTypes.relatorioCompleto, included: false},
      {...documentTypes.segmento, included: false},
      {...documentTypes.benchmarking, included: false},
      {...documentTypes.posicionamento, included: false},
      {...documentTypes.branding, included: false}
    ],
    cta: "Quero este plano",
    ctaUrl: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s"
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
      documentTypes.planoEstrategicoAprofundado,
      {...documentTypes.relatorioCompleto, included: true},
      {...documentTypes.workshop, included: true},
      {...documentTypes.revisao, included: true},
      {...documentTypes.segmento, included: true},
      {...documentTypes.benchmarking, included: true},
      {...documentTypes.posicionamento, included: true},
      {...documentTypes.branding, included: true},
      {...documentTypes.negocios, included: true},
      {...documentTypes.marketing, included: true},
      {...documentTypes.planosAcao, included: true}
    ],
    cta: "Quero este plano",
    ctaUrl: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon",
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
      documentTypes.planoEstrategicoAprofundado,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.vip,
      documentTypes.revisao,
      documentTypes.segmento,
      documentTypes.benchmarking,
      documentTypes.posicionamento,
      documentTypes.branding,
      documentTypes.negocios,
      documentTypes.marketing,
      documentTypes.planosAcao
    ],
    cta: "Quero este plano",
    ctaUrl: "https://sandbox.asaas.com/c/z4vate6zwonrwoft"
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
      documentTypes.planoEstrategicoAprofundado,
      documentTypes.relatorioCompleto,
      documentTypes.workshop,
      documentTypes.vip,
      documentTypes.revisao,
      documentTypes.segmento,
      documentTypes.benchmarking,
      documentTypes.posicionamento,
      documentTypes.branding,
      documentTypes.negocios,
      documentTypes.marketing,
      documentTypes.planosAcao
    ],
    cta: "Falar com consultor",
    ctaUrl: "https://wa.me/+5547992150289",
    customPrice: true
  }
];
