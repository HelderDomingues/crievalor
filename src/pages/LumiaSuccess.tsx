
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Rocket, LogIn, ShoppingBag, Mail, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const LumiaSuccess = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Helmet>
                <title>Sucesso no Cadastro | Ecossistema LUMIA</title>
            </Helmet>

            <Header />

            <main className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6 border border-primary/30">
                            <CheckCircle className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            Seu período de teste <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                                LUMIA começou!
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-xl mx-auto">
                            Parabéns! Você acaba de dar o primeiro passo para profissionalizar sua gestão com Inteligência Organizacional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Mail className="w-5 h-5 text-primary" />
                                    Verifique seu Email
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Enviamos um email de boas-vindas com o seu guia inicial. Se não encontrar, verifique a caixa de spam ou promoções.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Rocket className="w-5 h-5 text-primary" />
                                    7 Dias de Acesso total
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Você tem acesso completo aos 6 consultores virtuais e às ferramentas de planejamento estratégico durante seu trial.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 rounded-2xl border border-primary/20 text-center mb-12">
                        <h3 className="text-2xl font-bold mb-4">O que deseja fazer agora?</h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8">
                                <Link to="/dashboard" className="flex items-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    Iniciar Teste Grátis
                                </Link>
                            </Button>

                            <Button asChild size="lg" variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white font-bold py-6 px-8">
                                <Link to="/planos" className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Comprar Plano Pro
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-sm mb-6">
                            Precisa de ajuda para começar? Nossa equipe está à disposição.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a
                                href="https://wa.me/5567992150289"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline font-medium"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Suporte via WhatsApp
                            </a>

                            <a
                                href="mailto:helder@crievalor.com.br"
                                className="flex items-center gap-2 text-primary hover:underline font-medium"
                            >
                                <Mail className="w-5 h-5" />
                                helder@crievalor.com.br
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LumiaSuccess;
