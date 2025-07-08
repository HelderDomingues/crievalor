
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
    id: "pro_plan",
    name: "", // Nome removido conforme solicitado
    monthlyPrice: "Em Até 10x de R$89,90",
    annualPrice: "R$ 799,00",
    annualDiscount: false,
    description: "Para empreendedores que buscam estratégias estruturadas para crescimento sustentável",
    features: [
      "02 revisões do seu planejamento dentro do prazo de 06 meses",
    ],
    documents: [
      documentTypes.planoEstrategicoAprofundado,
      documentTypes.planosAcao,
      documentTypes.estrategiasNegocio,
      documentTypes.estrategiasMarketing,
      documentTypes.analiseSegmento,
      documentTypes.analiseConcorrencia,
      documentTypes.posicionamentoMercado,
      documentTypes.brandingPosicionamento,
      documentTypes.presencaDigital
    ],
    cta: "Contratar Agora",
    ctaUrl: "/subscription?plan=pro_plan",
    popular: false
  }
];
