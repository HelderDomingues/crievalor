
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckoutCanceled = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Retrieve checkout information from localStorage
  const planId = localStorage.getItem('checkoutPlanId');
  const installments = localStorage.getItem('checkoutInstallments');

  useEffect(() => {
    const processCancelation = async () => {
      try {
        setLoading(true);
        
        // Check if we already processed this cancellation
        const processedTimestamp = sessionStorage.getItem('paymentCanceledProcessed');
        
        if (processedTimestamp) {
          // Already processed this cancellation in the current session
          console.log("Payment cancellation already processed in this session");
          setLoading(false);
          return;
        }
        
        // Mark as processed
        sessionStorage.setItem('paymentCanceledProcessed', String(Date.now()));
        
        // Show toast of cancellation
        toast({
          title: "Checkout cancelado",
          description: "O processo de pagamento foi cancelado. Você pode tentar novamente quando quiser.",
          variant: "destructive",
        });
        
        // Note: We don't clear checkout data here so the user can try again
      } catch (error) {
        console.error("Error processing payment cancellation:", error);
      } finally {
        setLoading(false);
      }
    };

    processCancelation();
  }, [toast]);

  const handleTryAgain = () => {
    // If we have the plan and installments in localStorage, we can redirect directly to the same checkout
    if (planId) {
      navigate(`/subscription?tab=plans&plan=${planId}`);
    } else {
      navigate("/subscription?tab=plans");
    }
  };

  const handleBackToPlans = () => {
    // Clear checkout data that was saved during the redirection
    localStorage.removeItem('checkoutPlanId');
    localStorage.removeItem('checkoutInstallments');
    localStorage.removeItem('checkoutTimestamp');
    
    navigate("/mar#pricing");
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
                <p className="text-lg">Processando...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                
                <h1 className="text-3xl font-bold mb-4">Checkout cancelado</h1>
                
                <p className="text-muted-foreground mb-8">
                  O processo de assinatura foi cancelado. Se você encontrou algum problema
                  ou tem dúvidas, entre em contato com nossa equipe de suporte.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={handleTryAgain}
                    className="gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Tentar novamente
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="lg" 
                    onClick={handleBackToPlans}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para planos
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutCanceled;
