import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, ShieldAlert, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Seat limits per plan
const getSeatLimit = (planId: string | null) => {
    if (planId === 'avancado') return 5;
    if (planId === 'intermediario') return 3;
    return 1; // basico or trial
};

interface WorkspaceMember {
    id: string;
    user_id: string;
    role: string;
    profiles: {
        email: string;
        full_name: string | null;
    }
}

export default function WorkspaceSettings() {
    const { user } = useAuth();
    const { profile } = useProfile();
    const [workspace, setWorkspace] = useState<any>(null);
    const [members, setMembers] = useState<WorkspaceMember[]>([]);
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user && profile?.role === 'company_admin') {
            fetchWorkspaceData();
        }
    }, [user, profile]);

    const fetchWorkspaceData = async () => {
        try {
            setLoading(true);
            setError('');

            // 1. Get workspace where user is owner
            const { data: wsData, error: wsError } = await supabase
                .from('workspaces')
                .select('*')
                .eq('owner_id', user?.id)
                .single();

            if (wsError) throw wsError;
            setWorkspace(wsData);

            if (wsData) {
                // 2. Get members
                const { data: membersData, error: mbError } = await supabase
                    .from('workspace_members')
                    .select('*, profiles(email, full_name)')
                    .eq('workspace_id', wsData.id);

                if (mbError) throw mbError;
                setMembers(membersData as any);

                // 3. Get active subscription to know the limit
                const { data: subData, error: subError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('workspace_id', wsData.id)
                    .in('status', ['active', 'trialing'])
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (subError && subError.code !== 'PGRST116') {
                    console.warn(subError);
                } else {
                    setSubscription(subData);
                }
            }
        } catch (err: any) {
            console.error(err);
            setError('Erro ao carregar dados do workspace.');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setInviteLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!workspace) throw new Error("Workspace não encontrado.");

            const functionUrl = import.meta.env.VITE_API_URL || '/.netlify/functions';
            const token = (await supabase.auth.getSession()).data.session?.access_token;

            const res = await fetch(`${functionUrl}/invite-workspace-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: inviteEmail,
                    workspaceId: workspace.id
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erro ao enviar convite');
            }

            setSuccess('Convite enviado com sucesso! O novo membro receberá as instruções por e-mail.');
            setInviteEmail('');
            fetchWorkspaceData(); // Refresh list

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro.');
        } finally {
            setInviteLoading(false);
        }
    };

    if (!user || profile?.role !== 'company_admin') {
        return (
            <div className="container mx-auto p-6 flex justify-center items-center h-64">
                <div className="text-center">
                    <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Acesso Negado</h2>
                    <p className="text-muted-foreground mt-2">Apenas Administradores do Workspace podem acessar esta página.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="container mx-auto p-12 text-center text-muted-foreground">Carregando painel do workspace...</div>;
    }

    const seatLimit = getSeatLimit(subscription?.plan_id);
    const seatsUsed = members.length;
    const canInvite = seatsUsed < seatLimit;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Workspace: {workspace?.name}</h1>
                    <p className="text-slate-400">Gerencie sua equipe e os acessos corporativos da sua empresa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-400">Plano Atual</CardDescription>
                        <CardTitle className="text-2xl text-white">
                            {subscription ? subscription.plan_id.toUpperCase() : 'FREE'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={subscription?.status === 'active' ? "default" : "secondary"} className="mt-1">
                            {subscription?.status || 'Sem assinatura'}
                        </Badge>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-400">Assentos Utilizados</CardDescription>
                        <CardTitle className="text-2xl text-white">
                            {seatsUsed} de {seatLimit}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2">
                            <div
                                className={`bg-indigo-500 h-2.5 rounded-full`}
                                style={{ width: `${Math.min((seatsUsed / seatLimit) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="flex flex-row justify-between items-center bg-slate-900/50 border-b border-slate-800 px-6 py-4">
                    <div>
                        <CardTitle className="text-white">Membros da Equipe</CardTitle>
                        <CardDescription className="text-slate-400">Pessoas com acesso ativo ao seu Workspace.</CardDescription>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button disabled={!canInvite} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Membro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800">
                            <DialogHeader>
                                <DialogTitle className="text-white">Convidar para a equipe</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Enviaremos um email de convite com uma senha temporária. Eles já ocuparão 1 assento instantaneamente.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleInvite}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right text-slate-300">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="col-span-3 bg-slate-950 border-slate-800 text-white"
                                            placeholder="colega@empresa.com.br"
                                        />
                                    </div>
                                </div>
                                {error && <div className="text-red-400 text-sm pb-4">{error}</div>}
                                <DialogFooter>
                                    <Button type="submit" disabled={inviteLoading || !canInvite} className="bg-indigo-600 text-white">
                                        {inviteLoading ? 'Enviando...' : 'Enviar Convite'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="p-0">
                    {!canInvite && (
                        <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-4 text-yellow-200 text-sm flex items-center">
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Você atingiu o limite de {seatLimit} assentos do seu plano. Para convidar mais pessoas, faça upgrade do plano ou nos chame no WhatsApp.
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border-b border-green-500/20 p-4 text-green-400 text-sm flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {success}
                        </div>
                    )}

                    <Table>
                        <TableHeader className="bg-slate-950">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Usuário / Email</TableHead>
                                <TableHead className="text-slate-400">Função</TableHead>
                                <TableHead className="text-slate-400 text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="font-medium text-white flex items-center">
                                        <div className="flex flex-col">
                                            <span>{member.profiles?.full_name || 'Sem nome'}</span>
                                            <span className="text-slate-500 text-xs flex items-center mt-1">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {member.profiles?.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {member.role === 'admin' ? (
                                            <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0">Company Admin</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-300 border-slate-700">Membro</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* Placeholder for future delete member feature */}
                                        {member.user_id !== user.id && (
                                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
