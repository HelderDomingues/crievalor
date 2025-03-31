
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Subscription } from "@/services/subscriptionService";

interface CurrentSubscriptionProps {
  subscription: Subscription;
  isCanceling: boolean;
  onCancelSubscription: () => Promise<void>;
  getCurrentPlanName: () => string;
}

const CurrentSubscription = ({
  subscription,
  isCanceling,
  onCancelSubscription,
  getCurrentPlanName,
}: CurrentSubscriptionProps) => {
  const getStatusBadge = (status: string) => {
    const statusLowerCase = status.toLowerCase();
    
    switch (statusLowerCase) {
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
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

  const isActive = subscription.status.toLowerCase() === "active";
  const installmentsText = subscription.installments > 1 
    ? `em ${subscription.installments}x` 
    : "à vista";

  return (
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
            <p>{getCurrentPlanName()} {installmentsText}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Válida até:</p>
            <p>{formatDate(subscription.current_period_end)}</p>
          </div>
          {subscription.asaas_payment_link && !isActive && (
            <div>
              <p className="text-sm font-medium text-primary mb-1">Link de pagamento:</p>
              <Button variant="outline" asChild className="h-8 px-2 py-0 text-xs">
                <a href={subscription.asaas_payment_link} target="_blank" rel="noopener noreferrer">
                  Abrir link de pagamento
                </a>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            variant="destructive" 
            disabled={isCanceling || subscription.status.toLowerCase() === "canceled"}
            onClick={onCancelSubscription}
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
          
          <Button 
            variant="outline" 
            asChild
          >
            <a href="/subscription?tab=plans">
              Ver Planos
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CurrentSubscription;
