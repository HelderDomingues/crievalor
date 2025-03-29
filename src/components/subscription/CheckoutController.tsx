
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { subscriptionService } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
  const [checkoutAttempts, setCheckoutAttempts] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

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

  const canAttemptCheckout = () => {
    const now = Date.now();
    const lastTime = Number(localStorage.getItem('checkoutTimestamp') || '0');
    const attempts = Number(localStorage.getItem('checkoutAttempts') || '0');
    
    if (now - lastTime > 5 * 60 * 1000) {
      localStorage.setItem('checkoutAttempts', '1');
      return true;
    }
    
    if (attempts >= 3) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde alguns minutos antes de tentar novamente.",
        variant: "destructive",
      });
      return false;
    }
    
    localStorage.setItem('checkoutAttempts', String(attempts + 1));
    
    if (now - lastTime < 15000) {
      toast({
        title: "Aguarde um momento",
        description: "Por favor, aguarde alguns segundos antes de tentar novamente.",
        variant: "default",
      });
      return false;
    }
    
    return true;
  };

  // Function to attempt to recover from a previous checkout
  const attemptRecovery = async (): Promise<boolean> => {
    try {
      const recoveryData = safeJsonParse(localStorage.getItem('checkoutRecoveryState'));
      if (!recoveryData) return false;
      
      // Only try to recover for the same plan and within 30 minutes
      const isValidRecovery = 
        recoveryData.planId === planId && 
        Date.now() - recoveryData.timestamp < 30 * 60 * 1000;
        
      if (!isValidRecovery) return false;
      
      console.log("Attempting to recover checkout from:", recoveryData);
      setIsRecovering(true);
      
      // Try to get existing payment info
      if (recoveryData.paymentLink) {
        console.log("Found existing payment link, redirecting to:", recoveryData.paymentLink);
        localStorage.setItem('lastPaymentUrl', recoveryData.paymentLink);
        window.location.href = recoveryData.paymentLink;
        return true;
      }
      
      setIsRecovering(false);
      return false;
    } catch (error) {
      console.error("Error in recovery attempt:", error);
      setIsRecovering(false);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      if (redirectToProfile) {
        navigate("/auth", { state: { returnUrl: "/profile" } });
      } else {
        navigate("/auth", { state: { returnUrl: "/subscription?plan=" + planId } });
      }
      return;
    }

    if (isCheckingOut) {
      console.log("Checkout already in progress, ignoring click");
      toast({
        title: "Processando pagamento",
        description: "Seu pagamento já está sendo processado. Aguarde um momento.",
        variant: "default",
      });
      return;
    }

    if (!canAttemptCheckout()) {
      return;
    }
    
    // Try to recover from a previous checkout attempt first
    if (await attemptRecovery()) {
      return;
    }

    const processId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setCheckoutProcessId(processId);
    
    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      console.log(`[${processId}] Starting checkout for plan: ${planId} with ${installments} installments, payment method: ${paymentType}`);
      
      // Save important information to localStorage
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      localStorage.setItem('checkoutInstallments', String(installments));
      localStorage.setItem('checkoutPaymentType', paymentType);
      localStorage.setItem('checkoutPlanId', planId);
      
      // Save recovery state
      const recoveryState = {
        timestamp: Date.now(),
        planId,
        installments,
        paymentType,
        processId
      };
      localStorage.setItem('checkoutRecoveryState', JSON.stringify(recoveryState));
      
      const baseUrl = window.location.origin;
      
      // Log more details of the request
      console.log(`[${processId}] Making checkout request with:`, {
        planId,
        installments,
        paymentType,
        successUrl: `${baseUrl}/checkout/success`,
        cancelUrl: `${baseUrl}/checkout/canceled`
      });
      
      const result = await subscriptionService.createCheckoutSession({
        planId,
        successUrl: `${baseUrl}/checkout/success`,
        cancelUrl: `${baseUrl}/checkout/canceled`,
        installments,
        paymentType
      });
      
      console.log(`[${processId}] Checkout result:`, result);
      
      if (result.isCustomPlan) {
        navigate(result.url);
        return;
      }
      
      if (!result.url) {
        throw new Error("Nenhum link de checkout foi retornado");
      }
      
      console.log(`[${processId}] Redirecting to checkout: ${result.url}`);
      
      // Update recovery state with payment link
      const updatedRecoveryState = {
        ...recoveryState,
        paymentLink: result.url
      };
      localStorage.setItem('checkoutRecoveryState', JSON.stringify(updatedRecoveryState));
      localStorage.setItem('lastPaymentUrl', result.url);
      
      // Save additional information before redirecting
      if (result.payment) {
        // Ensure we're storing a string for payment ID
        const paymentId = typeof result.payment === 'object' ? result.payment.id : result.payment;
        localStorage.setItem('checkoutPaymentId', paymentId);
      }
      
      if (result.dbSubscription?.id) {
        localStorage.setItem('checkoutSubscriptionId', result.dbSubscription.id);
      }
      
      // Use window.location.href to ensure a complete redirect
      window.location.href = result.url;
    } catch (error: any) {
      console.error(`[${processId}] Error creating checkout session:`, error);
      
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
      setIsCheckingOut(false);
      
      // Clear recovery state on error
      localStorage.setItem('checkoutRecoveryAttempted', 'true');
    }
  };

  return (
    <div className="checkout-controller">
      <CheckoutError error={checkoutError || ""} />
      
      <Button
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className={className}
        variant={variant}
        size={size}
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isRecovering ? "Recuperando..." : "Processando..."}
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
};

export default CheckoutController;
