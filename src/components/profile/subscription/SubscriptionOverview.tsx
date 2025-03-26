import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PLANS } from "@/services/subscriptionService";
import { ExternalLink } from "lucide-react";
import DeleteCustomerData from "./DeleteCustomerData";

interface SubscriptionOverviewProps {
  subscription: any;
  onCancelSubscription: () => void;
}

const statusMap: { [key: string]: { label: string; variant: "default" | "destructive" | "success" | "outline" } } = {
  active: { label: "Ativa", variant: "success" },
  pending: { label: "Pendente", variant: "default" },
  canceled: { label: "Cancelada", variant: "destructive" },
  past_due: { label: "Vencida", variant: "destructive" },
  trialing: { label: "Em teste", variant: "default" },
};

const SubscriptionOverview = ({ subscription, onCancelSubscription }: SubscriptionOverviewProps) => {
  const plan = PLANS.find((p) => p.id === subscription.plan_id);

  if (!plan) {
    return <p>Plano não encontrado.</p>;
  }

  const statusInfo = statusMap[subscription.status] || { label: "Desconhecido", variant: "default" };
  const formattedCreatedAt = formatDate(subscription.created_at);

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
              <p className="text-lg font-semibold">{plan.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Data de Início:</p>
              <p>{formattedCreatedAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Valor:</p>
              <p>{(plan.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mt-6">
            {subscription.status === "active" && (
              <Button variant="outline" onClick={onCancelSubscription}>
                Cancelar assinatura
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
