
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

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

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
      navigate("/auth");
      return;
    }

    async function loadSubscription() {
      try {
        console.log("Loading subscription data for user...");
        const sub = await subscriptionService.getCurrentSubscription();
        console.log("Subscription loaded:", sub);
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
      console.log(`Starting checkout for plan: ${planId}`);
      
      const { url } = await subscriptionService.createCheckoutSession(
        planId,
        `${window.location.origin}/subscription?success=true`,
        `${window.location.origin}/subscription?canceled=true`
      );
      
      if (!url) {
        throw new Error("No checkout URL returned from Stripe");
      }
      
      console.log("Redirecting to Stripe checkout:", url);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
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

  // Find the plan name from the stored plan_id (which is actually a Stripe Price ID)
  const getCurrentPlanName = () => {
    if (!subscription?.plan_id) return "N/A";
    
    const plan = subscriptionService.getPlanFromPriceId(subscription.plan_id);
    return plan ? plan.name : subscription.plan_id;
  };

  // Check if the current subscription matches a specific plan
  const isPlanCurrent = (planId: string) => {
    if (!subscription || !subscription.plan_id) return false;
    
    const plan = Object.values(PLANS).find(p => p.id === planId);
    return plan?.stripe_price_id === subscription.plan_id;
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
          <h1 className="text-3xl font-bold mb-8">Planos e Assinaturas</h1>
          
          <CheckoutError error={checkoutError || ""} />
          
          {subscription && ["active", "trialing"].includes(subscription.status) && (
            <CurrentSubscription
              subscription={subscription}
              isCanceling={isCanceling}
              onCancelSubscription={handleCancelSubscription}
              getCurrentPlanName={getCurrentPlanName}
            />
          )}
          
          <SubscriptionPlans
            isCheckingOut={isCheckingOut}
            isPlanCurrent={isPlanCurrent}
            onSubscribe={handleSubscribe}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
