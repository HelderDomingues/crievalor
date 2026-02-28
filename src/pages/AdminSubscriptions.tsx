import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminAuth from "@/components/admin/AdminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, ArrowLeft, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Payments Dialog State
    const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
    const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            // Fetch subscriptions and join with profiles and workspaces
            const { data, error } = await (supabase as any)
                .from('subscriptions')
                .select(`
                    *,
                    profiles (email, full_name, company_name),
                    workspaces (name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscriptions(data || []);
        } catch (error: any) {
            console.error("Error fetching subscriptions:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as assinaturas.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async (subscriptionId: string) => {
        setPaymentsLoading(true);
        try {
            const { data, error } = await (supabase as any)
                .from('netcred_payments')
                .select('*')
                .eq('subscription_id', subscriptionId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSelectedPayments(data || []);
            setIsPaymentsOpen(true);
        } catch (error: any) {
            console.error("Error fetching payments:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os pagamentos.",
                variant: "destructive",
            });
        } finally {
            setPaymentsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Ativo</Badge>;
            case 'trialing':
                return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">Trial</Badge>;
            case 'canceled':
            case 'expired':
                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">Cancelado</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0">Pendente</Badge>;
            default:
                return <Badge className="bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border-0">{status || 'Desconhecido'}</Badge>;
        }
    };

    const filteredSubscriptions = subscriptions.filter(sub => {
        const term = searchTerm.toLowerCase();
        return (
            sub.profiles?.email?.toLowerCase().includes(term) ||
            sub.profiles?.full_name?.toLowerCase().includes(term) ||
            sub.profiles?.company_name?.toLowerCase().includes(term) ||
            sub.plan_id?.toLowerCase().includes(term) ||
            sub.workspaces?.name?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-screen flex flex-col bg-[#010816]">
            <Header />
            <main className="flex-grow">
                <AdminAuth onAuthenticated={() => { }}>
                    <div className="container mx-auto p-6 max-w-7xl">
                        <div className="flex justify-between items-center mb-6 mt-8">
                            <div className="flex items-center gap-4">
                                <Link to="/admin-users">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                    <CreditCard className="h-8 w-8 text-primary" />
                                    Gestão de Assinaturas e Pagamentos
                                </h1>
                            </div>
                        </div>

                        <Card className="bg-[#051329] border-white/5 shadow-xl">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl text-white">Assinaturas</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Acompanhe os planos, status e histórico de pagamentos via NetCred.
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                placeholder="Buscar por e-mail, nome, plano..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-64 bg-[#1a2e4c]/20 border-white/10 text-white placeholder:text-gray-600 pl-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : filteredSubscriptions.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        Nenhum registro encontrado.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-black/20 hover:bg-black/20">
                                                <TableRow className="border-white/5">
                                                    <TableHead className="text-gray-400">Cliente</TableHead>
                                                    <TableHead className="text-gray-400">Plano</TableHead>
                                                    <TableHead className="text-gray-400">Workspace</TableHead>
                                                    <TableHead className="text-gray-400">Parcelas</TableHead>
                                                    <TableHead className="text-gray-400">Status</TableHead>
                                                    <TableHead className="text-gray-400">Data de Criação</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredSubscriptions.map((sub) => (
                                                    <TableRow key={sub.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                        <TableCell className="font-medium">
                                                            <div className="text-white">{sub.profiles?.full_name || sub.profiles?.company_name || 'Sem Nome'}</div>
                                                            <div className="text-xs text-gray-500">{sub.profiles?.email}</div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-300">{sub.plan_id}</TableCell>
                                                        <TableCell className="text-gray-300">
                                                            {sub.workspaces?.name ? (
                                                                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                                                                    {sub.workspaces.name}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-gray-600">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-gray-300">{sub.installments || 1}x</TableCell>
                                                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                                        <TableCell className="text-gray-400">
                                                            {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => fetchPayments(sub.id)}
                                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                                                disabled={paymentsLoading}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver Pagamentos
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payments Modal */}
                        <Dialog open={isPaymentsOpen} onOpenChange={setIsPaymentsOpen}>
                            <DialogContent className="bg-[#051329] text-white border-white/10 max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Histórico de Pagamentos (NetCred)
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        Transações registradas via Webhook para esta assinatura.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-4">
                                    {selectedPayments.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Nenhum pagamento registrado para esta assinatura até o momento.
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader className="bg-black/20">
                                                <TableRow className="border-white/5">
                                                    <TableHead className="text-gray-400">Data</TableHead>
                                                    <TableHead className="text-gray-400">ID Externo (NetCred)</TableHead>
                                                    <TableHead className="text-gray-400">Método</TableHead>
                                                    <TableHead className="text-gray-400">Valor</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedPayments.map(payment => (
                                                    <TableRow key={payment.id} className="border-white/5">
                                                        <TableCell className="text-gray-300">
                                                            {new Date(payment.created_at).toLocaleString('pt-BR')}
                                                        </TableCell>
                                                        <TableCell className="text-gray-400 font-mono text-xs">
                                                            {payment.external_id}
                                                        </TableCell>
                                                        <TableCell className="text-gray-300">
                                                            {payment.payment_method || '-'}
                                                        </TableCell>
                                                        <TableCell className="text-white font-medium">
                                                            {payment.amount ? `R$ ${(payment.amount / 100).toFixed(2).replace('.', ',')}` : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {payment.status === 'PAID' ?
                                                                <Badge className="bg-green-500/10 text-green-500 border-0">PAID</Badge> :
                                                                <Badge className="bg-yellow-500/10 text-yellow-500 border-0">{payment.status}</Badge>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </AdminAuth>
            </main>
            <Footer />
        </div>
    );
};

export default AdminSubscriptions;
