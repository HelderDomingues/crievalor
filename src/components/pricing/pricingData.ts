
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

export const ecosystemPlans: PricingPlan[] = [
  {
    id: "basico",
    name: "LUMIA Básico",
    description: "Ideal para começar a estruturar sua clareza estratégica.",
    monthlyPrice: "R$ 560",
    annualPrice: "R$ 6.720",
    features: [
      "Relatórios Estratégicos (Módulos MAR)",
      "6 Consultores Virtuais Especialistas",
      "Mentor de Propósito Integrado",
      "Acesso para 1 usuário principal",
      "Suporte básico via plataforma"
    ],
    cta: "Começar agora",
    ctaUrl: "/contato",
    popular: false
  },
  {
    id: "intermediario",
    name: "LUMIA Intermediário",
    description: "Para empresas que buscam aceleração assistida.",
    monthlyPrice: "R$ 740",
    annualPrice: "R$ 8.880",
    features: [
      "Tudo do plano Básico",
      "Implementação Assistida (2 reuniões/mês)",
      "Acesso para até 3 usuários",
      "Suporte prioritário via WhatsApp",
      "Relatórios de progresso mensais"
    ],
    cta: "Escolher Intermediário",
    ctaUrl: "/contato",
    popular: true
  },
  {
    id: "avancado",
    name: "LUMIA Avançado",
    description: "Foco total em escala e acompanhamento intensivo.",
    monthlyPrice: "R$ 810",
    annualPrice: "R$ 9.720",
    features: [
      "Tudo do plano Intermediário",
      "Implementação Assistida (4 reuniões/mês)",
      "Acesso para até 5 usuários",
      "Acompanhamento estratégico direto",
      "Suporte VIP dedicado"
    ],
    cta: "Escolher Avançado",
    ctaUrl: "/contato",
    popular: false
  }
];

// Legacy exports kept empty to prevent breaking changes if imported elsewhere temporarily
// Ideally these should be removed after checking usages
export const plans: PricingPlan[] = [];
export const individualProducts: any[] = [];
export const combos: any[] = [];
