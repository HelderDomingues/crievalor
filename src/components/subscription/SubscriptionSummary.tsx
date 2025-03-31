
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CreditCard } from "lucide-react";
import { Subscription } from "@/services/subscriptionService";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SubscriptionSummaryProps {
  subscription: Subscription | null;
  planName: string;
}

const SubscriptionSummary = ({ subscription, planName }: SubscriptionSummaryProps) => {
  if (!subscription) {
    return null;
  }

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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sua Assinatura</CardTitle>
          {getStatusBadge(subscription.status)}
        </div>
        <CardDescription>
          Detalhes do seu plano atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="font-medium">{planName}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {subscription.status === "canceled" ? 
              "Assinatura cancelada" : 
              `Renovação em ${subscription.current_period_end ? formatDate(subscription.current_period_end) : "N/A"}`
            }
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/subscription">
              <CreditCard className="mr-2 h-4 w-4" />
              Gerenciar Assinatura
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link to="/subscription?tab=plans">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Ver Planos
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummary;
