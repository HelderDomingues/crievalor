
import React from 'react';
import { BrainCircuit, FileSpreadsheet, XCircle, CheckCircle2 } from 'lucide-react';

export const PainEducation = () => {
    return (
        <section className="py-24 bg-[#010816] relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#010816] via-[#0f172a] to-[#010816]" />

            <div className="container px-4 mx-auto relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Planilhas te dão dados. <br />
                        <span className="text-violet-400">O MAR te dá respostas.</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        A maioria dos softwares exige que VOCÊ interprete os gráficos e decida.
                        Nós usamos <strong>IA de Raciocínio (Generative Reasoning)</strong> para ler o cenário e traçar o caminho por você.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* The Old Way */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 mb-6 text-slate-400">
                            <FileSpreadsheet size={32} />
                            <h3 className="text-xl font-semibold">Sistemas Tradicionais</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <XCircle className="text-red-500/50 mt-1 shrink-0" size={18} />
                                <span className="text-slate-400">Mostram gráficos mudos que não dizem "o porquê".</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <XCircle className="text-red-500/50 mt-1 shrink-0" size={18} />
                                <span className="text-slate-400">Exigem horas de análise humana para achar insights.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <XCircle className="text-red-500/50 mt-1 shrink-0" size={18} />
                                <span className="text-slate-400">Focam apenas no passado (retrovisor).</span>
                            </li>
                        </ul>
                    </div>

                    {/* The MAR Way */}
                    <div className="bg-gradient-to-br from-violet-900/10 to-slate-900 border border-violet-500/30 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Inteligência Real
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-6 text-white">
                            <BrainCircuit size={32} className="text-violet-400" />
                            <h3 className="text-xl font-semibold">Sistema MAR</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={18} />
                                <span className="text-slate-200">Lê os dados e explica a <strong>causa raiz</strong> do problema.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={18} />
                                <span className="text-slate-200">Gera planos de ação automáticos baseados no diagnóstico.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={18} />
                                <span className="text-slate-200">Olha para o futuro com projeções estratégicas.</span>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </section>
    );
};
