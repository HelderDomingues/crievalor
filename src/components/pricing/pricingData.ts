
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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  period?: string;
  installments?: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlight?: boolean;
  badge?: string;
  details?: string;
}

export interface Combo {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: string;
  originalPrice: string;
  installments: string;
  boletoPrice?: string;
  boletoInstallments?: string;
  cashPrice: string;
  cashDiscount: string;
  savings: string;
  features: string[];
  bonus: string[];
  cta: string;
  ctaUrl: string;
  popular?: boolean;
  color?: string;
}

export const individualProducts: Product[] = [
  {
    id: "mar",
    name: "MAR - Mapa de Alto Rendimento",
    description: "Sistema de planejamento estratégico com IA, personalizado para o perfil comportamental do empresário + BSC + Porter.",
    price: "R$ 3.497,00",
    installments: "Em até 10x de R$ 349,70",
    features: [
      "Diagnóstico 64 perguntas",
      "Análise de cenário",
      "Plano 12 meses",
      "Entrega em 7 dias"
    ],
    cta: "Saber mais",
    ctaUrl: "/mar",
    details: "Desconto à vista: 10% (R$ 3.147,30)"
  },
  {
    id: "lumia",
    name: "LUMIA - Sistema de Consultores Virtuais",
    description: "6 agentes de IA especializados (Estratégia, Marketing, Vendas, Finanças, Operações, Pessoas) disponíveis 24/7.",
    price: "R$ 697/mês",
    period: "ou R$ 1.797/trimestre",
    features: [
      "Disponibilidade 24/7",
      "Decisões do dia a dia",
      "Validação de ideias",
      "Pesquisas e análises",
      "Teste grátis de 7 dias"
    ],
    cta: "Começar teste grátis",
    ctaUrl: "https://wa.me/5547992150289?text=Quero%20testar%20o%20LUMIA",
  },
  {
    id: "mentor-proposito",
    name: "Mentor de Propósito",
    description: "Jornada guiada de descobrimento de propósito e valores organizacionais com agente de IA especializado.",
    price: "R$ 299,00",
    installments: "Em até 5x de R$ 59,80",
    features: [
      "Plataforma única com chat",
      "Dashboard do usuário",
      "Clareza de identidade e cultura",
      "Pagamento único"
    ],
    cta: "Comprar agora",
    ctaUrl: "https://wa.me/5547992150289?text=Quero%20o%20Mentor%20de%20Prop%C3%B3sito",
  },
  {
    id: "implementacao",
    name: "Implementação Assistida",
    description: "Acompanhamento hands-on para executar o plano do MAR. Duração de 3 a 6 meses.",
    price: "R$ 3.000,00/mês",
    period: "Mínimo 3 meses",
    features: [
      "Reuniões semanais",
      "Suporte WhatsApp",
      "Validação de execução",
      "Foco na execução garantida"
    ],
    cta: "Consultar disponibilidade",
    ctaUrl: "https://wa.me/5547992150289?text=Tenho%20interesse%20na%20Implementa%C3%A7%C3%A3o%20Assistida",
  },
  {
    id: "mentoria-executiva",
    name: "Mentoria Executiva",
    description: "Sessões estratégicas quinzenais com fundadores (Helder ou Paulo). Inclui acesso ao LUMIA.",
    price: "R$ 4.000/mês",
    features: [
      "Sessões quinzenais",
      "Sparring partner estratégico",
      "LUMIA incluso",
      "Acesso direto aos fundadores"
    ],
    cta: "Aplicar para vaga",
    ctaUrl: "https://wa.me/5547992150289?text=Tenho%20interesse%20na%20Mentoria%20Executiva",
  },
  {
    id: "oficina-lideres",
    name: "Educação Corporativa (Oficina de Líderes)",
    description: "Programa completo de desenvolvimento de competências de liderança. Híbrido (Presencial + Online).",
    price: "R$ 6.990,00",
    installments: "10x de R$ 699,00",
    features: [
      "Duração ~10 meses",
      "Foco em gestores e líderes",
      "Baixo Vale do Itajaí/SC",
      "Módulos práticos"
    ],
    cta: "Ver detalhes",
    ctaUrl: "/oficina-de-lideres",
  },
  {
    id: "customizados",
    name: "Projetos Customizados",
    description: "Soluções sob medida para desafios específicos (branding, reposicionamento, reestruturação).",
    price: "Sob consulta",
    features: [
      "Escopo personalizado",
      "Branding e Reposicionamento",
      "Reestruturação",
      "Demandas específicas"
    ],
    cta: "Falar com consultor",
    ctaUrl: "https://wa.me/5547992150289?text=Preciso%20de%20um%20projeto%20customizado",
  }
];

export const combos: Combo[] = [
  {
    id: "combo-essencial",
    name: "COMBO ESSENCIAL",
    subtitle: "Clareza Estratégica",
    description: "Para empresas que querem começar com diagnóstico e plano, e testar o poder da IA.",
    price: "R$ 10.400,20",
    originalPrice: "R$ 11.888,00",
    installments: "12x de R$ 866,68",
    boletoPrice: "4x de R$ 2.600,05",
    cashPrice: "R$ 9.805,80",
    cashDiscount: "15% à vista",
    savings: "Economia de R$ 1.487,80",
    features: [
      "MAR - Mapa de Alto Rendimento",
      "LUMIA - 12 meses de acesso"
    ],
    bonus: [
      "Mentor de Propósito (R$ 299,00)"
    ],
    cta: "Garantir Combo Essencial",
    ctaUrl: "https://wa.me/5547992150289?text=Quero%20o%20Combo%20Essencial",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "combo-avancado",
    name: "COMBO AVANÇADO",
    subtitle: "Profissionalização Acelerada",
    description: "Para empresas que querem plano + execução garantida + alinhamento de propósito.",
    price: "R$ 10.951,00",
    originalPrice: "R$ 12.500,00",
    installments: "12x de R$ 912,58",
    boletoPrice: "4x de R$ 2.737,75",
    cashPrice: "R$ 10.326,00",
    cashDiscount: "15% à vista",
    savings: "Economia de R$ 1.549,00",
    features: [
      "MAR - Mapa de Alto Rendimento",
      "Implementação Assistida (3 meses - 12 sessões)"
    ],
    bonus: [
      "Mentor de Propósito (R$ 299,00)"
    ],
    cta: "Garantir Combo Avançado",
    ctaUrl: "https://wa.me/5547992150289?text=Quero%20o%20Combo%20Avan%C3%A7ado",
    popular: true,
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "combo-transformacao",
    name: "COMBO TRANSFORMAÇÃO",
    subtitle: "Profissionalização Completa",
    description: "Para empresas que querem transformação profunda com suporte automatizado.",
    price: "R$ 18.799,20",
    originalPrice: "R$ 20.880,00",
    installments: "12x de R$ 1.566,60",
    boletoPrice: "4x de R$ 4.699,80",
    cashPrice: "R$ 17.754,80",
    cashDiscount: "15% à vista",
    savings: "Economia de R$ 2.387,80",
    features: [
      "MAR - Mapa de Alto Rendimento",
      "LUMIA - 12 meses de acesso",
      "Implementação Assistida (3 meses - 12 sessões)"
    ],
    bonus: [
      "Mentor de Propósito (R$ 299,00)"
    ],
    cta: "Garantir Combo Transformação",
    ctaUrl: "https://wa.me/5547992150289?text=Quero%20o%20Combo%20Transforma%C3%A7%C3%A3o",
    color: "from-amber-400 to-amber-600"
  }
];
