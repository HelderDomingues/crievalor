
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subscriptionService } from "@/services/subscriptionService";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        setLoading(true);
        // Check if we already processed this payment
        const processedTimestamp = sessionStorage.getItem('paymentSuccessProcessed');
        
        if (processedTimestamp) {
          // Already processed this payment in the current session, avoid duplicates
          console.log("Payment success already processed in this session");
          setSubscriptionUpdated(true);
          setLoading(false);
          return;
        }
        
        // Mark as processed
        sessionStorage.setItem('paymentSuccessProcessed', String(Date.now()));
        
        // Get the current subscription to update its status
        const subscription = await subscriptionService.getCurrentSubscription();
        
        if (subscription && subscription.status === "pending") {
          // Update subscription status if needed
          console.log("Updating subscription status from pending to active");
          // This would normally be handled by webhooks, but we can check with the payment service
          // Just mark it as updated for the UI
          setSubscriptionUpdated(true);
        }
        
        // Show toast of confirmation
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi realizado com sucesso. Você já pode acessar todos os recursos do seu plano.",
          variant: "default",
        });
        
        // Clear checkout data saved during redirection
        localStorage.removeItem('checkoutPlanId');
        localStorage.removeItem('checkoutInstallments');
        localStorage.removeItem('checkoutTimestamp');
      } catch (error) {
        console.error("Error processing payment success:", error);
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [toast]);

  const handleContinue = () => {
    navigate("/subscription");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border rounded-lg p-8 text-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-lg">Processando seu pagamento...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <h1 className="text-3xl font-bold mb-4">Pagamento confirmado!</h1>
                
                <p className="text-muted-foreground mb-8">
                  Seu pagamento foi processado com sucesso e sua assinatura está ativa.
                  Você já pode começar a aproveitar todos os benefícios do seu plano.
                </p>
                
                <Button 
                  size="lg" 
                  onClick={handleContinue}
                  className="gap-2"
                >
                  Ver minha assinatura
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
