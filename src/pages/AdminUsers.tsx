
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, User as UserIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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
                            <p className="text-gray-400">Gerencie permissões e papéis dos usuários da plataforma.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Buscar por nome, email ou login..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-[#1a2e4c]/20 border-white/10 text-white placeholder:text-gray-600"
                            />
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
                                        <TableHead className="text-gray-400">Cadastro</TableHead>
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
                                                    <Select
                                                        defaultValue={user.role || 'user'}
                                                        onValueChange={(val) => handleUpdateRole(user.id, val)}
                                                    >
                                                        <SelectTrigger className="w-32 bg-[#010816]/50 border-white/10 text-white ml-auto">
                                                            <SelectValue placeholder="Papel" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#1a2e4c] border-white/10 text-white">
                                                            <SelectItem value="user">Usuário</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="owner">Owner</SelectItem>
                                                        </SelectContent>
                                                    </Select>
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

export default AdminUsers;
