
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Target, Rocket, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const steps = [
    {
        phase: "Fase 1: Diagnóstico (O Espelho)",
        icon: Search,
        color: "text-blue-400",
        borderColor: "border-blue-500/20",
        description: "Não há estratégia sem verdade. Mapeamos onde você realmente está.",
        items: [
            "Análise de Perfil de Liderança (Behavioral)",
            "Diagnóstico de Saúde Financeira (Projeção 12 Meses)",
            "Auditoria Digital (Site & Redes Sociais)",
            "Análise de Segmento de Mercado (Raio X)"
        ]
    },
    {
        phase: "Fase 2: Estratégia (O Mapa)",
        icon: Compass,
        color: "text-violet-400",
        borderColor: "border-violet-500/20",
        description: "Definimos para onde vamos e como vamos vencer.",
        items: [
            "Matriz Estratégica Completa (SWOT, Pestel, Porter)",
            "Pilares Culturais (Propósito, Mantra, Valores)",
            "Posicionamento de Marca & Branding",
            "Objetivos Estratégicos (BSC)"
        ]
    },
    {
        phase: "Fase 3: Tática (O Motor)",
        icon: Target,
        color: "text-amber-400",
        borderColor: "border-amber-500/20",
        description: "Transformamos objetivos abstratos em manobras concretas.",
        items: [
            "Mineração de Competidores (Benchmarking)",
            "Estratégia de Canais de Marketing",
            "Planejamento de Conteúdo Editorial",
            "Táticas Comerciais de Curto Prazo"
        ]
    },
    {
        phase: "Fase 4: Ação (O Caminho)",
        icon: Rocket,
        color: "text-emerald-400",
        borderColor: "border-emerald-500/20",
        description: "O plano vira realidade. Execução monitorada.",
        items: [
            "Geração de 12+ Planos de Ação (Kanban)",
            "Atribuição de Responsáveis e Prazos",
            "Monitoramento de Execução em Tempo Real",
            "Ciclos de Melhoria Contínua"
        ]
    }
];

export const DeepProcessBreakdown = () => {
    return (
        <section className="py-24 bg-[#010816] relative">
            <div className="container px-4 mx-auto max-w-4xl">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        A Jornada de 16 Passos para o Alto Rendimento
                    </h2>
                    <p className="text-slate-400">
                        Um processo estruturado, validado e sequencial. Sem pontas soltas.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 md:-translate-x-1/2" />

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:text-right' : 'md:flex-row-reverse md:text-left'}`}
                            >
                                {/* Center Icon */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 z-10 bg-[#010816] p-2 border border-slate-700 rounded-full">
                                    <step.icon className={`w-6 h-6 ${step.color}`} />
                                </div>

                                {/* Content Card */}
                                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                    <div className={`p-6 bg-slate-900/40 border ${step.borderColor} rounded-xl hover:bg-slate-900/60 transition-colors`}>
                                        <h3 className={`text-xl font-bold text-white mb-2`}>{step.phase}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{step.description}</p>

                                        <div className={`space-y-2 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                                            {step.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-slate-300 text-sm bg-black/20 px-3 py-1.5 rounded border border-white/5 w-fit">
                                                    {index % 2 !== 0 && <span className={`w-1.5 h-1.5 rounded-full ${step.color.replace('text-', 'bg-')}`} />}
                                                    {item}
                                                    {index % 2 === 0 && <span className={`w-1.5 h-1.5 rounded-full ${step.color.replace('text-', 'bg-')}`} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Empty Space for Alignment */}
                                <div className="hidden md:block md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-16 relative z-10">
                        <Link to="/planos" className="w-full sm:w-auto">
                            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 h-auto shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-1 group w-full">
                                <span className="flex flex-col items-center">
                                    <span className="font-bold text-lg">Quero ver meu diagnóstico</span>
                                    <span className="text-xs font-normal opacity-80">Começar Fase 1 da Jornada</span>
                                </span>
                                <ArrowDown className="ml-3 group-hover:translate-y-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
};
