
import { 
  FileText, 
  FileCheck, 
  Users, 
  Award, 
  ClipboardCheck,
  Radar,
  GitCompare,
  Pin,
  Fingerprint,
  Briefcase,
  LineChart
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
  workshop1: {
    icon: Users,
    name: "01 Sessão on line (até 50 min) com consultor para orientações e tira dúvidas",
    included: true
  },
  workshop2: {
    icon: Users,
    name: "02 Sessões on line (até 50 min) com consultor para orientações e tira dúvidas",
    included: true
  },
  workshop3: {
    icon: Users,
    name: "04 Sessões de mentoria avançada on line (até 50 min) com consultor para orientações e tira dúvidas",
    included: true
  },
  vip: {
    icon: Award,
    name: "Conteúdos exclusivos",
    included: true
  },
  revisao1: {
    icon: ClipboardCheck,
    name: "01 revisão do seu planejamento dentro do prazo de 06 meses",
    included: true 
  },
  revisao2: {
    icon: ClipboardCheck,
    name: "02 revisões do seu planejamento dentro do prazo de 06 meses",
    included: true 
  },
  comunidade: {
    icon: Users,
    name: "Acesso à comunidade exclusiva",
    included: true
  },
  estrategiasNegocio: {
    icon: Briefcase,
    name: "Estratégias de negócio personalizadas",
    included: true
  },
  estrategiasMarketing: {
    icon: LineChart,
    name: "Estratégias de marketing personalizadas",
    included: true
  },
  planosAcao: {
    icon: ClipboardCheck,
    name: "Planos de ação personalizados",
    included: true
  },
  analiseSegmento: {
    icon: Radar,
    name: "Análise sobre o segmento de atuação",
    included: true
  },
  analiseConcorrencia: {
    icon: GitCompare,
    name: "Análise de Concorrência e benchmarking",
    included: true
  },
  posicionamentoMercado: {
    icon: Pin,
    name: "Posicionamento de mercado",
    included: true
  },
  brandingPosicionamento: {
    icon: Fingerprint,
    name: "Branding/Posicionamento de Marca",
    included: true
  },
  consideracoesFinais: {
    icon: FileText,
    name: "Considerações Finais/Orientações estratégicas",
    included: true
  },
  analisesCenario: {
    icon: Radar,
    name: "Análises de cenário aprofundadas por IA por setor (Financeiro/ Marketing e Gente (RH)), a cada 02 meses",
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
      "Para empresas com equipes de 1 a 5 pessoas",
      "01 Sessão on line (até 50 min) com consultor para orientações e tira dúvidas",
      "01 revisão do seu planejamento dentro do prazo de 06 meses",
      "Acesso à comunidade exclusiva"
    ],
    documents: [
      documentTypes.planoEstrategicoSimplificado,
      documentTypes.estrategiasNegocio,
      documentTypes.estrategiasMarketing,
      documentTypes.planosAcao,
      documentTypes.analiseSegmento,
      documentTypes.analiseConcorrencia,
      documentTypes.posicionamentoMercado,
      documentTypes.brandingPosicionamento,
      documentTypes.consideracoesFinais
    ],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=basic_plan"
  },
  {
    id: "pro_plan",
    name: "Profissional",
    monthlyPrice: "12 x de R$ 399,90",
    annualPrice: "R$ 4.318,92",
    annualDiscount: true,
    description: "Para empreendedores em crescimento que precisam de estratégias mais estruturadas",
    features: [
      "Para empresas com equipes de 6 a 10 pessoas",
      "02 Sessões on line (até 50 min) com consultor para orientações e tira dúvidas",
      "02 revisões do seu planejamento dentro do prazo de 06 meses",
      "Acesso à comunidade exclusiva"
    ],
    documents: [
     { type: documentTypes.planoEstrategicoSimplificado, available: true },
      { type: documentTypes.estrategiasNegocio, available: true },
      { type: documentTypes.estrategiasMarketing, available: true },
      { type: documentTypes.planosAcao, available: true },
      { type: documentTypes.analiseSegmento, available: false }, // Não disponível (será riscado)
      { type: documentTypes.analiseConcorrencia, available: false }, // Não disponível (será riscado)
      { type: documentTypes.posicionamentoMercado, available: false }, // Não disponível (será riscado)
      { type: documentTypes.brandingPosicionamento, available: false }, // Não disponível (será riscado)
      { type: documentTypes.consideracoesFinais, available: true }
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
      "Para empresas com equipes de 11 a 50 pessoas",
      "04 Sessões de mentoria avançada on line (até 50 min) com consultor para orientações e tira dúvidas",
      "02 revisões do seu planejamento dentro do prazo de 06 meses",
      "Acesso à comunidade exclusiva"
    ],
    documents: [
      documentTypes.planoEstrategicoAprofundado,
      documentTypes.estrategiasNegocio,
      documentTypes.estrategiasMarketing,
      documentTypes.planosAcao,
      documentTypes.analiseSegmento,
      documentTypes.analiseConcorrencia,
      documentTypes.posicionamentoMercado,
      documentTypes.brandingPosicionamento,
      documentTypes.consideracoesFinais,
      documentTypes.analisesCenario
    ],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=enterprise_plan"
  },
  {
    id: "corporate_plan",
    name: "Corporativo",
    description: "Solução totalmente personalizada para empresas e corporações com necessidades específicas",
    features: [
      "Para empresas com equipes acima de 51 pessoas na organização",
      "Consultoria dedicada",
      "Plano Estratégico Aprofundado",
      "Mentorias especializadas para equipes", 
      "Implementação assistida"
    ],
    // Removing documents array for Corporate plan
    cta: "Falar com consultor",
    ctaUrl: "https://wa.me/+5547992150289",
    customPrice: true
  }
];
