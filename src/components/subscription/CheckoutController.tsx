
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import CheckoutError from "./CheckoutError";
import { PaymentType } from "@/components/pricing/PaymentOptions";

interface CheckoutControllerProps {
  planId: string;
  installments: number;
  paymentType: PaymentType;
  buttonText?: string;
  redirectToProfile?: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | null;
}

// Helper function to safely parse JSON
const safeJsonParse = (jsonString: string | null): any => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
};

const CheckoutController: React.FC<CheckoutControllerProps> = ({
  planId,
  installments,
  paymentType,
  buttonText = "Assinar agora",
  redirectToProfile = false,
  className = "",
  variant = "default",
  size = "default"
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutProcessId, setCheckoutProcessId] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [buttonAnimation, setButtonAnimation] = useState<string>("");

  // Check for any existing checkout session on component mount
  useEffect(() => {
    const checkForExistingSession = async () => {
      const lastPaymentUrl = localStorage.getItem('lastPaymentUrl');
      const lastPlanId = localStorage.getItem('checkoutPlanId');
      const lastTimestamp = localStorage.getItem('checkoutTimestamp');

      // If we have a recent payment URL and it matches the current plan, try to use it
      if (lastPaymentUrl && lastPlanId === planId && lastTimestamp) {
        const timeSince = Date.now() - Number(lastTimestamp);

        // Only consider URLs created in the last 10 minutes
        if (timeSince < 10 * 60 * 1000) {
          console.log("Found recent payment URL:", lastPaymentUrl);
          return;
        }
      }

      // Clear any checkout recovery state if user wasn't in the middle of checkout
      if (!lastTimestamp || Date.now() - Number(lastTimestamp) > 30 * 60 * 1000) {
        localStorage.removeItem('checkoutRecoveryState');
      }
    };

    checkForExistingSession();
  }, [planId]);

  useEffect(() => {
    setCheckoutError(null);
  }, [planId, installments, paymentType]);

  useEffect(() => {
    const lastCheckoutTime = localStorage.getItem('checkoutTimestamp');
    const checkoutPlanId = localStorage.getItem('checkoutPlanId');

    if (lastCheckoutTime && checkoutPlanId === planId) {
      const timeSinceLastCheckout = Date.now() - Number(lastCheckoutTime);

      if (timeSinceLastCheckout < 5000) {
        console.log("Recent checkout attempt detected, waiting...");
        setIsCheckingOut(true);

        const timer = setTimeout(() => {
          setIsCheckingOut(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [planId]);

  // Efeito para aplicar a animação adequada com base no estado do processamento
  useEffect(() => {
    if (!isCheckingOut) {
      setButtonAnimation("");
      return;
    }

    switch (processingStep) {
      case "initializing":
        setButtonAnimation("payment-button-transition payment-button-processing");
        break;
      case "processing":
        setButtonAnimation("payment-button-transition payment-button-processing");
        break;
      case "success":
        setButtonAnimation("payment-button-transition payment-button-success success-animation");
        break;
      case "error":
        setButtonAnimation("payment-button-transition payment-button-error error-animation");
        break;
      case "redirect":
        setButtonAnimation("payment-button-transition payment-button-success");
        break;
      default:
        setButtonAnimation("payment-button-transition");
    }
  }, [processingStep, isCheckingOut]);

  const canAttemptCheckout = () => {
    const now = Date.now();
    const lastTime = Number(localStorage.getItem('checkoutTimestamp') || '0');
    const attempts = Number(localStorage.getItem('checkoutAttempts') || '0');

    console.log("[Checkout] Checking status:", { now, lastTime, attempts });

    if (now - lastTime > 60 * 1000) { // Reduced from 5m to 1m for better user experience
      localStorage.setItem('checkoutAttempts', '1');
      return true;
    }

    if (attempts >= 5) { // Increased from 3 to 5
      toast({
        title: "Muitas tentativas",
        description: "Aguarde um minuto antes de tentar novamente.",
        variant: "destructive",
      });
      return false;
    }

    localStorage.setItem('checkoutAttempts', String(attempts + 1));
    return true;
  };

  // Function to attempt to recover from a previous checkout
  const attemptRecovery = async (): Promise<boolean> => {
    try {
      const recoveryData = safeJsonParse(localStorage.getItem('checkoutRecoveryState'));
      if (!recoveryData) return false;

      // Only try to recover for the same plan and within 10 minutes (reduced from 30)
      const isValidRecovery =
        recoveryData.planId === planId &&
        Date.now() - recoveryData.timestamp < 10 * 60 * 1000;

      if (!isValidRecovery) {
        console.log("[Checkout] Recovery data expired or mismatched.");
        localStorage.removeItem('checkoutRecoveryState');
        return false;
      }

      // ... rest is same
      return false;
    } catch (e) { return false; }
  };

  const handleCheckout = async () => {
    console.log("[Checkout] handleCheckout start. Plan:", planId);
    if (!user) {
      console.log("[Checkout] No user, redirecting to auth");
      if (redirectToProfile) {
        navigate("/auth", { state: { returnUrl: "/profile" } });
      } else {
        navigate("/auth", { state: { returnUrl: "/checkout?plan=" + planId } });
      }
      return;
    }

    if (isCheckingOut) {
      console.log("[Checkout] Already in progress");
      return;
    }

    if (!canAttemptCheckout()) {
      console.log("[Checkout] canAttemptCheckout returned false");
      return;
    }

    // Try to recover from a previous checkout attempt first
    if (await attemptRecovery()) {
      console.log("[Checkout] Recovery triggered");
      return;
    }

    const processId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[Checkout] Starting process: ${processId}`);
    setCheckoutProcessId(processId);

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Visual feedback for user - show initialization step
      setProcessingStep("initializing");

      // Save important information to localStorage
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      localStorage.setItem('checkoutPlanId', planId);

      // Define amount in cents
      let amountCents = 0;
      if (planId === 'basico') amountCents = 56000;
      else if (planId === 'intermediario') amountCents = 74000;
      else if (planId === 'avancado') amountCents = 81000;

      console.log(`[${processId}] Requesting checkout for plan: ${planId}, amount: ${amountCents}`);

      // Visual feedback for user - show processing step
      setProcessingStep("processing");

      // Save recovery state
      const recoveryState = {
        timestamp: Date.now(),
        planId,
        installments,
        paymentType,
        processId
      };
      localStorage.setItem('checkoutRecoveryState', JSON.stringify(recoveryState));

      // Process the payment via Netlify Function
      const functionUrl = `${window.location.origin}/.netlify/functions/create-checkout`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: user.id,
          amount: amountCents,
          name: user.user_metadata?.full_name || user.email,
          email: user.email,
          installments,
          intent: localStorage.getItem('checkoutIntent') || 'purchase'
        })
      });

      const result = await response.json();
      console.log(`[${processId}] Result:`, result);

      if (!result.success) {
        throw new Error(result.error || "Erro ao iniciar assinatura");
      }

      // Visual feedback for user - show success step
      setProcessingStep("success");

      // Mostrar toast de sucesso
      toast({
        title: "Pagamento iniciado com sucesso",
        description: "Você será redirecionado para a página de pagamento.",
        variant: "default",
      });

      // Add a slight delay before redirecting for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      if (result.redirect) {
        navigate(result.redirect === '/dashboard' && planId === 'basico' ? '/lumia/sucesso' : result.redirect);
        return;
      }

      // Update recovery state with payment link
      const updatedRecoveryState = {
        ...recoveryState,
        paymentLink: result.url
      };
      localStorage.setItem('checkoutRecoveryState', JSON.stringify(updatedRecoveryState));

      // Store basic payment information if needed for local state
      localStorage.setItem('checkoutNetcredId', result.id);

      // Visual feedback for user - show redirect step
      setProcessingStep("redirect");

      // Use window.location.href to ensure a complete redirect
      // Add a slight delay for the animation
      setTimeout(() => {
        window.location.href = result.url || "/";
      }, 1200);

    } catch (error: any) {
      console.error(`[${processId}] Error creating checkout session:`, error);

      // Visual feedback for user - show error step
      setProcessingStep("error");

      // Enhanced error logging
      let errorMessage = error.message || "Não foi possível iniciar o processo de assinatura.";

      console.log(`[${processId}] Error details:`, {
        message: errorMessage,
        originalError: error,
        stack: error.stack
      });

      // More user-friendly error message
      setCheckoutError(errorMessage);

      toast({
        title: "Erro ao iniciar checkout",
        description: "Não foi possível iniciar o processo de assinatura. Por favor, verifique seus dados de perfil e tente novamente.",
        variant: "destructive",
      });

      // Add a slight delay before resetting state for better UX
      setTimeout(() => {
        setIsCheckingOut(false);
        setProcessingStep(null);
      }, 1500);

      // Clear recovery state on error
      localStorage.setItem('checkoutRecoveryAttempted', 'true');
    }
  };

  // Get appropriate button text based on the processing step
  const getButtonText = () => {
    if (isCheckingOut) {
      if (isRecovering) {
        return "Recuperando...";
      }

      switch (processingStep) {
        case "initializing":
          return "Iniciando...";
        case "processing":
          return "Processando...";
        case "success":
          return "Sucesso!";
        case "redirect":
          return "Redirecionando...";
        case "error":
          return "Erro";
        default:
          return "Processando...";
      }
    }

    if (planId === 'basico') return "Iniciar Trial Grátis";
    return buttonText;
  };

  // Get the appropriate icon based on processing state
  const getButtonIcon = () => {
    if (!isCheckingOut) return null;

    switch (processingStep) {
      case "success":
        return <CheckCircle2 className="mr-2 h-4 w-4 animate-bounce" />;
      case "error":
        return <XCircle className="mr-2 h-4 w-4" />;
      default:
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }
  };

  return (
    <div className="checkout-controller">
      {checkoutError && <CheckoutError error={checkoutError} className="slide-up" />}

      <Button
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className={`transition-all duration-300 ${className} ${buttonAnimation}`}
        variant={variant}
        size={size}
      >
        {isCheckingOut && (
          <>
            {getButtonIcon()}
            <span className={processingStep === "success" ? "fade-in" : ""}>
              {getButtonText()}
            </span>
          </>
        )}
        {!isCheckingOut && (
          <span className="hover-raise inline-block">{buttonText}</span>
        )}
      </Button>
    </div>
  );
};

export default CheckoutController;
