
import { Plan, RegularPlan, CustomPricePlan } from "@/types/subscription";

// Pricing plans
export const PLANS: Record<string, Plan> = {
  BASIC: {
    id: "basic_plan",
    name: "Plano Essencial",
    price: 179.90,
    priceLabel: "até 12x de R$ 179,90",
    totalPrice: 2158.80, // 12 * 179.90
    cashPrice: 1942.92, // 10% discount on total
    features: [
      "Plano Estratégico simplificado", 
      "01 Sessão on line (até 50 min) com consultor", 
      "01 revisão do seu planejamento dentro do prazo de 06 meses", 
      "Acesso à comunidade exclusiva"
    ],
    paymentOptions: {
      creditPaymentUrl: "https://sandbox.asaas.com/c/vydr3n77kew5fd4s",  // Asaas payment link for credit card
      cashPaymentUrl: "https://sandbox.asaas.com/c/fy15747uacorzbla",   // Asaas payment link for cash (10% discount)
    }
  },
  PRO: {
    id: "pro_plan",
    name: "Plano Profissional",
    price: 399.90,
    priceLabel: "até 12x de R$ 399,90",
    totalPrice: 4798.80, // 12 * 399.90
    cashPrice: 4318.92, // 10% discount on total
    features: [
      "Plano Estratégico Aprofundado com Relatórios Completos", 
      "02 Sessões on line (até 50 min) com consultor", 
      "02 revisões do seu planejamento dentro do prazo de 06 meses", 
      "Acesso à comunidade exclusiva"
    ],
    paymentOptions: {
      creditPaymentUrl: "https://sandbox.asaas.com/c/4fcw2ezk4je61qon",  // Asaas payment link for credit card
      cashPaymentUrl: "https://sandbox.asaas.com/c/pqnkhgvic7c25ufq",   // Asaas payment link for cash (10% discount)
    }
  },
  ENTERPRISE: {
    id: "enterprise_plan",
    name: "Plano Empresarial",
    price: 799.90,
    priceLabel: "até 12x de R$ 799,90",
    totalPrice: 9598.80, // 12 * 799.90
    cashPrice: 8638.92, // 10% discount on total
    features: [
      "Plano Estratégico Aprofundado",
      "04 Sessões de mentoria avançada on line",
      "02 revisões do seu planejamento dentro do prazo de 06 meses",
      "Análises de cenário aprofundadas",
      "Acesso à comunidade exclusiva"
    ],
    paymentOptions: {
      creditPaymentUrl: "https://sandbox.asaas.com/c/z4vate6zwonrwoft",  // Asaas payment link for credit card
      cashPaymentUrl: "https://sandbox.asaas.com/c/3pdwf46bs80mpk0s",   // Asaas payment link for cash (10% discount)
    }
  },
  CORPORATE: {
    id: "corporate_plan",
    name: "Plano Corporativo",
    customPrice: true,
    features: [
      "Solução personalizada para grandes corporações", 
      "Consultoria dedicada", 
      "Sessões de mentoria para equipe completa", 
      "Implementação assistida"
    ],
    contactOptions: {
      whatsappUrl: "https://wa.me/+5547992150289",  // WhatsApp contact for corporate plan
    }
  }
};

export const plansService = {
  // Get all available plans
  getPlans(): Record<string, Plan> {
    return PLANS;
  },
  
  // Get a specific plan by ID
  getPlanById(planId: string): Plan | undefined {
    return Object.values(PLANS).find(plan => plan.id === planId);
  },
  
  // Check if a plan is a custom price plan
  isCustomPricePlan(plan: Plan): plan is CustomPricePlan {
    return 'customPrice' in plan && plan.customPrice === true;
  },
  
  // Check if a plan is a regular plan
  isRegularPlan(plan: Plan): plan is RegularPlan {
    return 'price' in plan && 'cashPrice' in plan;
  },
  
  // Calculate payment amount based on plan and installments
  // This function should return the total amount to be paid, not per installment
  calculatePaymentAmount(plan: RegularPlan, installments: number): number {
    // If installments is 1, return cashPrice (with discount)
    // If installments > 1, return totalPrice (full price)
    return installments === 1 ? plan.cashPrice : plan.totalPrice;
  }
};
