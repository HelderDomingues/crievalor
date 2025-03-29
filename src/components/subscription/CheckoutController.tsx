
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

    const processId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setCheckoutProcessId(processId);
    
    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      console.log(`[${processId}] Starting checkout for plan: ${planId} with ${installments} installments, payment method: ${paymentType}`);
      
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      localStorage.setItem('checkoutInstallments', String(installments));
      localStorage.setItem('checkoutPaymentType', paymentType);
      
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
        throw new Error("No checkout URL returned");
      }
      
      console.log(`[${processId}] Redirecting to checkout: ${result.url}`);
      
      if (result.directRedirect) {
        localStorage.setItem('checkoutPlanId', planId);
        
        window.location.href = result.url;
      } else {
        navigate(result.url);
      }
    } catch (error: any) {
      console.error(`[${processId}] Error creating checkout session:`, error);
      setCheckoutError(
        error.message || "Não foi possível iniciar o processo de assinatura."
      );
      toast({
        title: "Erro ao iniciar checkout",
        description: "Não foi possível iniciar o processo de assinatura. Por favor, verifique seus dados de perfil e tente novamente.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
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
            Processando...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
};

export default CheckoutController;
