import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, UserCheck, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EcosystemHighlight = () => {
    return (
        <section id="ecosystem-flow" className="py-24 bg-black relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary-foreground bg-primary/5">
                        O Ecossistema
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                        Um sistema completo de <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Inteligência Organizacional</span>
                    </h2>
                    <p className="text-lg text-slate-400">
                        Você não está apenas contratando uma ferramenta, mas implementando uma infraestrutura de crescimento controlada por você.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 pointer-events-none" />

                    {/* Stepper Logic */}
                    <div className="relative group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-all duration-500 shadow-2xl relative">
                                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/20 transition-all" />
                                <UserCheck className="w-10 h-10 text-primary relative z-10" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Você no Controle</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Você preenche o diagnóstico e aprova cada etapa. Nada acontece sem o seu aval e direção estratégica.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-blue-400/50 transition-all duration-500 shadow-2xl relative">
                                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl group-hover:bg-blue-500/20 transition-all" />
                                <Zap className="w-10 h-10 text-blue-400 relative z-10" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Motor de Inteligência</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                O MAR analisa dados, identifica gargalos e propõe estratégias em tempo real, servindo como seu cérebro de consultoria reserva.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-purple-400/50 transition-all duration-500 shadow-2xl relative">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-xl group-hover:bg-purple-500/20 transition-all" />
                                <Globe className="w-10 h-10 text-purple-400 relative z-10" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">3</div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Execução com Especialistas</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Seus especialistas virtuais (Vendas, Gestão, etc) recebem o contexto e ajudam a implementar as ações no dia a dia.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex justify-center">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-glow group">
                        <Link to="/contato">
                            Quero implementar em minha empresa
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default EcosystemHighlight;
