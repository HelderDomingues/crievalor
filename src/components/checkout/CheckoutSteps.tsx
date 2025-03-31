
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

type CheckoutStep = "plan" | "processing";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: "plan", label: "Plano e pagamento" },
    { id: "processing", label: "Processamento" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === step.id || 
                  steps.findIndex(s => s.id === currentStep) > index
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep === step.id || 
                steps.findIndex(s => s.id === currentStep) > index ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <div className="text-sm mt-2 text-center max-w-[100px]">{step.label}</div>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-2 ${
                  steps.findIndex(s => s.id === currentStep) > index
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
