
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ConversionCTA = () => {
    return (
        <section className="py-32 bg-[#010816] relative overflow-hidden text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10 max-w-4xl">

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                    A inteligência do LUMIA <br />
                    <span className="text-slate-400 text-2xl md:text-4xl block mt-2 font-light">+ A experiência de Consultores Reais.</span>
                </h2>

                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                    Não espere mais 6 meses para estruturar sua empresa.
                    O controle do fluxo é seu. Valide cada etapa no seu ritmo e avance com segurança total.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Button asChild size="lg" className="bg-white text-black hover:bg-slate-200 h-14 px-10 text-lg rounded-full shadow-2xl font-bold w-full sm:w-auto transform hover:-translate-y-1 transition-all">
                        <Link to="/planos">
                            Começar minha transformação agora <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <Check size={14} className="text-emerald-500" /> Sem fidelidade
                    </div>
                    <div className="flex items-center gap-1">
                        <Check size={14} className="text-emerald-500" /> Cancelamento fácil
                    </div>
                    <div className="flex items-center gap-1">
                        <Check size={14} className="text-emerald-500" /> Suporte humano
                    </div>
                </div>

            </div>
        </section>
    );
};
