
import React, { useState, useEffect } from "react";
import { Subscription, PLANS, subscriptionService } from "@/services/subscriptionService";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Check, Download, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

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
          
          // Fetch payments instead of invoices
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
    return plan || { name: "Plano não identificado", price: "N/A", features: [] };
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Carregando informações...</div>;
  }

  if (!subscription) {
    return (
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Nenhuma assinatura encontrada</AlertTitle>
        <AlertDescription>
          Você ainda não possui uma assinatura ativa. Visite nossa página de planos para conhecer nossas opções.
        </AlertDescription>
        <Button variant="outline" className="mt-4" asChild>
          <a href="/subscription">Ver planos</a>
        </Button>
      </Alert>
    );
  }

  const planDetails = getPlanDetails(subscription.plan_id);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="invoices">Faturas</TabsTrigger>
        <TabsTrigger value="contract">Contrato</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
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
      </TabsContent>

      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>Histórico completo de pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Nenhuma fatura encontrada</p>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Fatura #{invoice.number}</h3>
                          <Badge variant="outline" className={`${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(String(invoice.created * 1000))} • {(invoice.amount_paid / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <div className="flex gap-2 self-end md:self-auto">
                        {invoice.hosted_invoice_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">Ver Fatura</a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => requestReceipt(invoice.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Solicitar Recibo
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contract">
        <Card>
          <CardHeader>
            <CardTitle>Contrato de Serviço</CardTitle>
            <CardDescription>Termos e condições do serviço contratado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscription.contract_accepted ? (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Contrato Aceito</AlertTitle>
                <AlertDescription>
                  Você aceitou os termos do contrato em {subscription.contract_accepted_at ? formatDate(subscription.contract_accepted_at) : "N/A"}.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-bold text-lg mb-2">Contrato de Prestação de Serviços</h3>
                  
                  <p className="mb-2">Por este instrumento particular, a empresa CrieValor, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede à Rua XXXXX, nº XXX, Bairro XXXXX, Cidade XXXXX, Estado XXXXX, doravante denominada CONTRATADA, e CONTRATANTE, conforme cadastro realizado na plataforma, celebram o presente contrato mediante as seguintes cláusulas e condições:</p>
                  
                  <h4 className="font-semibold mt-4 mb-1">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
                  <p>O presente contrato tem como objeto a prestação de serviços conforme o plano contratado pelo CONTRATANTE através da plataforma online da CONTRATADA.</p>
                  
                  <h4 className="font-semibold mt-4 mb-1">CLÁUSULA SEGUNDA - DO PRAZO</h4>
                  <p>O presente contrato vigorará pelo prazo determinado de acordo com o ciclo de cobrança do plano escolhido pelo CONTRATANTE, sendo renovado automaticamente por iguais períodos, salvo manifestação contrária de qualquer das partes.</p>
                  
                  <h4 className="font-semibold mt-4 mb-1">CLÁUSULA TERCEIRA - DO PREÇO E PAGAMENTO</h4>
                  <p>Pelos serviços objeto deste contrato, o CONTRATANTE pagará à CONTRATADA o valor correspondente ao plano escolhido, conforme as opções disponíveis na plataforma no momento da contratação. O pagamento será realizado de forma recorrente através dos meios de pagamento disponibilizados pela plataforma.</p>
                  
                  <h4 className="font-semibold mt-4 mb-1">CLÁUSULA QUARTA - DAS OBRIGAÇÕES DAS PARTES</h4>
                  <p>São obrigações da CONTRATADA:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Prestar os serviços conforme detalhado na descrição do plano contratado;</li>
                    <li>Manter o sigilo e a confidencialidade de todas as informações recebidas;</li>
                    <li>Disponibilizar suporte técnico conforme previsto no plano contratado.</li>
                  </ul>
                  
                  <p>São obrigações do CONTRATANTE:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Pagar pontualmente o valor correspondente ao plano escolhido;</li>
                    <li>Utilizar os serviços contratados de acordo com a legislação vigente e nos termos deste contrato;</li>
                    <li>Fornecer informações verdadeiras durante o cadastro e toda a relação contratual.</li>
                  </ul>
                  
                  <h4 className="font-semibold mt-4 mb-1">CLÁUSULA QUINTA - DA RESCISÃO</h4>
                  <p>O presente contrato poderá ser rescindido por qualquer das partes, a qualquer tempo, mediante comunicação por escrito com antecedência mínima de 30 (trinta) dias, respeitando-se os serviços em andamento.</p>
                  
                  <h4 className="font-semibold mt-4 mb-1">CLÁUSULA SEXTA - DAS DISPOSIÇÕES GERAIS</h4>
                  <p>As partes elegem o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
                  
                  <p className="mt-4">E, por estarem assim justas e contratadas, as partes firmam o presente instrumento em meio eletrônico, mediante aceite do CONTRATANTE na plataforma.</p>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="contract-acceptance" 
                    checked={contractAccepted}
                    onCheckedChange={(checked) => setContractAccepted(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="contract-acceptance">
                      Declaro que li e aceito os termos e condições do contrato de prestação de serviços
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleAcceptContract}
                  disabled={!contractAccepted || isUpdatingContract}
                  className="w-full sm:w-auto"
                >
                  {isUpdatingContract ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Aceitar Contrato"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SubscriptionDetails;
