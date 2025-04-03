
/**
 * Static payment links for MAR plans
 */

// Tipos de pagamento
export type PaymentType = 'installments' | 'cash';

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
  basic_plan: {
    installments: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s", // Plano Essencial - Parcelado
    cash: "https://sandbox.asaas.com/c/fy15747uacorzbla", // Plano Essencial - À Vista
  },
  pro_plan: {
    installments: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon", // Plano Profissional - Parcelado
    cash: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq", // Plano Profissional - À Vista
  },
  enterprise_plan: {
    installments: "https://sandbox.asaas.com/c/z4vate6zwonrwoft", // Plano Empresarial - Parcelado
    cash: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s", // Plano Empresarial - À Vista
  },
  corporate_plan: {
    // O plano corporativo não tem links de pagamento, é sob consulta via WhatsApp
    installments: "wa.me//+5547992150289",
    cash: "wa.me//+5547992150289",
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
  
  return MAR_PAYMENT_LINKS[planId][paymentType];
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
