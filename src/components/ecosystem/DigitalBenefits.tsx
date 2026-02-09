
import React from 'react';
import { Cloud, Zap, Download } from 'lucide-react';

export const DigitalBenefits = () => {
    return (
        <div className="bg-slate-950 border-y border-slate-800/60 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-slate-400 text-sm font-medium">

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 text-violet-400">
                            <Cloud size={20} />
                        </div>
                        <span>100% Online e Seguro</span>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-slate-800" />

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 text-emerald-400">
                            <Zap size={20} />
                        </div>
                        <span>Acesso Imediato</span>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-slate-800" />

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 text-amber-400">
                            <Download size={20} />
                        </div>
                        <span>Zero Instalação (No-Code)</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
