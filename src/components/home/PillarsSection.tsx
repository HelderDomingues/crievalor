import React from "react";
import { Package, Briefcase, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PillarsSection = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-purple-500/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary-foreground bg-primary/10">
                        O Que Fazemos
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                        Três Pilares de <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Atuação</span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Uma estrutura completa para sustentar o crescimento da sua empresa em todas as frentes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Pillar 1: Produtos */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="relative h-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-primary/50 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Package className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Produtos</h3>
                            <div className="w-12 h-1 bg-primary/50 rounded-full mb-6" />
                            <p className="text-slate-300 leading-relaxed">
                                <strong className="text-white">Ecossistema LUMIA</strong>
                                <br />
                                MAR, Lumia e Mentor de Propósito integrados para máxima inteligência.
                            </p>
                        </div>
                    </div>

                    {/* Pillar 2: Serviços */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="relative h-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-purple-500/50 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <Briefcase className="h-10 w-10 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Serviços</h3>
                            <div className="w-12 h-1 bg-purple-500/50 rounded-full mb-6" />
                            <p className="text-slate-300 leading-relaxed">
                                <strong className="text-white">Implementação Assistida</strong>
                                <br />
                                Consultoria híbrida e Projetos Customizados para execução precisa.
                            </p>
                        </div>
                    </div>

                    {/* Pillar 3: Educação */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="relative h-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-emerald-500/50 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                <GraduationCap className="h-10 w-10 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Educação</h3>
                            <div className="w-12 h-1 bg-emerald-500/50 rounded-full mb-6" />
                            <p className="text-slate-300 leading-relaxed">
                                <strong className="text-white">Oficina de Líderes</strong>
                                <br />
                                Treinamentos e Palestras corporativas para desenvolvimento de times.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PillarsSection;
