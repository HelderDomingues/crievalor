/**
 * PRICING CONSTANTS - CRIE VALOR
 * 
 * Single source of truth para todos os preços de produtos e serviços.
 * 
 * ⚠️ IMPORTANTE: Ao alterar preços aqui, execute busca global no projeto
 * para verificar se não há valores hardcoded em outros lugares.
 * 
 * Última atualização: Fevereiro/2026
 * Fonte de verdade: pricingData.ts e documentação Crie Valor
 */

// ============================================================================
// PRODUTOS PRINCIPAIS - SISTEMA LUMIA
// ============================================================================

export const SISTEMA_LUMIA_PRICING = {
    basico: {
        id: "basico",
        name: "Sistema Lumia - Básico",
        monthly: {
            price: 560.00,
            priceFormatted: "R$ 560,00",
            period: "mês"
        },
        annual: {
            price: 6720.00,
            priceFormatted: "R$ 6.720,00",
            period: "ano"
        },
        description: "Ideal para começar a estruturar sua clareza estratégica. Inclui Planejamento Estratégico Acelerado, 6 Consultores Virtuais Especialistas e acesso para 1 usuário principal."
    },
    intermediario: {
        id: "intermediario",
        name: "Sistema Lumia - Intermediário",
        monthly: {
            price: 740.00,
            priceFormatted: "R$ 740,00",
            period: "mês"
        },
        annual: {
            price: 8880.00,
            priceFormatted: "R$ 8.880,00",
            period: "ano"
        },
        description: "Para empresas que buscam aceleração assistida. Inclui 2 reuniões mensais de implementação assistida e acesso para até 3 usuários."
    },
    avancado: {
        id: "avancado",
        name: "Sistema Lumia - Avançado",
        monthly: {
            price: 810.00,
            priceFormatted: "R$ 810,00",
            period: "mês"
        },
        annual: {
            price: 9720.00,
            priceFormatted: "R$ 9.720,00",
            period: "ano"
        },
        description: "Foco total em escala e acompanhamento intensivo. Inclui 4 reuniões mensais de implementação assistida e acesso para até 5 usuários."
    }
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

export const MENTORIA_EXECUTIVA_PRICING = {
    name: "Mentoria Executiva",
    pricePerMonth: 4000.00,
    pricePerMonthFormatted: "R$ 4.000/mês",
    includes: "Sistema Lumia incluso",
    description: "Sessões estratégicas quinzenais com fundadores Helder ou Paulo. Inclui acesso completo ao Sistema Lumia."
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
