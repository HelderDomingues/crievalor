
import React from "react";
import { Clock, DollarSign, Target, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const MarBenefits = () => {
    const benefits = [
        {
            title: "Velocidade",
            description: "Reduza o tempo de desenvolvimento estratégico de meses para dias.",
            icon: Clock,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20"
        },
        {
            title: "Economia",
            description: "Custo significativamente menor que consultorias tradicionais.",
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20"
        },
        {
            title: "Precisão",
            description: "Análises baseadas em dados reais e processamento avançado da nossa metodologia proprietária.",
            icon: Target,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20"
        },
        {
            title: "Inovação",
            description: "Identificação de oportunidades não óbvias e ideias disruptivas.",
            icon: Lightbulb,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20"
        }
    ];

    return (
        <section className="py-16 bg-secondary/5 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary/10 shadow-lg glow-border">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Benefícios do MAR
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Por que escolher o Mapa para Alto Rendimento para sua empresa?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex items-start space-x-5 p-6 rounded-xl border ${benefit.borderColor} hover:bg-card/80 transition-all duration-300 group`}
                            >
                                <div className={`${benefit.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2">{benefit.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background glow effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </section>
    );
};

export default MarBenefits;
