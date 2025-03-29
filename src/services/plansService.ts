
import { Plan, RegularPlan, CustomPricePlan } from "@/types/subscription";

// Pricing plans
export const PLANS: Record<string, Plan> = {
  BASIC: {
    id: "basic_plan",
    name: "Plano Essencial",
    price: 179.90,
    priceLabel: "12x de R$ 179,90",
    totalPrice: 2158.80, // 12 * 179.90
    cashPrice: 1942.92, // 10% discount on total
    features: ["Plano Estratégico simplificado", "Workshop de implantação", "Suporte por e-mail", "Acesso à comunidade"],
  },
  PRO: {
    id: "pro_plan",
    name: "Plano Profissional",
    price: 299.90,
    priceLabel: "12x de R$ 299,90",
    totalPrice: 3598.80, // 12 * 299.90
    cashPrice: 3238.92, // 10% discount on total
    features: ["Plano Estratégico detalhado", "Relatórios completos", "Workshop de implantação", "Sessão estratégica exclusiva", "Suporte via Whatsapp"],
  },
  ENTERPRISE: {
    id: "enterprise_plan",
    name: "Plano Empresarial",
    price: 799.90,
    priceLabel: "12x de R$ 799,90",
    totalPrice: 9598.80, // 12 * 799.90
    cashPrice: 8638.92, // 10% discount on total
    features: ["Plano Estratégico completo", "Relatórios completos", "Mentoria estratégica", "Acesso VIP a conteúdos exclusivos", "Suporte prioritário"],
  },
  CORPORATE: {
    id: "corporate_plan",
    name: "Plano Corporativo",
    customPrice: true,
    features: ["Plano Estratégico personalizado", "Consultoria dedicada", "Mentoria para equipe completa", "Acesso prioritário ao CEO", "Implementação assistida"],
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
