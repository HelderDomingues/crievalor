import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Mail, Phone, Building, Clock, Target, TrendingUp } from "lucide-react";

interface DiagnosticRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  company_size: string | null;
  current_revenue: string | null;
  main_challenge: string | null;
  desired_results: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
}

const DiagnosticRequestsAdmin = () => {
  const [requests, setRequests] = useState<DiagnosticRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("diagnostic_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setRequests(data || []);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as solicitações de diagnóstico.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("diagnostic_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        )
      );

      toast({
        title: "Status atualizado",
        description: "O status da solicitação foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const },
      contacted: { label: "Contatado", variant: "default" as const },
      scheduled: { label: "Agendado", variant: "default" as const },
      completed: { label: "Concluído", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };

    const statusConfig = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Diagnósticos Gratuitos</h2>
        <Badge variant="outline">{requests.length} solicitações</Badge>
      </div>

      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.name}</CardTitle>
                  <CardDescription>
                    Solicitado em {format(new Date(request.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(request.status)}
                  <Select
                    value={request.status}
                    onValueChange={(value) => updateStatus(request.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="contacted">Contatado</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.phone}</span>
                </div>
                {request.company_name && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{request.company_name}</span>
                  </div>
                )}
                {request.company_size && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Porte: {request.company_size}</span>
                  </div>
                )}
              </div>

              {request.current_revenue && (
                <div className="text-sm">
                  <strong>Faturamento:</strong> {request.current_revenue}
                </div>
              )}

              {request.main_challenge && (
                <div className="text-sm">
                  <strong>Principal desafio:</strong> {request.main_challenge}
                </div>
              )}

              {request.desired_results && (
                <div className="text-sm">
                  <strong>Resultados desejados:</strong> {request.desired_results}
                </div>
              )}

              {request.timeline && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span><strong>Prazo esperado:</strong> {request.timeline}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${request.email}`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://wa.me/${request.phone.replace(/\D/g, '')}`, '_blank')}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma solicitação de diagnóstico encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default DiagnosticRequestsAdmin;