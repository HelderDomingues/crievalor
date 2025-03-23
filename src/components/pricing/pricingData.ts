
import { PricingPlan } from "./types";
import { FileText, FileCheck, Files, FolderArchive } from "lucide-react";

export const plans: PricingPlan[] = [
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
