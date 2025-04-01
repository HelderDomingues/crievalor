
import React from "react";
import SubscriptionPlan from "./SubscriptionPlan";
import { plans } from "@/components/pricing/pricingData";

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
        name="Essencial"
        price="12 x de R$ 179,90"
        cashPrice="R$ 1.942,92"
        description="Para empresas com equipes de 1 a 5 pessoas"
        features={[
          "01 Sessão on line (até 50 min) com consultor para orientações e tira dúvidas",
          "01 revisão do seu planejamento dentro do prazo de 06 meses",
          "Acesso à comunidade exclusiva"
        ]}
        isCurrentPlan={isPlanCurrent("basic_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Quero este plano"
        popular={false}
      />
      
      {/* Plano Profissional */}
      <SubscriptionPlan
        id="pro_plan"
        name="Profissional"
        price="12 x de R$ 399,90"
        cashPrice="R$ 4.318,92"
        description="Para empresas com equipes de 6 a 10 pessoas"
        features={[
          "02 Sessões on line (até 50 min) com consultor para orientações e tira dúvidas",
          "02 revisões do seu planejamento dentro do prazo de 06 meses",
          "Acesso à comunidade exclusiva"
        ]}
        isCurrentPlan={isPlanCurrent("pro_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Quero este plano"
        popular={true}
      />
      
      {/* Plano Empresarial */}
      <SubscriptionPlan
        id="enterprise_plan"
        name="Empresarial"
        price="12 x de R$ 799,90"
        cashPrice="R$ 8.638,92"
        description="Para empresas com equipes de 11 a 50 pessoas"
        features={[
          "04 Sessões de mentoria avançada on line (até 50 min) com consultor para orientações e tira dúvidas",
          "02 revisões do seu planejamento dentro do prazo de 06 meses",
          "Acesso à comunidade exclusiva"
        ]}
        isCurrentPlan={isPlanCurrent("enterprise_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Quero este plano"
        popular={false}
      />
      
      {/* Plano Corporativo */}
      <SubscriptionPlan
        id="corporate_plan"
        name="Corporativo"
        customPrice="Condições sob consulta"
        description="Para empresas com equipes acima de 51 pessoas na organização"
        features={[
          "Consultoria dedicada",
          "Plano Estratégico Aprofundado",
          "Mentorias especializadas para equipes", 
          "Implementação assistida"
        ]}
        isCurrentPlan={isPlanCurrent("corporate_plan")}
        isCheckingOut={isCheckingOut}
        onSubscribe={onSubscribe}
        buttonLabel="Consultar via WhatsApp"
        popular={false}
      />
    </div>
  );
};

export default SubscriptionPlans;
