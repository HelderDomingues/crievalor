
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Clock, AlertCircle } from "lucide-react";
import { Subscription } from "@/services/subscriptionService";
import { PLANS } from "@/services/subscriptionService";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { subscriptionService } from "@/services/subscriptionService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SubscriptionDetailsProps {
  subscription: Subscription | null;
  invoices: any[] | null;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ subscription, invoices }) => {
  const [contractAccepted, setContractAccepted] = useState(false);
  
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

  const getPlanDetails = (planId: string) => {
    if (!planId) return { name: "N/A", price: "N/A" };
    
    const plan = subscriptionService.getPlanFromPriceId(planId);
    return plan ? { name: plan.name, price: plan.price } : { name: planId, price: "N/A" };
  };

  const handleContractAccept = () => {
    setContractAccepted(true);
    // In a real implementation, we would save this to the database
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // In a real implementation, we would download the invoice PDF
    console.log("Downloading invoice:", invoiceId);
  };

  const handleRequestReceipt = (invoiceId: string) => {
    // In a real implementation, we would generate and email a receipt
    console.log("Requesting receipt for invoice:", invoiceId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Assinatura {subscription ? getStatusBadge(subscription.status) : <Badge variant="outline">Nenhuma</Badge>}
          </CardTitle>
          <CardDescription>
            Detalhes da sua assinatura atual
          </CardDescription>
        </CardHeader>
        
        {subscription ? (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Plano:</p>
                <p>{getPlanDetails(subscription.plan_id).name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Valor:</p>
                <p>{getPlanDetails(subscription.plan_id).price}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <p>{subscription.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Válida até:</p>
                <p>{subscription.current_period_end ? formatDate(subscription.current_period_end) : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-lg font-medium">Nenhuma assinatura ativa</p>
                <p className="text-sm text-muted-foreground">Você ainda não possui uma assinatura ativa.</p>
              </div>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-end">
          <Button variant="outline" asChild>
            <Link to="/subscription">
              {subscription ? "Gerenciar assinatura" : "Ver planos disponíveis"}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {subscription && subscription.status === "active" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Faturas e Recibos</CardTitle>
              <CardDescription>
                Histórico financeiro da sua assinatura
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {invoices && invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{formatDate(invoice.created)}</TableCell>
                        <TableCell>{invoice.description || "Fatura mensal"}</TableCell>
                        <TableCell>R$ {(invoice.amount_paid / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          {invoice.status === "paid" ? 
                            <Badge className="bg-green-500">Pago</Badge> : 
                            <Badge variant="outline">{invoice.status}</Badge>
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            <span className="sr-only md:not-sr-only md:inline-block">
                              Fatura
                            </span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRequestReceipt(invoice.id)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            <span className="sr-only md:not-sr-only md:inline-block">
                              Recibo
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">Nenhuma fatura encontrada</p>
                    <p className="text-sm text-muted-foreground">
                      As faturas aparecerão aqui quando estiverem disponíveis.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termos de Contratação</CardTitle>
              <CardDescription>
                Contrato de uso do serviço
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Termos de serviço</p>
                    <p className="text-sm text-muted-foreground">
                      {contractAccepted 
                        ? "Você já aceitou os termos de contratação." 
                        : "Você precisa aceitar os termos de contratação."}
                    </p>
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={contractAccepted ? "outline" : "default"}>
                      {contractAccepted ? "Ver contrato" : "Aceitar contrato"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Termos de Contratação</DialogTitle>
                      <DialogDescription>
                        Leia atentamente os termos do contrato abaixo
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="max-h-96 overflow-y-auto p-4 border rounded-md">
                      <h3 className="text-lg font-semibold mb-4">Contrato de Prestação de Serviços</h3>
                      
                      <p className="mb-4">
                        1. OBJETO: O presente contrato tem por objeto a prestação de serviços de 
                        consultoria e/ou mentoria empresarial, conforme plano contratado.
                      </p>
                      
                      <p className="mb-4">
                        2. PAGAMENTO: O pagamento será realizado conforme o plano escolhido pelo 
                        CONTRATANTE, através da plataforma de pagamento designada pelo CONTRATADO.
                      </p>
                      
                      <p className="mb-4">
                        3. PRAZO: O presente contrato terá validade conforme o plano escolhido, 
                        com renovação automática, salvo manifestação em contrário de qualquer das partes.
                      </p>
                      
                      <p className="mb-4">
                        4. RESCISÃO: Qualquer das partes poderá rescindir o presente contrato a qualquer 
                        tempo, mediante aviso prévio de 30 (trinta) dias, sem ônus para qualquer das partes.
                      </p>
                      
                      {/* More contract terms would go here */}
                      
                      <p className="mt-8 text-sm text-muted-foreground">
                        Última atualização: {formatDate(new Date().toISOString())}
                      </p>
                    </div>
                    
                    <DialogFooter>
                      {!contractAccepted && (
                        <Button onClick={handleContractAccept}>
                          Aceitar termos
                        </Button>
                      )}
                      <Button variant="outline" type="button">
                        Download do contrato
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SubscriptionDetails;
