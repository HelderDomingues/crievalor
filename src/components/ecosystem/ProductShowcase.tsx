
import React from 'react';
import { motion } from 'framer-motion';
import { ChatMockup } from './mockups/ChatMockup';
import { KanbanMockup } from './mockups/KanbanMockup';
import { Bot, LineChart, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ProductShowcase = () => {
    return (
        <section className="py-24 bg-[#010816] overflow-hidden">
            <div className="container px-4 mx-auto">

                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Seu estrategista de negócio. <br />
                        <span className="text-violet-400">Disponível 24/7.</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Acesse diagnósticos profundos no desktop ou tire dúvidas estratégicas rápidas no mobile.
                        Onde quer que você esteja, o LUMIA está com você.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

                    {/* Feature List (Left) */}
                    <div className="space-y-8 order-2 lg:order-1">

                        <div className="flex gap-6 group">
                            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-violet-400 shrink-0 group-hover:border-violet-500 transition-colors">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Mentor de Cultura no Bolso</h3>
                                <p className="text-slate-400 font-light">
                                    Converse com o "Arquiteto de Cultura" para refinar seus valores, treinar liderança ou resolver conflitos. No celular, a qualquer hora.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 group">
                            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 group-hover:border-emerald-500 transition-colors">
                                <LineChart size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Monitoramento Vivo</h3>
                                <p className="text-slate-400 font-light">
                                    Seus indicadores estratégicos atualizados em tempo real. Saiba exatamente qual projeto está andando e qual travou.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 group">
                            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-500 transition-colors">
                                <Layout size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Execução sem Microgerenciamento</h3>
                                <p className="text-slate-400 font-light">
                                    O Kanban integrado distribui tarefas automaticamente. Você vê o progresso, não a "fofoca".
                                </p>
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button asChild className="bg-white text-black hover:bg-slate-200 rounded-full px-8 h-12 font-bold w-full md:w-auto">
                                <Link to="/planos">
                                    Quero inteligência 24h
                                </Link>
                            </Button>
                        </div>

                    </div>

                    {/* Visuals (Right) */}
                    <div className="relative h-[600px] flex items-center justify-center order-1 lg:order-2">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full opacity-40" />

                        {/* Mobile Phone Mockup */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute right-0 lg:right-10 bottom-0 z-20 w-[280px] md:w-[320px]"
                        >
                            <ChatMockup />
                        </motion.div>

                        {/* Background Screen ("Desktop/Kanban") */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute left-0 top-10 z-10 w-[90%] md:w-[500px] opacity-90 blur-[1px] hover:blur-none transition-all duration-500"
                        >
                            <KanbanMockup />
                        </motion.div>
                    </div>

                </div>

            </div>
        </section>
    );
};
