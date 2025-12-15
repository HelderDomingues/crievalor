
import { Plan, RegularPlan, CustomPricePlan } from "@/types/subscription";

// Pricing plans
// Pricing plans - Cleared (Legacy)
export const PLANS: Record<string, Plan> = {};

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
