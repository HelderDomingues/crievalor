import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit, Building2, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

const AdminWorkspaces: React.FC = () => {
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Create Workspace State
    const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit Workspace State
    const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
    const [editWorkspaceId, setEditWorkspaceId] = useState<string | null>(null);
    const [editWorkspaceName, setEditWorkspaceName] = useState("");

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            setLoading(true);

            // Fetch workspaces and join with members to get counts and owner info
            const { data, error } = await (supabase as any)
                .from('workspaces')
                .select(`
                    id,
                    name,
                    created_at,
                    profiles:created_by (email, full_name),
                    workspace_members (id, user_id, role, profiles(email, full_name))
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorkspaces(data || []);
        } catch (error: any) {
            console.error("Error fetching workspaces:", error);
            toast({
                title: "Erro ao carregar workspaces",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWorkspace = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o workspace "${name}"? Todos os dados associados serão perdidos.`)) {
            return;
        }

        try {
            // Using standard delete - relies on RLS or admin trigger if needed
            const { error } = await (supabase as any)
                .from('workspaces')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Workspace excluído",
                description: "O workspace foi removido com sucesso.",
            });

            setWorkspaces(workspaces.filter(w => w.id !== id));
        } catch (error: any) {
            console.error("Error deleting workspace:", error);
            toast({
                title: "Erro ao excluir",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("Usuário não autenticado");

            const { error, data } = await (supabase as any)
                .from('workspaces')
                .insert({
                    name: newWorkspaceName,
                    created_by: userData.user.id
                })
                .select();

            if (error) throw error;

            toast({
                title: "Workspace criado",
                description: "O novo workspace foi adicionado.",
            });

            setIsAddWorkspaceOpen(false);
            setNewWorkspaceName("");
            fetchWorkspaces();
        } catch (error: any) {
            console.error("Error creating workspace:", error);
            toast({
                title: "Erro ao criar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (workspace: any) => {
        setEditWorkspaceId(workspace.id);
        setEditWorkspaceName(workspace.name);
        setIsEditWorkspaceOpen(true);
    };

    const handleUpdateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editWorkspaceId) return;
        setIsSubmitting(true);
        try {
            const { error } = await (supabase as any)
                .from('workspaces')
                .update({ name: editWorkspaceName })
                .eq('id', editWorkspaceId);

            if (error) throw error;

            toast({
                title: "Workspace atualizado",
                description: "O nome do workspace foi modificado com sucesso.",
            });

            setIsEditWorkspaceOpen(false);
            fetchWorkspaces();
        } catch (error: any) {
            console.error("Error updating workspace:", error);
            toast({
                title: "Erro ao atualizar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredWorkspaces = workspaces.filter(w =>
        w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#010816]">
            <Header />

            <main className="flex-grow py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <Building2 className="w-8 h-8 mr-3 text-primary" />
                                Workspaces (Empresas)
                            </h1>
                            <p className="text-gray-400">Gerencie as empresas e seus assentos.</p>
                        </div>

                        <div className="flex gap-4">
                            <Input
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 bg-[#1a2e4c]/20 border-white/10 text-white placeholder:text-gray-600"
                            />

                            <Dialog open={isAddWorkspaceOpen} onOpenChange={setIsAddWorkspaceOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Novo Workspace
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1a2e4c] text-white border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Administrar Novo Workspace</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Crie um novo workspace global para uso empresarial.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateWorkspace} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ws_name">Nome da Empresa / Workspace</Label>
                                            <Input
                                                id="ws_name"
                                                value={newWorkspaceName}
                                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsAddWorkspaceOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5">
                                                Cancelar
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                Salvar Workspace
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isEditWorkspaceOpen} onOpenChange={setIsEditWorkspaceOpen}>
                                <DialogContent className="bg-[#1a2e4c] text-white border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Editar Workspace</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Modifique o nome da empresa ou limite configurações.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdateWorkspace} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_ws_name">Nome da Empresa / Workspace</Label>
                                            <Input
                                                id="edit_ws_name"
                                                value={editWorkspaceName}
                                                onChange={(e) => setEditWorkspaceName(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsEditWorkspaceOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5">
                                                Cancelar
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                Atualizar Workspace
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <Card className="bg-[#1a2e4c]/10 border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#1a2e4c]/20">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-gray-400">Nome</TableHead>
                                        <TableHead className="text-gray-400">Criador</TableHead>
                                        <TableHead className="text-gray-400">Membros</TableHead>
                                        <TableHead className="text-gray-400">Criado em</TableHead>
                                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center border-none">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredWorkspaces.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center border-none">
                                                <p className="text-gray-500">Nenhum workspace encontrado.</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredWorkspaces.map((ws) => (
                                            <TableRow key={ws.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell className="font-medium text-white">
                                                    {ws.name}
                                                </TableCell>
                                                <TableCell className="text-gray-300">
                                                    {ws.profiles?.email || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-gray-400">
                                                        <Users className="w-4 h-4 mr-1 text-primary" />
                                                        {ws.workspace_members?.length || 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-400 text-sm">
                                                    {formatDate(ws.created_at)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditModal(ws)}
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                                            title="Editar Nome do Workspace"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteWorkspace(ws.id, ws.name)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminWorkspaces;
