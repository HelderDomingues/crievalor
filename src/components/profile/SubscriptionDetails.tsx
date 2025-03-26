
import React, { useState, useEffect } from "react";
import { Subscription, PLANS, subscriptionService } from "@/services/subscriptionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionOverview from "./subscription/SubscriptionOverview";
import InvoiceHistory from "./subscription/InvoiceHistory";
import ContractDetails from "./subscription/ContractDetails";
import SubscriptionNotFound from "./subscription/SubscriptionNotFound";

export const SubscriptionDetails = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [isUpdatingContract, setIsUpdatingContract] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      try {
        const subscriptionData = await subscriptionService.getCurrentSubscription();
        if (subscriptionData) {
          setSubscription(subscriptionData);
          setContractAccepted(subscriptionData.contract_accepted || false);
          
          const paymentsData = await subscriptionService.getPayments();
          setInvoices(paymentsData || []);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da assinatura.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [toast]);

  const handleAcceptContract = async () => {
    if (!contractAccepted) return;
    
    setIsUpdatingContract(true);
    try {
      const result = await subscriptionService.updateContractAcceptance(true);
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Contrato aceito com sucesso!",
        });
        setSubscription(prev => prev ? {
          ...prev,
          contract_accepted: true,
          contract_accepted_at: new Date().toISOString()
        } : null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error accepting contract:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar o contrato. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingContract(false);
    }
  };

  const requestReceipt = async (invoiceId: string) => {
    try {
      const result = await subscriptionService.requestReceipt(invoiceId);
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Recibo solicitado com sucesso. Enviaremos para seu email.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error requesting receipt:", error);
      toast({
        title: "Erro",
        description: "Não foi possível solicitar o recibo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "trialing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "past_due":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "trialing":
        return "Período de teste";
      case "past_due":
        return "Pagamento pendente";
      case "canceled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getPlanDetails = (planId: string) => {
    const plan = Object.values(PLANS).find(p => p.id === planId);
    
    if (!plan) {
      return { name: "Plano não identificado", features: [] };
    }
    
    if ('customPrice' in plan && plan.customPrice) {
      return {
        name: plan.name,
        price: "Sob Consulta",
        features: plan.features
      };
    } else if ('price' in plan) {
      return {
        name: plan.name,
        price: plan.priceLabel,
        features: plan.features
      };
    }
    
    return {
      name: plan.name,
      price: "N/A",
      features: plan.features
    };
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Carregando informações...</div>;
  }

  if (!subscription) {
    return <SubscriptionNotFound />;
  }

  const planDetails = getPlanDetails(subscription.plan_id);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="invoices">Faturas</TabsTrigger>
        <TabsTrigger value="contract">Contrato</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <SubscriptionOverview 
          subscription={subscription}
          planDetails={planDetails}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      </TabsContent>

      <TabsContent value="invoices">
        <InvoiceHistory 
          invoices={invoices}
          requestReceipt={requestReceipt}
        />
      </TabsContent>

      <TabsContent value="contract">
        <ContractDetails 
          subscription={subscription}
          contractAccepted={contractAccepted}
          setContractAccepted={setContractAccepted}
          handleAcceptContract={handleAcceptContract}
          isUpdatingContract={isUpdatingContract}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SubscriptionDetails;
