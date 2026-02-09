
import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const QueroDemonstracao = () => {
    const whatsappLink = "https://wa.me/5567996542991?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20sistema%20LUMIA.";

    return (
        <section className="py-24 bg-[#010816] relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/50 to-indigo-950/30 border border-white/5 rounded-[2.5rem] p-12 md:p-16 text-center backdrop-blur-sm">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
                        <MessageSquare size={16} /> Experimente o Futuro
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Quer ver o poder do LUMIA <br className="hidden md:block" />
                        <span className="text-indigo-400">na prática?</span>
                    </h2>

                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Agende uma demonstração personalizada e descubra como nossa Infraestrutura de Inteligência Estratégica transforma a complexidade do seu negócio em um plano de ação impecável.
                    </p>

                    <Button
                        asChild
                        size="lg"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white h-16 px-12 text-xl rounded-full shadow-[0_0_40px_rgba(99,102,241,0.3)] font-bold transition-all hover:scale-105 active:scale-95 group"
                    >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                            Quero uma demonstração agora <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </Button>

                    <p className="mt-8 text-slate-500 text-sm italic">
                        Conversa direta com um de nossos estrategistas. Sem compromisso.
                    </p>
                </div>
            </div>
        </section>
    );
};
