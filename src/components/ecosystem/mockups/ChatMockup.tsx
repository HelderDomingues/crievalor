
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

export const ChatMockup = () => {
    return (
        <div className="relative w-full max-w-[320px] mx-auto bg-[#020617] rounded-[2rem] border-[6px] border-slate-800/80 shadow-2xl overflow-hidden aspect-[9/18]">
            {/* Notch/Top Bar */}
            <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 z-20 flex justify-center">
                <div className="w-20 h-5 bg-black rounded-b-xl" />
            </div>

            {/* Header */}
            <div className="pt-10 pb-4 px-4 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 border border-violet-500/30">
                    <Bot size={16} />
                </div>
                <div>
                    <div className="text-xs font-semibold text-white">LUMIA Mentor</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="p-4 flex flex-col gap-4 text-[11px] h-full bg-[#020617]">

                {/* User Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="self-end max-w-[85%] bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tr-none border border-slate-700"
                >
                    Como definimos nossos valores sem cair no clichê corporativo?
                </motion.div>

                {/* System Thinking */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="self-start text-[10px] text-violet-400 mb-[-10px] ml-2 font-mono"
                >
                    Analisando cultura atual...
                </motion.div>

                {/* AI Response */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 }}
                    className="self-start max-w-[90%] bg-violet-600/10 text-slate-200 p-3 rounded-2xl rounded-tl-none border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                >
                    <p className="mb-2">Vamos usar o framework de <strong>Virtudes Reais</strong>.</p>
                    <p>Não quero saber o que vocês <em>querem</em> ser. Quero saber o que vocês <em>toleram</em> e o que <em>punem</em>.</p>
                    <div className="mt-2 p-2 bg-black/40 rounded-lg border-l-2 border-violet-500 text-slate-400 italic">
                        "Cultura é o comportamento que você aceita quando ninguém está olhando."
                    </div>
                </motion.div>

            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 w-full p-3 bg-slate-900/50 backdrop-blur border-t border-slate-800">
                <div className="h-8 bg-slate-800/50 rounded-full w-full border border-slate-700/50" />
            </div>
        </div>
    );
};

export default ChatMockup;
