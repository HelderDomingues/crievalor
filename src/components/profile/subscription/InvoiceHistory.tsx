
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InvoiceHistoryProps {
  invoices: any[];
  requestReceipt: (invoiceId: string) => Promise<void>;
}

const InvoiceHistory = ({ invoices, requestReceipt }: InvoiceHistoryProps) => {
  return (
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
                        <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Fatura
                        </a>
                      </Button>
                    )}
                    {invoice.invoice_pdf && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar PDF
                        </a>
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
  );
};

export default InvoiceHistory;
