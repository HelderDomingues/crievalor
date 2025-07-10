import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Eye, Users, Calendar, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminAuth from "@/components/admin/AdminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EventLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  instagram: string | null;
  lecture_date: string | null;
  lecture_id: string | null;
  notes: string | null;
  status: string;
  material_sent: boolean;
  created_at: string;
  lectures: {
    id: string;
    title: string;
  } | null;
}

const EventLeadsAdmin = () => {
  const [leads, setLeads] = useState<EventLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lectureFilter, setLectureFilter] = useState("all");
  const [lectures, setLectures] = useState<{ id: string; title: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data, error } = await supabase
        .from("lectures")
        .select("id, title")
        .eq("is_active", true)
        .order("title");

      if (error) throw error;
      setLectures(data || []);
    } catch (error) {
      console.error("Erro ao carregar palestras:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("event_leads")
        .select(`
          *,
          lectures:lecture_id (
            id,
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("event_leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;
      
      toast({ title: "Status atualizado com sucesso!" });
      fetchLeads();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const toggleMaterialSent = async (leadId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("event_leads")
        .update({ material_sent: !currentStatus })
        .eq("id", leadId);

      if (error) throw error;
      
      toast({ title: "Status do material atualizado!" });
      fetchLeads();
    } catch (error) {
      console.error("Erro ao atualizar material:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do material.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Nome", "Email", "Telefone", "Empresa", "Instagram", "Palestra", "Data da Palestra", "Status", "Material Enviado", "Data de Cadastro"],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.company_name || "",
        lead.instagram || "",
        lead.lectures?.title || "",
        lead.lecture_date ? new Date(lead.lecture_date).toLocaleDateString('pt-BR') : "",
        lead.status,
        lead.material_sent ? "Sim" : "Não",
        new Date(lead.created_at).toLocaleDateString('pt-BR')
      ])
    ];

    const csvString = csvContent.map(row => row.map(field => `"${field}"`).join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads-palestras-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.company_name && lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesLecture = lectureFilter === "all" || lead.lecture_id === lectureFilter;

    return matchesSearch && matchesStatus && matchesLecture;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "novo": "default",
      "contatado": "secondary",
      "interessado": "outline",
      "convertido": "outline",
    };
    
    const labels: Record<string, string> = {
      "novo": "Novo",
      "contatado": "Contatado",
      "interessado": "Interessado",
      "convertido": "Convertido",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <AdminAuth onAuthenticated={() => {}}>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Leads de Palestras</h1>
                <p className="text-muted-foreground">
                  Gerencie os leads capturados através das palestras
                </p>
              </div>
              
              <Button onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{leads.length}</p>
                      <p className="text-sm text-muted-foreground">Total de Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {leads.filter(l => l.status === "novo").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Novos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {leads.filter(l => l.material_sent).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Material Enviado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {leads.filter(l => l.status === "contatado").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Contatados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome, email, telefone ou empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="contatado">Contatado</SelectItem>
                      <SelectItem value="interessado">Interessado</SelectItem>
                      <SelectItem value="convertido">Convertido</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={lectureFilter} onValueChange={setLectureFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Palestra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as palestras</SelectItem>
                      {lectures.map((lecture) => (
                        <SelectItem key={lecture.id} value={lecture.id}>
                          {lecture.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-8">Carregando leads...</div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum lead encontrado.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Palestra</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              {lead.notes && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {lead.notes}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{lead.email}</p>
                              <p className="text-muted-foreground">{lead.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{lead.company_name || "-"}</p>
                              {lead.instagram && (
                                <p className="text-muted-foreground">{lead.instagram}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">
                                {lead.lectures?.title || "N/A"}
                              </p>
                              {lead.lecture_date && (
                                <p className="text-muted-foreground">
                                  {new Date(lead.lecture_date).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={lead.status}
                              onValueChange={(value) => updateLeadStatus(lead.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="novo">Novo</SelectItem>
                                <SelectItem value="contatado">Contatado</SelectItem>
                                <SelectItem value="interessado">Interessado</SelectItem>
                                <SelectItem value="convertido">Convertido</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={lead.material_sent ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleMaterialSent(lead.id, lead.material_sent)}
                            >
                              {lead.material_sent ? "Enviado" : "Enviar"}
                            </Button>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Open email client
                                  window.open(`mailto:${lead.email}?subject=Sobre a palestra`);
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Open WhatsApp
                                  window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`);
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </AdminAuth>
  );
};

export default EventLeadsAdmin;