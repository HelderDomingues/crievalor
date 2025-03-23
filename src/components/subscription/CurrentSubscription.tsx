
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
            <p>{getCurrentPlanName()}</p>
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default CurrentSubscription;
