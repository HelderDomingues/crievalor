import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ecosystemPlans } from "@/components/pricing/pricingData";
import CheckoutController from "@/components/subscription/CheckoutController";

const PricingSection = () => {
    return (
        <section id="pricing" className="py-24 bg-gradient-to-b from-black via-slate-900 to-black relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary-foreground bg-primary/10 hover:bg-primary/20 transition-colors">
                        Planos e Preços
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                        Escolha o nível de <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">direção</span> que sua empresa precisa
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Estruturas acessíveis projetadas para empresas com faturamento de R$ 150k+ e foco total em crescimento sustentável.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {ecosystemPlans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-slate-800 transition-all duration-500 hover:translate-y-[-8px] group ${plan.popular ? "ring-2 ring-primary shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] scale-105" : "hover:border-slate-700"
                                } relative`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-bold rounded-full shadow-lg z-20">
                                    Mais Recomendado
                                </div>
                            )}

                            <div className="flex-grow">
                                <CardHeader className="text-center pt-10 pb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-extrabold text-white">{plan.monthlyPrice}</span>
                                            <span className="text-slate-500 font-medium">/mês</span>
                                        </div>
                                        <div className="mt-2 text-sm text-slate-500">
                                            Ou {plan.annualPrice} à vista anual
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-colors">
                                                    <Check className="w-3.2 h-3.2 text-primary" />
                                                </div>
                                                <span className="text-sm text-slate-300 leading-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </div>

                            <CardFooter className="pb-10 pt-6 flex flex-col gap-3">
                                {plan.id === 'basico' ? (
                                    <>
                                        <Button
                                            asChild
                                            className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 transition-all duration-300"
                                            onClick={() => {
                                                localStorage.setItem('checkoutIntent', 'trial');
                                                localStorage.setItem('selectedPlanId', plan.id);
                                                localStorage.setItem('checkoutPlanId', plan.id);
                                            }}
                                        >
                                            <Link to={`/auth?plan=${plan.id}`}>
                                                Iniciar Trial Grátis
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full py-6 text-lg font-bold border-primary/20 hover:border-primary/50 text-white transition-all duration-300"
                                            onClick={() => {
                                                localStorage.setItem('checkoutIntent', 'purchase');
                                                localStorage.setItem('selectedPlanId', plan.id);
                                            }}
                                        >
                                            <Link to={`/auth?plan=${plan.id}`}>
                                                Assinar Agora
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        asChild
                                        className={`w-full py-6 text-lg font-bold transition-all duration-300 ${plan.popular
                                            ? "bg-primary hover:bg-primary/90 shadow-glow"
                                            : "bg-slate-800 hover:bg-slate-700 text-white"
                                            }`}
                                        onClick={() => {
                                            localStorage.setItem('checkoutIntent', 'purchase');
                                            localStorage.setItem('selectedPlanId', plan.id);
                                        }}
                                    >
                                        <Link to={`/auth?plan=${plan.id}`}>
                                            {plan.cta}
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 text-sm">
                        Precisa de algo customizado para uma empresa maior?
                        <Link to="/contato" className="text-primary hover:underline ml-1 font-semibold">Fale com nossos consultores sênior.</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
