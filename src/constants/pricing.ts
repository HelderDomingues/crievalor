/**
 * PRICING CONSTANTS - CRIE VALOR
 * 
 * Single source of truth para todos os preços de produtos e serviços.
 * 
 * ⚠️ IMPORTANTE: Ao alterar preços aqui, execute busca global no projeto
 * para verificar se não há valores hardcoded em outros lugares.
 * 
 * Última atualização: 13/12/2025
 * Fonte de verdade: https://crievalor.com.br/planos e https://lumia.crievalor.com.br/pricing
 */

// ============================================================================
// PRODUTOS PRINCIPAIS
// ============================================================================

export const MAR_PRICING = {
    name: "MAR - Mapa para Alto Rendimento",
    price: 3497.00,
    priceFormatted: "R$ 3.497,00",
    installments: "10x de R$ 349,70",
    cashDiscount: 0.10, // 10%
    cashPrice: 3147.30,
    cashPriceFormatted: "R$ 3.147,30",
    description: "Plano estratégico personalizado em 7 dias com IA + consultoria humana. Metodologia BSC, Porter, análise comportamental e 12 planos de ação SMART."
} as const;

export const LUMIA_PRICING = {
    name: "Lumia - Sistema de Consultores Virtuais",
    monthly: {
        price: 697.00,
        priceFormatted: "R$ 697,00",
        period: "mês"
    },
    quarterly: {
        price: 1757.00, // CORRIGIDO: Era 1797, correto é 1757
        priceFormatted: "R$ 1.757,00",
        period: "trimestre"
    },
    annual: {
        price: 5649.00,
        priceFormatted: "R$ 5.649,00",
        period: "ano"
    },
    description: "6 agentes de IA especializados disponíveis 24/7: Estratégia, Marketing, Vendas, Finanças, Operações e Pessoas."
} as const;

export const MENTOR_PROPOSITO_PRICING = {
    name: "Mentor de Propósito",
    price: 299.00,
    priceFormatted: "R$ 299,00",
    installments: "5x de R$ 59,80",
    description: "Jornada guiada com IA para descoberta do propósito organizacional e definição de valores. Metodologia proprietária integrando logoterapia, PNL e análise comportamental.",
    isBeta: false, // Encerrado em 01/12/2025
    betaEndDate: null,
    activeDate: "2025-12-01" // Data em que passou a ser pago
} as const;

// ============================================================================
// SERVIÇOS
// ============================================================================

export const OFICINA_LIDERES_PRICING = {
    name: "Oficina de Líderes",
    price: 6990.00,
    priceFormatted: "R$ 6.990,00",
    installments: "10x de R$ 699,00",
    description: "Programa de educação corporativa com 4 módulos (Gestão Geral, RH, Financeiro, Marketing/Comercial), 10 aulas por módulo. Metodologia: 70% prática + 20% troca social + 10% teoria."
} as const;

export const IMPLEMENTACAO_ASSISTIDA_PRICING = {
    name: "Implementação Assistida",
    pricePerMonth: 3000.00,
    minMonths: 3,
    maxMonths: 6,
    minTotal: 9000.00,
    maxTotal: 18000.00,
    pricePerMonthFormatted: "R$ 3.000/mês",
    description: "Acompanhamento hands-on para executar o plano do MAR. Duração de 3 a 6 meses com reuniões semanais, suporte WhatsApp e validação de execução."
} as const;

export const MENTORIA_EXECUTIVA_PRICING = {
    name: "Mentoria Executiva",
    pricePerMonth: 4000.00,
    pricePerMonthFormatted: "R$ 4.000/mês",
    includes: "Lumia incluso",
    description: "Sessões estratégicas quinzenais com fundadores Helder ou Paulo. Inclui acesso ao Lumia."
} as const;

// ============================================================================
// COMBOS
// Fonte: https://crievalor.com.br/planos
// ============================================================================

export const COMBO_ESSENCIAL = {
    id: "combo-essencial",
    name: "COMBO ESSENCIAL",
    subtitle: "Clareza Estratégica",
    price: 10400.20,
    priceFormatted: "R$ 10.400,20",
    originalPrice: 11888.00,
    originalPriceFormatted: "R$ 11.888,00",
    installments: "12x de R$ 866,68",
    boletoInstallments: "4x de R$ 2.600,05",
    cashDiscount: 0.15,
    cashPrice: 8840.17,
    cashPriceFormatted: "R$ 8.840,17",
    savings: 1487.80,
    savingsFormatted: "R$ 1.487,80",
    includes: ["MAR", "Lumia 12 meses", "Mentor de Propósito (bônus)"],
    description: "Para empresas que querem começar com diagnóstico e plano, e testar o poder da IA."
} as const;

export const COMBO_AVANCADO = {
    id: "combo-avancado",
    name: "COMBO AVANÇADO",
    subtitle: "Profissionalização Acelerada",
    price: 11516.40, // CORRIGIDO de 10951.00
    priceFormatted: "R$ 11.516,40",
    originalPrice: 12500.00,
    originalPriceFormatted: "R$ 12.500,00",
    installments: "12x de R$ 959,70",
    boletoInstallments: "4x de R$ 2.879,10",
    cashDiscount: 0.15,
    cashPrice: 9788.94,
    cashPriceFormatted: "R$ 9.788,94",
    savings: 1549.00,
    savingsFormatted: "R$ 1.549,00",
    includes: ["MAR", "Implementação Assistida 3 meses", "Mentor de Propósito (bônus)"],
    description: "Para empresas que querem plano + execução garantida + alinhamento de propósito.",
    popular: true
} as const;

export const COMBO_TRANSFORMACAO = {
    id: "combo-transformacao",
    name: "COMBO TRANSFORMAÇÃO",
    subtitle: "Profissionalização Completa",
    price: 19660.20, // CORRIGIDO de 18799.20
    priceFormatted: "R$ 19.660,20",
    originalPrice: 20880.00,
    originalPriceFormatted: "R$ 20.880,00",
    installments: "12x de R$ 1.638,35",
    boletoInstallments: "4x de R$ 4.915,05",
    cashDiscount: 0.15,
    cashPrice: 16711.17,
    cashPriceFormatted: "R$ 16.711,17",
    savings: 2387.80,
    savingsFormatted: "R$ 2.387,80",
    includes: ["MAR", "Lumia 12 meses", "Implementação Assistida 3 meses", "Mentor de Propósito (bônus)"],
    description: "Para empresas que querem transformação profunda com suporte automatizado."
} as const;

// ============================================================================
// HELPERS
// ============================================================================

export const formatPrice = (price: number): string => {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
    return originalPrice * (1 - discountPercent);
};

export const calculateInstallment = (totalPrice: number, installments: number): number => {
    return totalPrice / installments;
};
