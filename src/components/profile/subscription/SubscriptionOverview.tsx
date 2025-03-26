
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import DeleteCustomerData from "./DeleteCustomerData";
import { subscriptionService } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionOverviewProps {
  subscription: any;
  planDetails: any;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const SubscriptionOverview = ({ 
  subscription, 
  planDetails, 
  getStatusColor, 
  getStatusText 
}: SubscriptionOverviewProps) => {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = React.useState(false);

  if (!subscription) {
    return <p>Assinatura não encontrada.</p>;
  }

  const statusBadgeClass = getStatusColor(subscription.status);
  const statusText = getStatusText(subscription.status);
  const formattedCreatedAt = formatDate(subscription.created_at);

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      
      const result = await subscriptionService.cancelSubscription(subscription.id);
      
      if (result.success) {
        toast({
          title: "Assinatura cancelada",
          description: "Sua assinatura foi cancelada com sucesso.",
          variant: "default",
        });
        
        // Recarregar a página após 2 segundos para atualizar o estado
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "Erro ao cancelar assinatura",
          description: result.message || "Ocorreu um erro ao cancelar sua assinatura.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao cancelar assinatura:", error);
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message || "Ocorreu um erro ao cancelar sua assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Assinatura</CardTitle>
        <CardDescription>Informações sobre seu plano atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Plano:</p>
              <p className="text-lg font-semibold">{planDetails.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <Badge className={statusBadgeClass}>{statusText}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Data de Início:</p>
              <p>{formattedCreatedAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Valor:</p>
              <p>{typeof planDetails.price === 'number' 
                ? planDetails.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : planDetails.price}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mt-6">
            {subscription.status === "active" && (
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelando..." : "Cancelar assinatura"}
              </Button>
            )}
            
            {subscription.asaas_payment_link && (
              <Button variant="outline" asChild>
                <a href={subscription.asaas_payment_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acessar portal de pagamento
                </a>
              </Button>
            )}
            
            <DeleteCustomerData />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;
