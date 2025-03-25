
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { subscriptionService, Subscription, PLANS } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import SubscriptionLoading from "@/components/subscription/SubscriptionLoading";
import CurrentSubscription from "@/components/subscription/CurrentSubscription";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import CheckoutError from "@/components/subscription/CheckoutError";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionDetails from "@/components/profile/SubscriptionDetails";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentOptions from "@/components/pricing/PaymentOptions";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedInstallments, setSelectedInstallments] = useState(1);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const selectedTab = searchParams.get("tab") || "overview";
  const selectedPlan = searchParams.get("plan");

  useEffect(() => {
    if (success === "true") {
      toast({
        title: "Assinatura realizada com sucesso!",
        description: "Bem-vindo ao seu novo plano.",
        variant: "default",
      });
    } else if (canceled === "true") {
      toast({
        title: "Assinatura cancelada",
        description: "O processo de assinatura foi cancelado.",
        variant: "destructive",
      });
    }
  }, [success, canceled, toast]);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { returnUrl: "/subscription" } });
      return;
    }

    async function loadSubscription() {
      try {
        console.log("Loading subscription data for user...");
        const sub = await subscriptionService.getCurrentSubscription();
        console.log("Subscription loaded:", sub);
        setSubscription(sub);
        
        if (selectedPlan && (!sub || (sub.status !== "active" && sub.status !== "ACTIVE" && sub.status !== "trialing"))) {
          handleSubscribe(selectedPlan);
        }
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
  }, [user, navigate, toast, selectedPlan]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate("/auth", { state: { returnUrl: "/subscription" } });
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      console.log(`Starting checkout for plan: ${planId} with ${selectedInstallments} installments`);
      
      const result = await subscriptionService.createCheckoutSession({
        planId,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?canceled=true`,
        installments: selectedInstallments
      });
      
      // If it's a custom price plan, redirect to contact page
      if (result.isCustomPlan) {
        navigate(result.url);
        return;
      }
      
      if (!result.url) {
        throw new Error("No checkout URL returned from Asaas");
      }
      
      console.log("Redirecting to Asaas checkout:", result.url);
      
      window.location.href = result.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setCheckoutError(
        error.message || "Não foi possível iniciar o processo de assinatura."
      );
      toast({
        title: "Erro ao iniciar checkout",
        description: "Não foi possível iniciar o processo de assinatura. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.asaas_subscription_id) return;
    
    setIsCanceling(true);
    try {
      await subscriptionService.cancelSubscription(subscription.asaas_subscription_id);
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso.",
      });
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

  const getCurrentPlanName = () => {
    if (!subscription?.plan_id) return "N/A";
    
    const plan = subscriptionService.getPlanFromId(subscription.plan_id);
    return plan ? plan.name : subscription.plan_id;
  };

  const isPlanCurrent = (planId: string) => {
    if (!subscription || !subscription.plan_id) return false;
    return subscription.plan_id === planId;
  };

  const handleInstallmentsChange = (installments: number) => {
    setSelectedInstallments(installments);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main>
          <SubscriptionLoading />
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
          <h1 className="text-3xl font-bold mb-8">Dashboard de Assinatura</h1>
          
          <CheckoutError error={checkoutError || ""} />
          
          <Tabs defaultValue={selectedTab} className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="details">Detalhes da Assinatura</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {subscription && ["active", "ACTIVE", "trialing"].includes(subscription.status) && (
                <CurrentSubscription
                  subscription={subscription}
                  isCanceling={isCanceling}
                  onCancelSubscription={handleCancelSubscription}
                  getCurrentPlanName={getCurrentPlanName}
                />
              )}
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Acesso aos Recursos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Material Exclusivo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Acesse conteúdos exclusivos do seu plano.
                      </p>
                      <Button asChild>
                        <a href="/material-exclusivo">Acessar Materiais</a>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Mentorias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Agende suas sessões de mentoria incluídas no plano.
                      </p>
                      <Button asChild>
                        <a href="#mentorias">Agendar Mentoria</a>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Comunidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Participe da nossa comunidade exclusiva.
                      </p>
                      <Button asChild>
                        <a href="#comunidade">Acessar Comunidade</a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="plans">
              <SubscriptionPlans
                isCheckingOut={isCheckingOut}
                isPlanCurrent={isPlanCurrent}
                onSubscribe={handleSubscribe}
                selectedInstallments={selectedInstallments}
                onInstallmentsChange={handleInstallmentsChange}
              />
              
              <div className="mt-8">
                <PaymentOptions 
                  onInstallmentsChange={handleInstallmentsChange}
                  selectedInstallments={selectedInstallments}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <SubscriptionDetails />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
