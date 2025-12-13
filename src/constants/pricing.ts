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
        price: 1757.00,
        priceFormatted: "R$ 1.757,00",
        period: "trimestre"
    },
    annual: {
        // Plano ANUAL ISOLADO com 20% de desconto
        basePrice: 8388.00, // Base: 12 meses sem desconto
        discountPercent: 0.20, // 20% de desconto
        discountAmount: 1677.60, // 20% de 8388
        price: 6710.40, // Preço final com desconto
        priceFormatted: "R$ 6.710,40",
        period: "ano",
        savings: "Economia de R$ 1.677,60"
    },
    // Preço para 12 meses (usado nos combos) - SEM DESCONTO
    twelveMonths: {
        price: 8388.00,
        priceFormatted: "R$ 8.388,00",
        period: "12 meses",
        note: "Preço usado nos combos, SEM desconto aplicado"
    },
    description: "6 agentes de IA especializados disponíveis 24/7: Estratégia, Marketing, Vendas, Finanças, Operações e Pessoas."
} as const;

export const MENTOR_PROPOSITO_PRICING = {
    name: "Mentor de Propósito",
    price: 299.00,
    priceFormatted: "R$ 299,00",
    installments: "5x de R$ 59,80",
    description: "Jornada guiada com IA para descoberta do propósito organizacional e definição de valores. Metodologia proprietária integrando logoterapia, PNL e análise comportamental.",
    isBeta: false,
    betaEndDate: null,
    activeDate: "2025-12-01"
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
    priceThreeMonths: 9000.00, // Preço para 3 meses (usado nos combos)
    minMonths: 3,
    maxMonths: 6,
    minTotal: 9000.00,
    maxTotal: 18000.00,
    pricePerMonthFormatted: "R$ 3.000/mês",
    priceThreeMonthsFormatted: "R$ 9.000,00",
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
// COMBOS - Valores da Planilha Oficial
// Fonte: Planilha Google Sheets fornecida em 13/12/2025
// ============================================================================

export const COMBO_ESSENCIAL = {
    id: "combo-essencial",
    name: "COMBO ESSENCIAL",
    subtitle: "Clareza Estratégica",

    // Composição
    components: {
        mar: 3497.00,
        lumia12Meses: 8388.00,
        mentorProposito: 299.00
    },

    // Valores
    fullPrice: 11888.00, // MAR + Lumia 12m + Mentor
    bonusMentor: -299.00, // Mentor é bônus
    discountPercent: 0.10, // 10%
    discountAmount: 1188.80, // 10% de (11888 - 299)
    totalDiscount: 1487.80, // Desconto + Bônus Mentor

    price: 10400.20, // Preço final com desconto
    priceFormatted: "R$ 10.400,20",

    originalPrice: 11888.00,
    originalPriceFormatted: "R$ 11.888,00",

    // Parcelamento
    creditCard: {
        installments: 12,
        installmentValue: 902.73,
        installmentFormatted: "12x de R$ 902,73",
        total: 10832.81, // Inclui taxas de administração
        totalFormatted: "R$ 10.832,81"
    },

    boleto: {
        installments: 4,
        installmentValue: 2600.05,
        installmentFormatted: "4x de R$ 2.600,05",
        total: 10400.20,
        totalFormatted: "R$ 10.400,20"
    },

    // Informações
    includes: ["MAR", "Lumia 12 meses", "Mentor de Propósito (bônus)"],
    description: "Para empresas que querem começar com diagnóstico e plano, e testar o poder da IA.",
    savings: 1487.80,
    savingsFormatted: "R$ 1.487,80"
} as const;

export const COMBO_AVANCADO = {
    id: "combo-avancado",
    name: "COMBO AVANÇADO",
    subtitle: "Profissionalização Acelerada",

    // Composição
    components: {
        mar: 3497.00,
        implementacao3Meses: 9000.00,
        mentorProposito: 299.00
    },

    // Valores
    fullPrice: 12500.00, // MAR + Implementação 3m + Mentor
    bonusMentor: -299.00,
    discountPercent: 0.10,
    discountAmount: 1250.00, // 10% de (12500 - 299)
    totalDiscount: 1549.00, // Desconto + Bônus

    price: 10951.00, // Preço final com desconto
    priceFormatted: "R$ 10.951,00",

    originalPrice: 12500.00,
    originalPriceFormatted: "R$ 12.500,00",

    // Parcelamento
    creditCard: {
        installments: 12,
        installmentValue: 950.54,
        installmentFormatted: "12x de R$ 950,54",
        total: 11406.52, // Inclui taxas
        totalFormatted: "R$ 11.406,52"
    },

    boleto: {
        installments: 4,
        installmentValue: 2737.75,
        installmentFormatted: "4x de R$ 2.737,75",
        total: 10951.00,
        totalFormatted: "R$ 10.951,00"
    },

    // Informações
    includes: ["MAR", "Implementação Assistida 3 meses", "Mentor de Propósito (bônus)"],
    description: "Para empresas que querem plano + execução garantida + alinhamento de propósito.",
    popular: true,
    savings: 1549.00,
    savingsFormatted: "R$ 1.549,00"
} as const;

export const COMBO_TRANSFORMACAO = {
    id: "combo-transformacao",
    name: "COMBO TRANSFORMAÇÃO",
    subtitle: "Profissionalização Completa",

    // Composição
    components: {
        mar: 3497.00,
        lumia12Meses: 8388.00,
        implementacao3Meses: 9000.00,
        mentorProposito: 299.00
    },

    // Valores
    fullPrice: 20888.00, // MAR + Lumia + Implementação + Mentor (nota: planilha diz 20888, não 20880)
    bonusMentor: -299.00,
    discountPercent: 0.10,
    discountAmount: 2088.80, // 10% de (20888 - 299)
    totalDiscount: 2387.80, // Desconto + Bônus

    price: 18799.20, // Preço final com desconto
    priceFormatted: "R$ 18.799,20",

    originalPrice: 20888.00,
    originalPriceFormatted: "R$ 20.888,00",

    // Parcelamento
    creditCard: {
        installments: 12,
        installmentValue: 1631.74,
        installmentFormatted: "12x de R$ 1.631,74",
        total: 19580.88, // Inclui taxas
        totalFormatted: "R$ 19.580,88"
    },

    boleto: {
        installments: 4,
        installmentValue: 4699.80,
        installmentFormatted: "4x de R$ 4.699,80",
        total: 18799.20,
        totalFormatted: "R$ 18.799,20"
    },

    // Informações
    includes: ["MAR", "Lumia 12 meses", "Implementação Assistida 3 meses", "Mentor de Propósito (bônus)"],
    description: "Para empresas que querem transformação profunda com suporte automatizado.",
    savings: 2387.80,
    savingsFormatted: "R$ 2.387,80"
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
