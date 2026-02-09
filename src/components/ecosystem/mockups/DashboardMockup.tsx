
import React from 'react';
import { BarChart3, Users, Target, Activity, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardMockup = () => {
    return (
        <div className="relative w-full aspect-[16/10] bg-[#020617] rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex text-[10px] md:text-xs select-none">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20" />

            {/* Sidebar */}
            <div className="w-16 md:w-20 border-r border-slate-800 flex flex-col items-center py-4 gap-4 bg-[#0f172a]/50 backdrop-blur-sm z-10">
                <div className="w-8 h-8 rounded-lg bg-violet-600 mb-2" />
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400"><Activity size={14} /></div>
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400"><Target size={14} /></div>
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400"><Users size={14} /></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <div className="h-2 w-24 bg-slate-700/50 rounded mb-2" />
                        <div className="h-4 w-48 bg-slate-700/30 rounded" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-800" />
                        <div className="h-8 w-8 rounded-full bg-slate-800" />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 h-full">

                    {/* Main Chart Card */}
                    <div className="col-span-2 bg-[#1e293b]/40 border border-slate-800 rounded-lg p-3 md:p-4 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between">
                            <div className="h-3 w-32 bg-slate-700/40 rounded" />
                            <div className="text-emerald-400 flex items-center gap-1 text-[10px]">
                                +24% <ArrowUpRight size={10} />
                            </div>
                        </div>
                        {/* Mock Chart Area */}
                        <div className="mt-4 flex items-end justify-between h-24 md:h-32 gap-1 px-1">
                            {[40, 60, 45, 70, 55, 80, 65, 90, 75, 50, 60, 85].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="w-full bg-violet-600/20 rounded-t-sm relative group-hover:bg-violet-500/30 transition-colors"
                                >
                                    <div className="absolute bottom-0 w-full bg-violet-500 rounded-t-sm" style={{ height: '4px' }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Side Cards */}
                    <div className="col-span-1 flex flex-col gap-3 md:gap-4">
                        <div className="flex-1 bg-[#1e293b]/40 border border-slate-800 rounded-lg p-3 flex flex-col justify-center relative group">
                            <div className="absolute top-3 right-3 p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                <CheckCircle2 size={12} />
                            </div>
                            <div className="text-slate-400 mb-1">Diagnóstico</div>
                            <div className="text-lg md:text-2xl font-semibold text-white">92%</div>
                            <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[92%]" />
                            </div>
                        </div>

                        <div className="flex-1 bg-[#1e293b]/40 border border-slate-800 rounded-lg p-3 flex flex-col justify-center relative group">
                            <div className="absolute top-3 right-3 p-1 rounded-full bg-amber-500/10 text-amber-500">
                                <Clock size={12} />
                            </div>
                            <div className="text-slate-400 mb-1">Próxima Ação</div>
                            <div className="text-white font-medium truncate">Revisão Estratégica</div>
                            <div className="text-[10px] text-slate-500 mt-1">Hoje, 14:00</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardMockup;
