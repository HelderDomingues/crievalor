
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GuaranteeSection = () => {
    return (
        <section className="py-20 bg-[#0f172a]/30 border-y border-slate-800">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-amber-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">

                    {/* Gold Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="shrink-0 relative">
                        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/30 text-amber-500">
                            <ShieldCheck size={48} />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Controle Total do <span className="text-amber-500">Seu Resultado</span>
                        </h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            No LUMIA, o progresso é medido pela aprovação de cada etapa. <br className="hidden md:block" />
                            Você só avança quando estiver satisfeito com a clareza gerada, garantindo uma jornada estratégica 100% alinhada aos seus objetivos.
                        </p>
                        <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 rounded-full">
                            Personalizar meu fluxo
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};
