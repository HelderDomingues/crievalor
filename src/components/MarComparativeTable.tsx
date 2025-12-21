import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, TrendingUp, Clock, DollarSign, Users, Sparkles, Target } from 'lucide-react';

const MarComparativeTable = () => {
    const comparisons = [
        {
            criterion: "Tempo de Entrega",
            icon: Clock,
            mar: { value: "7 dias", highlight: true },
            traditional: { value: "60-90 dias", highlight: false },
            saas: { value: "Imediato", highlight: false }
        },
        {
            criterion: "Preço",
            icon: DollarSign,
            mar: { value: "R$ 3.500 - 5.000", highlight: true },
            traditional: { value: "R$ 30.000 - 80.000", highlight: false },
            saas: { value: "R$ 200 - 500/mês", highlight: false }
        },
        {
            criterion: "Personalização",
            icon: Target,
            mar: { value: "Alta (DNA de Liderança)", highlight: true },
            traditional: { value: "Alta", highlight: false },
            saas: { value: "Baixa (genérico)", highlight: false }
        },
        {
            criterion: "Validação Humana",
            icon: Users,
            mar: { value: "Sim (26+ e 27+ anos exp.)", highlight: true },
            traditional: { value: "Sim", highlight: false },
            saas: { value: "Não", highlight: false }
        },
        {
            criterion: "Tecnologia IA",
            icon: Sparkles,
            mar: { value: "IA Nativa + Metodologia", highlight: true },
            traditional: { value: "Não", highlight: false },
            saas: { value: "Sim (básica)", highlight: false }
        },
        {
            criterion: "Acompanhamento",
            icon: TrendingUp,
            mar: { value: "Contínuo (Lumia 24/7)", highlight: true },
            traditional: { value: "Limitado", highlight: false },
            saas: { value: "Autoatendimento", highlight: false }
        },
        {
            criterion: "Metodologia",
            icon: Target,
            mar: { value: "BSC + Porter + Branding", highlight: true },
            traditional: { value: "Variável", highlight: false },
            saas: { value: "Templates", highlight: false }
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-secondary/10 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="blur-dot w-96 h-96 -top-48 -left-48 opacity-5"></div>
                <div className="blur-dot w-72 h-72 top-1/2 -right-36 opacity-10"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Por que escolher o MAR?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Compare e veja como o MAR combina o melhor dos dois mundos: velocidade da tecnologia com profundidade da consultoria tradicional.
                    </p>
                </motion.div>

                {/* Comparative Table */}
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full bg-card border border-border rounded-xl overflow-hidden">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-secondary/20">
                                    <th className="p-4 text-left font-bold">Critério</th>
                                    <th className="p-4 text-center font-bold bg-primary/10">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-primary">MAR</span>
                                            <span className="text-xs font-normal text-muted-foreground">(Crie Valor)</span>
                                        </div>
                                    </th>
                                    <th className="p-4 text-center font-bold">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>Consultoria</span>
                                            <span className="text-xs font-normal text-muted-foreground">Tradicional</span>
                                        </div>
                                    </th>
                                    <th className="p-4 text-center font-bold">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>SaaS</span>
                                            <span className="text-xs font-normal text-muted-foreground">Genérico</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {comparisons.map((item, index) => (
                                    <motion.tr
                                        key={index}
                                        className="border-t border-border hover:bg-secondary/5 transition-colors duration-200"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        {/* Criterion */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <item.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="font-medium">{item.criterion}</span>
                                            </div>
                                        </td>

                                        {/* MAR */}
                                        <td className="p-4 text-center bg-primary/5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`font-semibold ${item.mar.highlight ? 'text-primary' : ''}`}>
                                                    {item.mar.value}
                                                </span>
                                                {item.mar.highlight && (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                        </td>

                                        {/* Traditional */}
                                        <td className="p-4 text-center">
                                            <span className="text-muted-foreground">{item.traditional.value}</span>
                                        </td>

                                        {/* SaaS */}
                                        <td className="p-4 text-center">
                                            <span className="text-muted-foreground">{item.saas.value}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile-friendly Cards (shown on small screens) */}
                    <div className="md:hidden space-y-6 mt-8">
                        {comparisons.map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-card border border-border rounded-xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-bold">{item.criterion}</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                                        <span className="text-sm font-medium">MAR</span>
                                        <span className="text-sm font-semibold text-primary">{item.mar.value}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                                        <span className="text-sm font-medium">Tradicional</span>
                                        <span className="text-sm text-muted-foreground">{item.traditional.value}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                                        <span className="text-sm font-medium">SaaS</span>
                                        <span className="text-sm text-muted-foreground">{item.saas.value}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <p className="text-lg mb-6">
                            <strong>O MAR é a única solução</strong> que combina IA nativa, metodologia estratégica robusta e validação humana especializada.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/planos"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                            >
                                Ver Planos e Preços
                            </a>
                            <a
                                href="/contato"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                            >
                                Falar com Especialista
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default MarComparativeTable;
