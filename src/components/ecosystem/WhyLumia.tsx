
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Target, ShieldCheck } from 'lucide-react';

export const WhyLumia = () => {
    return (
        <section className="py-24 bg-[#010816] border-y border-white/5">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Por que este é o momento certo para o <span className="text-violet-400">LUMIA</span>?
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                No mercado atual, a velocidade da informação superou a capacidade humana de processamento.
                                Ter dados não é mais um diferencial; saber o que fazer com eles é.
                            </p>

                            <div className="space-y-6 mb-10">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center shrink-0">
                                        <Target className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Clareza vs. Complexidade</h4>
                                        <p className="text-sm text-slate-500">Eliminamos o barulho e focamos no que move o ponteiro do faturamento.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Infraestrutura Blindada</h4>
                                        <p className="text-sm text-slate-500">Uma base estratégica que não depende de "achismos" ou de um consultor específico.</p>
                                    </div>
                                </div>
                            </div>

                            <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700 text-white border-0 h-12 px-8">
                                <Link to="/planos">Expandir minha Inteligência</Link>
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent blur-3xl -z-10" />
                            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingUp className="w-4 h-4 text-violet-400" />
                                            <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">A Solução para o ICP</span>
                                        </div>
                                        <p className="text-sm text-slate-300 italic">
                                            "Enquanto outros softwares te entregam gráficos para interpretar, o LUMIA te entrega o próximo passo executável."
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-white font-bold text-xl">A escolha dos Builders</h3>
                                        <p className="text-sm text-slate-400">
                                            LUMIA foi desenhado para donos de negócio que não têm tempo a perder.
                                            É a transição da consultoria artesanal para a inteligência escalável.
                                        </p>
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs text-slate-500">Pronto para implementação imediata</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
