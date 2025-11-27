
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
  presencaDigital: {
    icon: FileText,
    name: "Análise do Instagram e Website da Empresa",
    included: true
  },
  analisesCenario: {
    icon: Radar,
    name: "Análises de cenário aprofundadas por nossa metodologia proprietária por setor (Financeiro/ Marketing e Gente (RH)), a cada 02 meses",
    included: true
  }
};

// Dados dos planos - apenas o plano profissional
export const plans: PricingPlan[] = [
  {
    id: "basic_plan",
    name: "Essencial",
    monthlyPrice: "12 x de R$ 179,90",
    annualPrice: "R$ 1.942,92",
    annualDiscount: false,
    description: "Para empresas com equipes de 1 a 5 pessoas",
    features: [
      "01 Sessão on line (até 50 min) com consultor para orientações e tira dúvidas",
      "01 revisão do seu planejamento dentro do prazo de 06 meses",
      "Acesso à comunidade exclusiva"
    ],
    documents: [], // To be populated if needed, currently empty based on SubscriptionPlans.tsx
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=basic_plan",
    popular: false
  },
  {
    id: "pro_plan",
    name: "Profissional",
    monthlyPrice: "12 x de R$ 399,90",
    annualPrice: "R$ 4.318,92",
    annualDiscount: false,
    description: "Para empresas com equipes de 6 a 10 pessoas",
    features: [
      "02 Sessões on line (até 50 min) com consultor para orientações e tira dúvidas",
      "02 revisões do seu planejamento dentro do prazo de 06 meses",
      "Acesso à comunidade exclusiva"
    ],
    documents: [],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=pro_plan",
    popular: true
  },
  {
    id: "enterprise_plan",
    name: "Empresarial",
    monthlyPrice: "12 x de R$ 799,90",
    annualPrice: "R$ 8.638,92",
    annualDiscount: false,
    description: "Para empresas com equipes de 11 a 50 pessoas",
    features: [
      "04 Sessões de mentoria avançada on line (até 50 min) com consultor para orientações e tira dúvidas",
      "02 revisões do seu planejamento dentro do prazo de 06 meses",
      "Acesso à comunidade exclusiva"
    ],
    documents: [],
    cta: "Quero este plano",
    ctaUrl: "/subscription?plan=enterprise_plan",
    popular: false
  },
  {
    id: "corporate_plan",
    name: "Corporativo",
    monthlyPrice: "Condições sob consulta",
    annualPrice: "Condições sob consulta",
    annualDiscount: false,
    description: "Para empresas com equipes acima de 51 pessoas na organização",
    features: [
      "Consultoria dedicada",
      "Plano Estratégico Aprofundado",
      "Mentorias especializadas para equipes",
      "Implementação assistida"
    ],
    documents: [],
    cta: "Consultar via WhatsApp",
    ctaUrl: "https://wa.me/5547992150289?text=Ol%C3%A1%2C%20gostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Plano%20Corporativo.",
    popular: false
  }
];
