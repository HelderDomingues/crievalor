
import React, { useState, useEffect } from "react";
import { Subscription } from "@/types/subscription";
import { subscriptionService } from "@/services/subscriptionService";
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

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Carregando informações...</div>;
  }

  if (!subscription) {
    return <SubscriptionNotFound />;
  }

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
          onCancelSubscription={undefined}
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
