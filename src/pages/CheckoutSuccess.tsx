
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subscriptionService } from "@/services/subscriptionService";
import { Card, CardContent } from "@/components/ui/card";

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
          // Already processed this payment in this session, avoid duplicates
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
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            {loading ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            ) : (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {loading ? "Processando seu pagamento..." : "Parabéns pela sua decisão!"}
            </h1>
            
            {!loading && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Você acaba de dar o primeiro passo para transformar seu negócio!
              </p>
            )}
          </div>
          
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Próximo passo: Questionário MAR</h3>
                      <p className="text-muted-foreground">
                        Para iniciarmos o desenvolvimento de sua estratégia, complete o questionário 
                        MAR. Suas respostas são fundamentais para criarmos um plano personalizado
                        para o seu negócio.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-2 text-primary" 
                        onClick={() => navigate('/questionario-mar')}
                      >
                        Iniciar questionário
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Acesso à Comunidade</h3>
                      <p className="text-muted-foreground">
                        Você agora tem acesso à nossa comunidade exclusiva de empreendedores. 
                        Conecte-se, compartilhe experiências e amplie seu networking com pessoas 
                        que também estão transformando seus negócios.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-2 text-primary" 
                        onClick={() => navigate('/comunidade')}
                      >
                        Acessar comunidade
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {!loading && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">O futuro do seu negócio começa agora!</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                O MAR é mais que uma consultoria – é um compromisso com a transformação do seu negócio. 
                Durante este processo, você terá todo o suporte necessário para implementar mudanças
                significativas e alcançar resultados transformadores. Estamos ansiosos para ver seu
                negócio crescer!
              </p>
              
              <Button 
                size="lg" 
                onClick={handleContinue}
                className="gap-2"
              >
                Ir para minha área
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
