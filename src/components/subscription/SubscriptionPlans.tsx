
import React from "react";
import SubscriptionPlan from "./SubscriptionPlan";
import { PLANS } from "@/services/plansService";

interface SubscriptionPlansProps {
  isCheckingOut: boolean;
  isPlanCurrent: (planId: string) => boolean;
  onSubscribe: (planId: string) => Promise<void>;
  selectedInstallments?: number;
  onInstallmentsChange?: (installments: number) => void;
}

const SubscriptionPlans = ({
  isCheckingOut,
  isPlanCurrent,
  onSubscribe,
  selectedInstallments = 1,
  onInstallmentsChange,
}: SubscriptionPlansProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Plano Essencial */}
      <SubscriptionPlan
        id="basic_plan"
        name="Plano Essencial"
        price="R$ 14,99"
        basePrice={2158.80}
        features={[
          "Plano Estratégico simplificado",
          "01 Sessão on line (até 50 min) com consultor",
          "01 revisão do seu planejamento dentro do prazo de 06 meses",
          "Acesso à comunidade exclusiva"
        ]}
        isCurrentPlan={isPlanCurrent("basic_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Assinar"
        priceFormat="mensais em 12x"
      />
      
      {/* Plano Profissional */}
      <SubscriptionPlan
        id="pro_plan"
        name="Plano Profissional"
        price="R$ 33,32"
        basePrice={4798.80}
        features={[
          "Plano Estratégico Aprofundado com Relatórios Completos",
          "02 Sessões on line (até 50 min) com consultor",
          "02 revisões do seu planejamento dentro do prazo de 06 meses",
          "Acesso à comunidade exclusiva"
        ]}
        isCurrentPlan={isPlanCurrent("pro_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Assinar"
        priceFormat="mensais em 12x"
      />
      
      {/* Plano Empresarial */}
      <SubscriptionPlan
        id="enterprise_plan"
        name="Plano Empresarial"
        price="R$ 66,66"
        basePrice={9598.80}
        features={[
          "Plano Estratégico Aprofundado",
          "04 Sessões de mentoria avançada on line",
          "02 revisões do seu planejamento dentro do prazo de 06 meses",
          "Análises de cenário aprofundadas",
          "Acesso à comunidade exclusiva"
        ]}
        isCurrentPlan={isPlanCurrent("enterprise_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Assinar"
        priceFormat="mensais em 12x"
      />
      
      {/* Plano Corporativo */}
      <SubscriptionPlan
        id="corporate_plan"
        name="Plano Corporativo"
        customPrice="Sob Consulta"
        features={[
          "Solução personalizada para grandes corporações",
          "Consultoria dedicada",
          "Sessões de mentoria para equipe completa",
          "Implementação assistida"
        ]}
        isCurrentPlan={isPlanCurrent("corporate_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Consultar"
        priceFormat="mensais em 12x"
      />
    </div>
  );
};

export default SubscriptionPlans;
