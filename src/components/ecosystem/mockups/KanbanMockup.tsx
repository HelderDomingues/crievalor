
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export const KanbanMockup = () => {
    return (
        <div className="w-full bg-[#0f172a] rounded-xl border border-slate-800 p-4 aspect-[4/3] flex flex-col gap-4 text-xs select-none shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                <div className="font-semibold text-slate-200">Plano de Ação: Marketing Q3</div>
                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900" />
                    <div className="w-6 h-6 rounded-full bg-violet-600 border border-slate-900 flex items-center justify-center text-[8px] text-white">You</div>
                </div>
            </div>

            {/* Board */}
            <div className="flex gap-3 h-full items-start">

                {/* Column: To Do */}
                <div className="flex-1 bg-slate-900/50 rounded-lg p-2 flex flex-col gap-2">
                    <div className="text-[10px] font-medium text-slate-500 uppercase flex justify-between">
                        A Fazer <span className="bg-slate-800 px-1.5 rounded text-slate-400">3</span>
                    </div>
                    {/* Card */}
                    <div className="bg-[#1e293b] p-2 rounded border border-slate-700/50 shadow-sm hover:border-violet-500/50 transition-colors cursor-pointer">
                        <div className="flex gap-1 mb-2">
                            <span className="px-1.5 py-0.5 rounded-[2px] bg-blue-500/10 text-blue-400 text-[8px]">Estratégia</span>
                        </div>
                        <div className="text-slate-300 mb-2 leading-tight">Definir canais de aquisição B2B</div>
                        <div className="flex justify-between items-center opacity-50">
                            <div className="w-4 h-4 rounded-full bg-slate-700" />
                            <MoreHorizontal size={12} />
                        </div>
                    </div>
                </div>

                {/* Column: Doing */}
                <div className="flex-1 bg-slate-900/50 rounded-lg p-2 flex flex-col gap-2">
                    <div className="text-[10px] font-medium text-amber-500/80 uppercase flex justify-between">
                        Em Execução <span className="bg-amber-500/10 px-1.5 rounded text-amber-500">1</span>
                    </div>
                    {/* Card Active */}
                    <div className="bg-[#1e293b] p-2 rounded border-l-2 border-amber-500 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
                        <div className="text-white mb-2 leading-tight font-medium">Revisão de Conteúdo LinkedIn</div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                            <div className="bg-amber-500 h-full w-2/3" />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-4 h-4 rounded-full bg-violet-500" />
                            <span className="text-[9px] text-amber-400">Hoje</span>
                        </div>
                    </div>
                </div>

                {/* Column: Done */}
                <div className="flex-1 bg-slate-900/50 rounded-lg p-2 flex flex-col gap-2 opacity-60">
                    <div className="text-[10px] font-medium text-emerald-500/80 uppercase flex justify-between">
                        Feito <span className="bg-emerald-500/10 px-1.5 rounded text-emerald-500">42</span>
                    </div>
                    <div className="bg-[#1e293b] p-2 rounded border border-slate-700/30">
                        <div className="text-slate-400 line-through decoration-slate-600">Setup Inicial</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default KanbanMockup;
