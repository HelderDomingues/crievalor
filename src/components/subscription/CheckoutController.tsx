
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

  // Limpar qualquer erro ao carregar ou quando mudam os parâmetros
  useEffect(() => {
    setCheckoutError(null);
  }, [planId, installments, paymentType]);

  // Limitar a frequência de tentativas de checkout
  useEffect(() => {
    // Verificar se há um checkout em andamento com timestamp recente
    const lastCheckoutTime = localStorage.getItem('checkoutTimestamp');
    const checkoutPlanId = localStorage.getItem('checkoutPlanId');
    
    if (lastCheckoutTime && checkoutPlanId === planId) {
      const timeSinceLastCheckout = Date.now() - Number(lastCheckoutTime);
      
      // Se tentou fazer checkout nos últimos 5 segundos, mostrar mensagem
      if (timeSinceLastCheckout < 5000) {
        console.log("Tentativa de checkout muito recente, aguardando...");
        setIsCheckingOut(true);
        
        // Limpar após 3 segundos
        const timer = setTimeout(() => {
          setIsCheckingOut(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [planId]);

  // Verificador de tempo para evitar múltiplos cliques
  const canAttemptCheckout = () => {
    const now = Date.now();
    const lastTime = Number(localStorage.getItem('checkoutTimestamp') || '0');
    const attempts = Number(localStorage.getItem('checkoutAttempts') || '0');
    
    // Se a última tentativa foi há mais de 5 minutos, resetar contador
    if (now - lastTime > 5 * 60 * 1000) {
      localStorage.setItem('checkoutAttempts', '1');
      return true;
    }
    
    // Permitir no máximo 3 tentativas em 5 minutos
    if (attempts >= 3) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde alguns minutos antes de tentar novamente.",
        variant: "destructive",
      });
      return false;
    }
    
    // Incrementar contador de tentativas
    localStorage.setItem('checkoutAttempts', String(attempts + 1));
    
    // Se a última tentativa foi há menos de 15 segundos, bloquear
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
      console.log("Checkout já em processamento, ignorando clique");
      toast({
        title: "Processando pagamento",
        description: "Seu pagamento já está sendo processado. Aguarde um momento.",
        variant: "default",
      });
      return;
    }

    // Verificar tempo entre tentativas
    if (!canAttemptCheckout()) {
      return;
    }

    // Gerar ID de processo único para este checkout
    const processId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setCheckoutProcessId(processId);
    
    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      console.log(`[${processId}] Iniciando checkout para plano: ${planId} com ${installments} parcelas, método de pagamento: ${paymentType}`);
      
      // Registrar timestamp da tentativa
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      
      // Get current domain for success/cancel URLs
      const baseUrl = window.location.origin;
      
      const result = await subscriptionService.createCheckoutSession({
        planId,
        successUrl: `${baseUrl}/checkout/success`,
        cancelUrl: `${baseUrl}/checkout/canceled`,
        installments,
        paymentType
      });
      
      // Se for um plano de preço personalizado, redirecionar para página de contato
      if (result.isCustomPlan) {
        navigate(result.url);
        return;
      }
      
      if (!result.url) {
        throw new Error("Nenhuma URL de checkout retornada");
      }
      
      console.log(`[${processId}] Redirecionando para checkout: ${result.url}`);
      
      // Redirecionamento direto para página de pagamento
      if (result.directRedirect) {
        // Registrar no localStorage antes de redirecionar
        localStorage.setItem('checkoutPlanId', planId);
        localStorage.setItem('checkoutInstallments', String(installments));
        localStorage.setItem('checkoutPaymentType', paymentType);
        
        // Redirecionar para a página de pagamento
        window.location.href = result.url;
      } else {
        // Fallback, devemos sempre ter directRedirect=true
        navigate(result.url);
      }
    } catch (error: any) {
      console.error(`[${processId}] Erro criando sessão de checkout:`, error);
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
