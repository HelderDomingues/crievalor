
import React from "react";
import { Check, CreditCard, User, ShoppingCart } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: "plan" | "payment" | "registration" | "processing";
}

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  const steps = [
    { id: "plan", label: "Plano", icon: ShoppingCart },
    { id: "payment", label: "Pagamento", icon: CreditCard },
    { id: "registration", label: "Cadastro", icon: User },
    { id: "processing", label: "Processando", icon: Check }
  ];

  return (
    <div className="mb-8">
      <div className="hidden sm:flex justify-between items-center">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isPast = getStepIndex(currentStep) > index;
          
          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div 
                  className={`h-1 flex-1 mx-2 rounded-full ${
                    isPast ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                  }`} 
                />
              )}
              
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : isPast 
                        ? "bg-primary/20 text-primary" 
                        : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  {isPast ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span 
                  className={`mt-2 text-sm ${
                    isActive || isPast ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile view */}
      <div className="flex sm:hidden justify-between mt-4">
        <span className="text-lg font-medium">
          {steps.find(s => s.id === currentStep)?.label || "Checkout"}
        </span>
        <span className="text-sm text-muted-foreground">
          Etapa {getStepIndex(currentStep) + 1} de {steps.length}
        </span>
      </div>
    </div>
  );
};

// Helper function to get step index
function getStepIndex(currentStep: string): number {
  const steps = ["plan", "payment", "registration", "processing"];
  return steps.indexOf(currentStep);
}

export default CheckoutSteps;
