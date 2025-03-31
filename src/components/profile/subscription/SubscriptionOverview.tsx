
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, CheckCircle, CreditCard, Download, ExternalLink, FileText, Receipt } from "lucide-react";
import { Subscription, PaymentDetails } from "@/types/subscription";
import { subscriptionService } from "@/services/subscriptionService";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionOverviewProps {
  subscription: Subscription;
  onCancelSubscription?: () => void;
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({ 
  subscription,
  onCancelSubscription 
}) => {
  const { toast } = useToast();
  const plan = subscriptionService.getPlanFromId(subscription.plan_id);
  
  // Extract payment method from payment details
  const paymentDetails = subscription.payment_details as PaymentDetails | null;
  const paymentMethod = paymentDetails?.billing_type || "N/A";
  const installments = paymentDetails?.total_installments || subscription.installments || 1;
  const currentInstallment = paymentDetails?.installment_count || 1;
  const paymentValue = paymentDetails?.value || 0;
  const invoiceUrl = paymentDetails?.invoice_url || "";
  const receiptUrl = paymentDetails?.receipt_url || "";
  
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "CREDIT_CARD":
        return "Cartão de Crédito";
      case "BOLETO":
        return "Boleto Bancário";
      case "PIX":
        return "PIX";
      default:
        return method;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "past_due":
        return "bg-amber-500";
      case "canceled":
        return "bg-red-500";
      case "pending":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    if (!status) return "bg-gray-500";
    
    switch (status.toUpperCase()) {
      case "CONFIRMED":
      case "RECEIVED":
      case "RECEIVED_IN_CASH":
        return "bg-green-500";
      case "PENDING":
      case "AWAITING_RISK_ANALYSIS":
        return "bg-blue-500";
      case "OVERDUE":
        return "bg-amber-500";
      case "REFUNDED":
      case "REFUND_REQUESTED":
      case "CHARGEBACK_REQUESTED":
      case "CHARGEBACK_DISPUTE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Ativa";
      case "past_due":
        return "Pagamento Pendente";
      case "canceled":
        return "Cancelada";
      case "pending":
        return "Aguardando Aprovação";
      default:
        return status;
    }
  };
  
  const translatePaymentStatus = (status: string) => {
    if (!status) return "N/A";
    
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "Confirmado";
      case "RECEIVED":
        return "Recebido";
      case "RECEIVED_IN_CASH":
        return "Recebido em Dinheiro";
      case "PENDING":
        return "Pendente";
      case "AWAITING_RISK_ANALYSIS":
        return "Em Análise";
      case "OVERDUE":
        return "Atrasado";
      case "REFUNDED":
        return "Reembolsado";
      case "REFUND_REQUESTED":
        return "Reembolso Solicitado";
      case "CHARGEBACK_REQUESTED":
        return "Chargeback Solicitado";
      case "CHARGEBACK_DISPUTE":
        return "Em Disputa de Chargeback";
      default:
        return status;
    }
  };
  
  const handleRequestReceipt = async () => {
    try {
      if (!subscription.payment_id) {
        toast({
          title: "Recibo não disponível",
          description: "Não há pagamento associado a esta assinatura.",
          variant: "destructive",
        });
        return;
      }
      
      const result = await subscriptionService.requestReceipt(subscription.payment_id);
      
      if (result.success) {
        toast({
          title: "Recibo solicitado",
          description: "O recibo foi solicitado e será enviado para seu email.",
        });
      } else {
        toast({
          title: "Erro ao solicitar recibo",
          description: result.error || "Não foi possível solicitar o recibo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao solicitar recibo:", error);
      toast({
        title: "Erro ao solicitar recibo",
        description: "Ocorreu um erro ao tentar solicitar o recibo.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpenInvoice = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    } else {
      toast({
        title: "Fatura não disponível",
        description: "O link da fatura não está disponível no momento.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpenReceipt = () => {
    if (receiptUrl) {
      window.open(receiptUrl, "_blank");
    } else {
      toast({
        title: "Comprovante não disponível",
        description: "O comprovante de pagamento ainda não está disponível.",
        variant: "destructive",
      });
    }
  };
  
  const getExpirationText = () => {
    if (!subscription.current_period_end) return "Não disponível";
    
    const expirationDate = new Date(subscription.current_period_end);
    return expirationDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const renderPlanDetails = () => {
    if (!plan) return <p className="text-muted-foreground">Detalhes do plano não disponíveis</p>;
    
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-lg">{plan.name}</h3>
        {'price' in plan && (
          <p className="text-muted-foreground">
            {installments > 1 
              ? `${installments}x de R$ ${formatCurrency(plan.price)} (R$ ${formatCurrency(plan.totalPrice)} no total)`
              : `R$ ${formatCurrency(plan.cashPrice)} à vista`
            }
          </p>
        )}
        
        <div className="mt-4 space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Detalhes da Assinatura</CardTitle>
            <CardDescription>
              Informações e status da sua assinatura atual
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(subscription.status)} text-white`}>
            {translateStatus(subscription.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {subscription.status === "pending" && (
          <Alert variant="default" className="bg-amber-100 border-amber-400 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sua assinatura está pendente de confirmação de pagamento. O acesso será liberado assim que o pagamento for aprovado.
            </AlertDescription>
          </Alert>
        )}
        
        {subscription.status === "past_due" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Há um problema com seu pagamento. Por favor, verifique e regularize para manter seu acesso.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium mb-4">Plano Contratado</h3>
            {renderPlanDetails()}
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Informações de Pagamento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Método de Pagamento:</span>
                </div>
                <span className="font-medium">{formatPaymentMethod(paymentMethod)}</span>
              </div>
              
              {installments > 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Parcela:</span>
                  </div>
                  <span className="font-medium">{currentInstallment} de {installments}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status do Pagamento:</span>
                </div>
                <Badge className={`${getPaymentStatusColor(subscription.payment_status || "")} text-white`}>
                  {translatePaymentStatus(subscription.payment_status || "")}
                </Badge>
              </div>
              
              {paymentValue > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Valor:</span>
                  </div>
                  <span className="font-medium">R$ {formatCurrency(paymentValue)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Válido até:</span>
                </div>
                <span className="font-medium">{getExpirationText()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-base font-medium mb-4">Documentos e Ações</h3>
          <div className="flex flex-wrap gap-3">
            {invoiceUrl && (
              <Button variant="outline" size="sm" onClick={handleOpenInvoice}>
                <FileText className="h-4 w-4 mr-2" />
                Visualizar Fatura
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
            
            {receiptUrl && (
              <Button variant="outline" size="sm" onClick={handleOpenReceipt}>
                <Receipt className="h-4 w-4 mr-2" />
                Comprovante
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={handleRequestReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Solicitar Recibo
            </Button>
            
            {onCancelSubscription && subscription.status === "active" && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onCancelSubscription}
              >
                Cancelar Assinatura
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;
