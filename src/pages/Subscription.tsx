
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { subscriptionService, PLANS, Subscription } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    async function loadSubscription() {
      try {
        const sub = await subscriptionService.getCurrentSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error("Error loading subscription:", error);
        toast({
          title: "Erro ao carregar assinatura",
          description: "Não foi possível carregar os dados da sua assinatura.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user, navigate, toast]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      const { url } = await subscriptionService.createCheckoutSession(
        planId,
        `${window.location.origin}/subscription?success=true`,
        `${window.location.origin}/subscription?canceled=true`
      );
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setCheckoutError("Não foi possível iniciar o processo de assinatura.");
      toast({
        title: "Erro ao iniciar checkout",
        description: "Não foi possível iniciar o processo de assinatura.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;
    
    setIsCanceling(true);
    try {
      await subscriptionService.cancelSubscription(subscription.stripe_subscription_id);
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso.",
      });
      // Reload subscription data
      const sub = await subscriptionService.getCurrentSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Erro ao cancelar assinatura",
        description: "Não foi possível cancelar sua assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>;
      case "trialing":
        return <Badge className="bg-blue-500">Período de teste</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "past_due":
        return <Badge variant="destructive">Pagamento pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Carregando dados da assinatura...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Planos e Assinaturas</h1>
          
          {checkoutError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao iniciar checkout</AlertTitle>
              <AlertDescription>
                {checkoutError}
              </AlertDescription>
            </Alert>
          )}
          
          {subscription && ["active", "trialing"].includes(subscription.status) && (
            <div className="mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Sua Assinatura {getStatusBadge(subscription.status)}
                  </CardTitle>
                  <CardDescription>
                    Gerencie sua assinatura atual
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Plano:</p>
                    <p>{subscription.plan_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Válida até:</p>
                    <p>{formatDate(subscription.current_period_end)}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive" 
                    disabled={isCanceling || subscription.status === "canceled"}
                    onClick={handleCancelSubscription}
                  >
                    {isCanceling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      "Cancelar Assinatura"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-8">
            {Object.values(PLANS).map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">{plan.price}</span> /mês
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={
                      isCheckingOut || 
                      (subscription?.status === "active" && subscription?.plan_id === plan.id)
                    }
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : subscription?.status === "active" && subscription?.plan_id === plan.id ? (
                      "Plano Atual"
                    ) : (
                      "Assinar"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
