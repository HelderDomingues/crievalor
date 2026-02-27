
/**
 * Static payment links for MAR plans
 */

// Tipos de pagamento
export type PaymentType = 'installments' | 'cash' | 'credit' | 'pix' | 'credit_cash' | 'boleto';

// Interface para os links de pagamento
interface PaymentLinks {
  installments: string; // Link para pagamento parcelado
  cash: string; // Link para pagamento à vista com desconto
}

// Interface para os planos com seus respectivos links
interface PlanPaymentLinks {
  [planId: string]: PaymentLinks;
}

// Links estáticos de pagamento conforme fornecido nas instruções
export const MAR_PAYMENT_LINKS: PlanPaymentLinks = {
  pro_plan: {
    installments: "#",
    cash: "#",
  },
  enterprise_plan: {
    installments: "#",
    cash: "#",
  },
  corporate_plan: {
    installments: "https://wa.me/5547992150289",
    cash: "https://wa.me/5547992150289",
  }
};

/**
 * Obtém o link de pagamento para um plano específico
 * @param planId ID do plano
 * @param paymentType Tipo de pagamento (parcelado ou à vista)
 * @returns URL do link de pagamento
 */
export function getPaymentLink(planId: string, paymentType: PaymentType = 'installments'): string {
  if (!MAR_PAYMENT_LINKS[planId]) {
    console.error(`Link de pagamento não encontrado para o plano: ${planId}`);
    return '';
  }

  // Map the expanded payment types to the basic types used in payment links
  const mappedType = paymentType === 'credit' || paymentType === 'credit_cash' ? 'installments' : 'cash';

  return MAR_PAYMENT_LINKS[planId][mappedType];
}

/**
 * Verifica se um plano é corporativo (tratamento especial para WhatsApp)
 * @param planId ID do plano
 * @returns true se for plano corporativo
 */
export function isCorporatePlan(planId: string): boolean {
  return planId === 'corporate_plan';
}

/**
 * Direciona o usuário para o link de pagamento apropriado
 * @param planId ID do plano
 * @param paymentType Tipo de pagamento (parcelado ou à vista)
 */
export function redirectToPayment(planId: string, paymentType: PaymentType = 'installments'): void {
  const paymentLink = getPaymentLink(planId, paymentType);

  if (paymentLink) {
    // Se for plano corporativo, abrimos o WhatsApp em uma nova janela
    if (isCorporatePlan(planId)) {
      window.open(paymentLink, '_blank');
    } else {
      // Para outros planos, redirecionamos para o link de pagamento Asaas
      window.location.href = paymentLink;
    }
  }
}
