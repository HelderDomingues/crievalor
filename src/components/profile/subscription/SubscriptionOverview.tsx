
import React from "react";
import { Subscription } from "@/services/subscriptionService";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SubscriptionOverviewProps {
  subscription: Subscription;
  planDetails: {
    name: string;
    price?: string;
    features: string[];
  };
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const SubscriptionOverview = ({
  subscription,
  planDetails,
  getStatusColor,
  getStatusText
}: SubscriptionOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Assinatura</CardTitle>
        <CardDescription>Informações sobre seu plano atual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Plano</h3>
            <p className="text-lg font-semibold">{planDetails.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
            <Badge variant="outline" className={`${getStatusColor(subscription.status)} mt-1`}>
              {getStatusText(subscription.status)}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Valor</h3>
            <p className="text-lg font-semibold">{planDetails.price}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Próxima cobrança</h3>
            <p className="text-lg font-semibold">
              {subscription.current_period_end 
                ? formatDate(subscription.current_period_end)
                : "N/A"}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">O que está incluído:</h3>
          <ul className="space-y-2">
            {planDetails.features?.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {subscription.status === "active" && (
          <div className="pt-2">
            <Button variant="outline" color="destructive" asChild>
              <a href="/subscription">Gerenciar Assinatura</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;
