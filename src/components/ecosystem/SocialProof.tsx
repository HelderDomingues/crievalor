
import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "O faturávamos entre 600 e 800 mil sem previsibilidade. Em um ano de MAR, crescemos 30% e ultrapassamos a casa do milhão com consistência.",
        author: "Carlos Jose",
        role: "CEO, Primeira Linha Acabamentos",
        metric: "+30% Crescimento"
    },
    {
        quote: "O MAR foi essencial para mudar minha empresa!! Consegui organizar processos, reduzir custos e aumentar a eficiência operacional. A ferramenta me ajudou a ter uma visão clara do negócio.",
        author: "Edilson Lima",
        role: "Proprietário, Loged Consultoria",
        metric: "Visão Operacional Clara"
    },
    {
        quote: "O MAR foi essencial para o crescimento do meu escritório. O resultado foi um aumento na lucratividade e uma expansão consistente da carteira de clientes. Aliado indispensável!",
        author: "Debora Celine",
        role: "Proprietária, Expresso Contabilidade",
        metric: "Expansão de Carteira"
    }
];

export const SocialProof = () => {
    return (
        <section className="py-20 bg-[#010816] border-y border-white/5">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Líderes que já escalaram com inteligência</h2>
                    <p className="text-slate-400">Junte-se a fundadores que trocaram a intuição por dados.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative hover:border-violet-500/30 transition-colors group">
                            <Quote className="absolute top-6 right-6 text-slate-800 w-8 h-8 group-hover:text-violet-900/50 transition-colors" />
                            <p className="text-slate-300 italic mb-6 relative z-10">"{t.quote}"</p>
                            <div>
                                <div className="font-semibold text-white">{t.author}</div>
                                <div className="text-xs text-slate-500 mb-2">{t.role}</div>
                                <div className="inline-block px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                    {t.metric}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
