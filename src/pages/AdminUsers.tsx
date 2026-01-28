
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseExtended } from "@/integrations/supabase/extendedClient"; // Use extended client for functions
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, User as UserIcon, Loader2, Plus, Trash2, Edit, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserProductsManager } from "@/components/admin/UserProductsManager";

interface UserWithProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    username: string | null;
    role: string | null;
    updated_at: string;
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<UserWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Add User State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserFullName, setNewUserFullName] = useState("");
    const [newUserUsername, setNewUserUsername] = useState("");

    // Edit User State
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);

    // Product Manager State
    const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
    const [selectedUserForProducts, setSelectedUserForProducts] = useState<UserWithProfile | null>(null);

    // User fields state for both Add and Edit
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState(""); // Optional for edit
    const [editFullName, setEditFullName] = useState("");
    const [editUsername, setEditUsername] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .order('updated_at', { ascending: false });

            if (profileError) throw profileError;

            // Ensure data matches UserWithProfile interface
            const validatedUsers: UserWithProfile[] = (profiles || []).map((p: any) => ({
                id: p.id,
                email: p.email,
                full_name: p.full_name,
                username: p.username,
                role: p.role,
                updated_at: p.updated_at || new Date().toISOString()
            }));

            setUsers(validatedUsers);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            toast({
                title: "Erro ao carregar usuários",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (profileError) throw profileError;

            if (newRole === 'admin' || newRole === 'owner') {
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id, role' });

                if (roleError) console.error("Error updating user_roles:", roleError);
            } else {
                await supabase
                    .from('user_roles')
                    .delete()
                    .eq('user_id', userId)
                    .in('role', ['admin', 'owner']);
            }

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

            toast({
                title: "Papel atualizado",
                description: `O usuário agora é ${newRole}.`,
            });
        } catch (error: any) {
            console.error("Error updating role:", error);
            toast({
                title: "Erro ao atualizar papel",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data, error } = await supabaseExtended.functions.invoke('admin-action', {
                body: {
                    action: 'createUser',
                    email: newUserEmail,
                    password: newUserPassword,
                    userData: {
                        full_name: newUserFullName,
                        username: newUserUsername
                    }
                }
            });

            if (error) throw new Error(error.message || 'Erro ao criar usuário');
            if (data?.error) throw new Error(data.error);

            toast({
                title: "Usuário criado com sucesso",
                description: `O usuário ${newUserEmail} foi adicionado.`,
            });

            setIsAddUserOpen(false);
            setNewUserEmail("");
            setNewUserPassword("");
            setNewUserFullName("");
            setNewUserUsername("");
            fetchUsers(); // Refresh list immediately

        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({
                title: "Erro ao criar usuário",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prepare modal for editing
    const openEditModal = (user: UserWithProfile) => {
        setEditUserId(user.id);
        setEditEmail(user.email || "");
        setEditFullName(user.full_name || "");
        setEditUsername(user.username || "");
        setEditPassword(""); // Reset password field
        setIsEditUserOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUserId) return;

        setIsSubmitting(true);

        try {
            // 1. Update Authentication Data (Email/Password) via Edge Function
            const { data, error } = await supabaseExtended.functions.invoke('admin-action', {
                body: {
                    action: 'updateUser',
                    userId: editUserId,
                    email: editEmail,
                    password: editPassword || undefined, // Only send if not empty
                    userData: {
                        // We also update metadata in auth for consistency
                        full_name: editFullName,
                        username: editUsername
                    }
                }
            });

            if (error) throw new Error(error.message || 'Erro ao atualizar dados de autenticação');
            if (data?.error) throw new Error(data.error);

            // 2. Update Profile Data (Name/Username) directly in profiles table
            // Since we are admin, RLS allows this now.
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: editFullName,
                    username: editUsername,
                    // We don't update email in profiles yet as it might not be confirmed, 
                    // but usually triggers handle this. For now let's update it for UI consistency if simple.
                    email: editEmail
                })
                .eq('id', editUserId);

            if (profileError) throw new Error(profileError.message || 'Erro ao atualizar perfil');

            toast({
                title: "Usuário atualizado",
                description: "Os dados foram atualizados com sucesso.",
            });

            setIsEditUserOpen(false);
            fetchUsers(); // Refresh list

        } catch (error: any) {
            console.error("Error updating user:", error);
            toast({
                title: "Erro ao atualizar usuário",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string, email: string | null) => {
        if (!confirm(`Tem certeza que deseja excluir o usuário ${email}? Esta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            const { data, error } = await supabaseExtended.functions.invoke('admin-action', {
                body: {
                    action: 'deleteUser',
                    userId: userId
                }
            });

            if (error) throw new Error(error.message || 'Erro ao excluir usuário');
            if (data?.error) throw new Error(data.error);

            toast({
                title: "Usuário excluído",
                description: "O usuário foi removido do sistema.",
            });

            // Optimistic update
            setUsers(users.filter(u => u.id !== userId));

        } catch (error: any) {
            console.error("Error deleting user:", error);
            toast({
                title: "Erro ao excluir usuário",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const openProductManager = (user: UserWithProfile) => {
        setSelectedUserForProducts(user);
        setIsProductManagerOpen(true);
    };


    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#010816]">
            <Header />

            <main className="flex-grow py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <Shield className="w-8 h-8 mr-3 text-primary" />
                                Gerenciamento de Usuários
                            </h1>
                            <p className="text-gray-400">Gerencie permissões e usuários da plataforma.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Add User Dialog */}
                            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Novo Usuário
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1a2e4c] text-white border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Crie uma nova conta de acesso. O usuário receberá um email de confirmação se configurado.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="full_name">Nome Completo</Label>
                                            <Input
                                                id="full_name"
                                                value={newUserFullName}
                                                onChange={(e) => setNewUserFullName(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Usuário (Username)</Label>
                                            <Input
                                                id="username"
                                                value={newUserUsername}
                                                onChange={(e) => setNewUserUsername(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={newUserEmail}
                                                onChange={(e) => setNewUserEmail(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Senha</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={newUserPassword}
                                                onChange={(e) => setNewUserPassword(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5">
                                                Cancelar
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                Criar Usuário
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* Edit User Dialog */}
                            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                                <DialogContent className="bg-[#1a2e4c] text-white border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Editar Usuário</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Atualize os dados cadastrais e de acesso do usuário.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_full_name">Nome Completo</Label>
                                            <Input
                                                id="edit_full_name"
                                                value={editFullName}
                                                onChange={(e) => setEditFullName(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_username">Usuário (Username)</Label>
                                            <Input
                                                id="edit_username"
                                                value={editUsername}
                                                onChange={(e) => setEditUsername(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_email">Email</Label>
                                            <Input
                                                id="edit_email"
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_password">Nova Senha (opcional)</Label>
                                            <Input
                                                id="edit_password"
                                                type="password"
                                                placeholder="Deixe em branco para não alterar"
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                className="bg-[#010816] border-white/10 text-white"
                                                minLength={6}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsEditUserOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5">
                                                Cancelar
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                Salvar Alterações
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-[#1a2e4c]/20 border-white/10 text-white placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <Card className="bg-[#1a2e4c]/10 border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#1a2e4c]/20">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-gray-400">Usuário</TableHead>
                                        <TableHead className="text-gray-400">Login / Email</TableHead>
                                        <TableHead className="text-gray-400">Papel</TableHead>
                                        <TableHead className="text-gray-400">Atualizado em</TableHead>
                                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center border-none">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                                                <p className="text-gray-500">Carregando usuários...</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center border-none">
                                                <UserIcon className="w-12 h-12 mx-auto text-gray-700 mb-2" />
                                                <p className="text-gray-500">Nenhum usuário encontrado.</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-white font-medium">{user.full_name || 'Sem nome'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-300">@{user.username || 'n/a'}</span>
                                                        <span className="text-xs text-gray-500">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${user.role === 'owner' ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' :
                                                            user.role === 'admin' ? 'bg-primary/20 text-primary border-primary/20' :
                                                                'bg-gray-500/20 text-gray-400 border-gray-500/20'
                                                            } capitalize border-0`}
                                                    >
                                                        {user.role || 'user'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-400 text-sm">
                                                    {formatDate(user.updated_at)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Select
                                                            defaultValue={user.role || 'user'}
                                                            onValueChange={(val) => handleUpdateRole(user.id, val)}
                                                        >
                                                            <SelectTrigger className="w-28 bg-[#010816]/50 border-white/10 text-white h-8 text-xs">
                                                                <SelectValue placeholder="Papel" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-[#1a2e4c] border-white/10 text-white">
                                                                <SelectItem value="user">Usuário</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="owner">Owner</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                                            onClick={() => openProductManager(user)}
                                                            title="Gerenciar produtos"
                                                        >
                                                            <Package className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                                            onClick={() => openEditModal(user)}
                                                            title="Editar usuário"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                                            title="Excluir usuário"
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
                    {/* User Product Manager Dialog */}
                    <Dialog open={isProductManagerOpen} onOpenChange={setIsProductManagerOpen}>
                        <DialogContent className="max-w-4xl bg-[#1a2e4c] text-white border-white/10 overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>Gerenciar Produtos - {selectedUserForProducts?.full_name}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Visualize e gerencie os acessos deste usuário aos produtos.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedUserForProducts && (
                                <UserProductsManager
                                    userId={selectedUserForProducts.id}
                                    userName={selectedUserForProducts.full_name || selectedUserForProducts.email || ""}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminUsers;
