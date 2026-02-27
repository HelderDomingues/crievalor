
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { useToast } from "@/hooks/use-toast";
import MaterialCard from "@/components/materials/MaterialCard";
import MaterialFilters from "@/components/materials/MaterialFilters";
import MaterialSkeleton from "@/components/materials/MaterialSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User as UserIcon, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Material } from "@/pages/MaterialExclusivo";

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const { profile, isAdmin, isLoading: profileLoading } = useProfile();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
    const [activeFilter, setActiveFilter] = useState("todos");

    useEffect(() => {
        // Simple paywall/status check
        if (profile && !profileLoading) {
            const userProfile = profile as any;
            const status = userProfile.subscription_status?.toLowerCase();
            if (status === 'past_due' || status === 'payment_required') {
                navigate('/subscription?expired=true');
            }
        }
        fetchMaterials();
    }, [activeFilter, profile, profileLoading]);

    const fetchMaterials = async () => {
        try {
            setIsLoadingMaterials(true);
            let query = supabaseExtended
                .from('materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (activeFilter !== "todos") {
                query = query.eq('category', activeFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setMaterials(data || []);
        } catch (error) {
            console.error("Error fetching materials:", error);
            toast({
                title: "Erro ao carregar materiais",
                description: "Não foi possível carregar os materiais exclusivos.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingMaterials(false);
        }
    };

    const handleAccessMaterial = async (materialId: string) => {
        try {
            await supabaseExtended
                .from('material_accesses')
                .insert([{ material_id: materialId, user_id: user?.id }]);

            await supabaseExtended.rpc('increment_material_access_count', { material_id: materialId });

            const { data } = await supabaseExtended
                .from('materials')
                .select('file_url')
                .eq('id', materialId)
                .single();

            if (data?.file_url) {
                window.open(data.file_url, '_blank');
            }
        } catch (error) {
            console.error("Error accessing material:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#010816]">
            <Helmet>
                <title>Dashboard | Crie Valor</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Header />

            <main className="flex-grow py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                                <AvatarImage src={profile?.avatar_url || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}!
                                </h1>
                                <p className="text-gray-400">Bem-vindo à sua área exclusiva.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {isAdmin && (
                                <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                    <Link to="/admin-setup">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Painel Admin
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                <Link to="/profile">
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Meu Perfil
                                </Link>
                            </Button>
                            <Button onClick={() => signOut()} variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar / Profile Summary */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="bg-[#1a2e4c]/20 border-white/5 text-white">
                                <CardHeader>
                                    <CardTitle className="text-lg">Sua Conta</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                                        <p className="text-sm truncate">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Papel</p>
                                        <p className="text-sm capitalize">{profile?.role || 'Membro'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content - Materials */}
                        <div className="lg:col-span-3">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <BookOpen className="w-6 h-6 mr-2 text-primary" />
                                    Materiais Exclusivos
                                </h2>
                                <MaterialFilters
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                />
                            </div>

                            {isLoadingMaterials ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4].map(i => <MaterialSkeleton key={i} />)}
                                </div>
                            ) : materials.length === 0 ? (
                                <Card className="bg-[#1a2e4c]/10 border-dashed border-white/10 text-center py-12">
                                    <CardContent>
                                        <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">Nenhum material encontrado nesta categoria.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {materials.map((material) => (
                                        <MaterialCard
                                            key={material.id}
                                            material={material}
                                            onAccess={() => handleAccessMaterial(material.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
