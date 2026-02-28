
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CheckoutController from "@/components/subscription/CheckoutController";
import { useAuth } from "@/context/AuthContext";

const PLANS_DATA = {
    basico: {
        name: "LUMIA Básico",
        price: 560,
        installments: 12,
        description: "Planejamento Estratégico Acelerado",
        features: [
            "1 Usuário Principal",
            "6 Consultores Virtuais (IA)",
            "Análise de Propósito Organizacional",
            "Planejamento em 4 Passos",
            "Biblioteca de Materiais MAR"
        ],
        color: "from-blue-500/20 to-blue-600/20",
        border: "border-blue-500/30",
        text: "text-blue-400"
    },
    intermediario: {
        name: "LUMIA Intermediário",
        price: 740,
        installments: 12,
        description: "Planejamento + Implementação Assistida",
        features: [
            "Até 3 Usuários",
            "Reuniões Quinzenais de Acompanhamento",
            "Suporte Prioritário",
            "Tudo do Plano Básico"
        ],
        color: "from-primary/20 to-purple-600/20",
        border: "border-primary/30",
        text: "text-primary"
    },
    avancado: {
        name: "LUMIA Avançado",
        price: 810,
        installments: 12,
        description: "Consultoria Estratégica Completa",
        features: [
            "Usuários Ilimitados",
            "Reuniões Semanais de Estratégia",
            "Consultoria de Processos",
            "Tudo do Plano Intermediário"
        ],
        color: "from-amber-500/20 to-orange-600/20",
        border: "border-amber-500/30",
        text: "text-amber-400"
    }
};

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useAuth();
    const planId = searchParams.get('plan') || localStorage.getItem('checkoutPlanId') || 'basico';
    const plan = PLANS_DATA[planId as keyof typeof PLANS_DATA] || PLANS_DATA.basico;
    const isTrial = localStorage.getItem('checkoutIntent') === 'trial';

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!authLoading && !user) {
            navigate(`/auth?plan=${planId}`);
        }
    }, [user, authLoading, navigate, planId]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black selection:bg-primary/20">
            <Helmet>
                <title>Finalizar Assinatura | Ecossistema LUMIA</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Header />

            <main className="flex-grow py-20 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="flex flex-col md:flex-row gap-12">

                        {/* Left Column: Plan Summary */}
                        <div className="flex-grow space-y-8 animate-in fade-in slide-in-from-left duration-700">
                            <div>
                                <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 uppercase tracking-wider px-3 py-1 text-[10px] font-bold">
                                    {isTrial ? "Experimente Agora" : "Finalizar Pedido"}
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                                    {isTrial ? "Inicie seu teste grátis" : "Você está a um passo do seu novo patamar."}
                                </h1>
                                <p className="text-slate-400 text-lg max-w-xl">
                                    {isTrial
                                        ? "Acesse todas as ferramentas de inteligência do LUMIA por 7 dias sem custos."
                                        : "Transforme sua gestão com inteligência artificial e acompanhamento estratégico especializado."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                                    <ShieldCheck className="w-6 h-6 text-green-400 mb-3" />
                                    <h3 className="font-semibold text-white mb-1 text-sm">Ambiente Seguro</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Seus dados e transações são protegidos por criptografia de ponta.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                                    <Zap className="w-6 h-6 text-amber-400 mb-3" />
                                    <h3 className="font-semibold text-white mb-1 text-sm">Acesso Imediato</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">A liberação do sistema LUMIA ocorre logo após a confirmação.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Benefícios Incluídos
                                </h4>
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Checkout Card */}
                        <div className="w-full md:w-[400px] flex-shrink-0 animate-in fade-in slide-in-from-right duration-700">
                            <Card className={`border-2 ${plan.border} bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50`} />

                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                                    <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="p-6 rounded-xl bg-black/40 border border-white/5 text-center">
                                        {isTrial ? (
                                            <div>
                                                <div className="text-4xl font-bold text-white mb-1 italic">Grátis</div>
                                                <div className="text-slate-500 text-sm">por 7 dias</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-slate-500 text-xs mb-1 uppercase tracking-widest">Investimento</div>
                                                <div className="flex items-baseline justify-center gap-2">
                                                    <span className="text-lg text-slate-400">R$</span>
                                                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                                                    <span className="text-slate-400">/mês</span>
                                                </div>
                                                <div className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest leading-relaxed">Cobrado semestralmente via NetCred</div>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <CheckoutController
                                            planId={planId}
                                            installments={1}
                                            paymentType="credit"
                                            buttonText={isTrial ? "Iniciar Trial Grátis" : "Confirmar e Pagar"}
                                            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-primary hover:bg-primary/90 text-white"
                                        />

                                        <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed">
                                            Ao clicar no botão acima, você concorda com nossos <br />
                                            <a href="/termos-de-servico" className="text-slate-400 underline italic">Termos de Uso</a> e <a href="/politica-de-privacidade" className="text-slate-400 underline italic">Privacidade</a>.
                                        </p>
                                    </div>

                                    {!isTrial && (
                                        <div className="pt-4 border-t border-white/5 text-center">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 opacity-50">Pagamento Processado via NetCred</p>
                                            <div className="flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                                <span className="text-[10px] font-bold text-white tracking-widest">VISA</span>
                                                <span className="text-[10px] font-bold text-white tracking-widest">MASTERCARD</span>
                                                <span className="text-[10px] font-bold text-white tracking-widest">PIX</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="mt-6 flex flex-col gap-4 text-center">
                                <button
                                    onClick={() => navigate('/planos')}
                                    className="text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm group"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                    Mudar meu plano
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
