
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CreditCard, Sparkles, MessageSquare, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const LumiaDashboard: React.FC = () => {
    const { user } = useAuth();
    const { profile } = useProfile();

    const isTrial = (profile as any)?.subscription_status === 'trialing';
    const isPro = (profile as any)?.subscription_status === 'active';
    const hasNoSubscription = !isTrial && !isPro;

    return (
        <div className="min-h-screen flex flex-col bg-[#010816]">
            <Helmet>
                <title>LUMIA Dashboard | Crie Valor</title>
            </Helmet>

            <Header />

            <main className="flex-grow py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Olá, {profile?.full_name?.split(' ')[0] || 'Consultor'}!
                        </h1>
                        <p className="text-gray-400">Bem-vindo à sua central de inteligência LUMIA.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Access Card */}
                        <Card className="md:col-span-2 bg-[#1a2e4c]/20 border-primary/20 backdrop-blur-sm overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-32 h-32 text-primary" />
                            </div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-2xl text-white flex items-center gap-2">
                                    Acessar Sistema LUMIA
                                </CardTitle>
                                <CardDescription className="text-gray-400 text-lg">
                                    Utilize seus consultores especializados para planejar, analisar e executar sua estratégia de negócios.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 pt-4">
                                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
                                    <a href="https://lumia.crievalor.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        Entrar no Ambiente LUMIA
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </Button>
                                <p className="mt-4 text-sm text-gray-500">
                                    Use o mesmo e-mail e senha cadastrados aqui.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Status & Upgrade Card */}
                        <Card className="bg-[#1a2e4c]/10 border-white/5 text-white">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    Sua Assinatura
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-400 text-sm">Status</span>
                                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${isTrial ? 'bg-amber-500/20 text-amber-500' : isPro ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                            {isTrial ? 'Trial Ativo' : isPro ? 'Assinatura Ativa' : 'Sem Plano'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {isTrial ? 'Aproveite 7 dias de acesso completo para testar a potência da nossa IA.' : isPro ? 'Acesso vitalício aos consultores enquanto sua assinatura estiver ativa.' : 'Inicie seu trial gratuito para acessar a inteligência de negócios.'}
                                    </p>
                                </div>

                                {(isTrial || hasNoSubscription) && (
                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                        <p className="text-sm font-semibold text-amber-500">
                                            {hasNoSubscription ? 'Comece Agora' : 'Garanta seu acesso contínuo'}
                                        </p>
                                        <Button asChild variant={hasNoSubscription ? "default" : "outline"} className={`w-full ${hasNoSubscription ? 'bg-primary text-white' : 'border-primary/30 text-primary hover:bg-primary/5'}`}>
                                            <Link to="/planos">{hasNoSubscription ? 'Escolher Plano e Iniciar' : 'Assinar Plano LUMIA'}</Link>
                                        </Button>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/5">
                                    <Button asChild variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white justify-start px-0">
                                        <Link to="/profile" className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Suporte Técnico
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Secondary Navigation */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/dashboard" className="group">
                            <Card className="bg-[#1a2e4c]/5 border-white/5 hover:border-primary/30 transition-all">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">Biblioteca de Materiais</CardTitle>
                                        <CardDescription>Acesse e-books e ferramentas extras</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>

                        <Link to="/planos" className="group">
                            <Card className="bg-[#1a2e4c]/5 border-white/5 hover:border-primary/30 transition-all">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">Planos e Preços</CardTitle>
                                        <CardDescription>Explore os planos e garanta seu acesso</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LumiaDashboard;
