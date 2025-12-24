import React from "react";
import { motion } from "framer-motion";
import {
    FileQuestion,
    Search,
    Target,
    Users,
    TrendingUp,
    Crosshair,
    Lightbulb,
    Megaphone,
    ShoppingCart,
    Rocket,
    FileText,
    CheckCircle2,
    Video,
    Play,
    Wrench,
} from "lucide-react";

interface ProcessStep {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
}

interface ProcessPhase {
    phase: string;
    phaseTitle: string;
    steps: ProcessStep[];
    colorTheme: {
        badge: string;
        text: string;
        subtle: string;
        border: string;
    };
}

const processPhases: ProcessPhase[] = [
    {
        phase: "Fase 1",
        phaseTitle: "Diagnóstico & Imersão",
        colorTheme: {
            badge: "bg-blue-600",
            text: "text-blue-500",
            subtle: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        steps: [
            {
                id: 1,
                title: "Questionário MAR",
                description:
                    "86 perguntas de múltipla escolha, checkbox e campos abertos em 11 módulos: perfil comportamental, perfil da empresa, propósito e valores, clientes e concorrência, finanças, processos, inovação, marketing, vendas e gestão de pessoas.",
                icon: FileQuestion,
            },
            {
                id: 2,
                title: "Análises Iniciais",
                description:
                    "Briefing detalhado, análise de perfil comportamental (metodologia proprietária), análise do segmento de mercado (nacional e local), análise técnica do website (SEO, palavras-chave, proposta de valor) e análise técnica do Instagram (últimas 15 postagens).",
                icon: Search,
            },
            {
                id: 3,
                title: "Definição de Pilares Estratégicos",
                description:
                    "Definição do propósito, valores e visão da empresa. Cruzamento de informações do questionário com o perfil comportamental. Elaboração de um Mantra Empresarial - síntese da declaração em até 6 palavras.",
                icon: Target,
            },
            {
                id: 4,
                title: "Análise da Concorrência",
                description:
                    "Análise dos perfis de Instagram de 3 concorrentes indicados. Pesquisa sobre os websites dos concorrentes e reputação na web (incluindo Reclame Aqui). Geração do Relatório Comparativo com pontos fortes e fracos.",
                icon: Users,
            },
            {
                id: 5,
                title: "Análise Financeira",
                description:
                    "Classificação do estágio da empresa, leitura de estrutura e estresse organizacional, diagnóstico de maturidade financeira, coerência entre ambição e capacidade, cenários prováveis de 12 meses e principais riscos financeiros-organizacionais.",
                icon: TrendingUp,
            },
        ],
    },
    {
        phase: "Fase 2",
        phaseTitle: "Arquitetura Estratégica",
        colorTheme: {
            badge: "bg-indigo-600",
            text: "text-indigo-500",
            subtle: "bg-indigo-500/10",
            border: "border-indigo-500/20"
        },
        steps: [
            {
                id: 6,
                title: "Posicionamento Estratégico",
                description:
                    "Análises clássicas para diagnosticar o posicionamento atual: Forças de Porter (CORE), McKinsey 7S, PESTEL Setorial, Matriz Ansoff e Perceptual MAP. Definição do Posicionamento Estratégico recomendado para a empresa.",
                icon: Crosshair,
            },
            {
                id: 7,
                title: "Definição de Objetivos Estratégicos (BSC)",
                description:
                    "Análise de todos os relatórios anteriores e definição de Objetivos Estratégicos com base na metodologia Balanced Scorecard (BSC). Classificação de cada objetivo segundo a perspectiva BSC (Financeira, Clientes, Processos, Aprendizado).",
                icon: Target,
            },
        ],
    },
    {
        phase: "Fase 3",
        phaseTitle: "Inteligência de Marca & Mercado",
        colorTheme: {
            badge: "bg-violet-600",
            text: "text-violet-500",
            subtle: "bg-violet-500/10",
            border: "border-violet-500/20"
        },
        steps: [
            {
                id: 8,
                title: "Branding",
                description:
                    "Definição da Identidade da Marca. Mapeamento do perfil demográfico e psicográfico do público-alvo. Criação de personas detalhadas. Definição da Proposta Única de Valor (PUV), o arquétipo da marca e o tom de voz editorial.",
                icon: Lightbulb,
            },
            {
                id: 9,
                title: "Estratégias e Táticas de Negócio e Comerciais",
                description:
                    "Análise dos Objetivos Estratégicos e as orientações de Branding. Criação de estratégias e táticas comerciais e de negócios para atingir os objetivos estratégicos. Definição de ações específicas e detalhadas para um horizonte de 12 meses.",
                icon: ShoppingCart,
            },
            {
                id: 10,
                title: "Estratégias e Táticas de Marketing e Publicidade",
                description:
                    "Criação de campanhas e ações para atingir os objetivos. Atuação nas 4 frentes estratégicas: Marketing de Eventos e Experiência, Marketing Tradicional e Offline, Marketing Digital Multicanal e Marketing de Guerrilha / Inovação / Growth Hacking.",
                icon: Megaphone,
            },
        ],
    },
    {
        phase: "Fase 4",
        phaseTitle: "Plano Tático & Entrega",
        colorTheme: {
            badge: "bg-purple-600",
            text: "text-purple-500",
            subtle: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        steps: [
            {
                id: 11,
                title: "Manual de Bordo - Planos de Ação",
                description:
                    "Compilação das táticas de Negócios, Comercial e Marketing. Construção de Planos de Ação no formato SMART, detalhados e claros. Para cada plano, inclui a seção 'Como Faço Isso?' com passo a passo prático. Aponta responsáveis sugeridos (com base na estrutura da empresa).",
                icon: Rocket,
            },
            {
                id: 12,
                title: "Relatório Final – Mapa para Alto Rendimento",
                description:
                    "Documento enxuto, estruturado com: Briefing de Introdução e contextualização, Objetivos Estratégicos do BSC, Manual de Bordo - Planos de ação SMART com passo a passo de como executar cada ação, e links para todos os documentos produzidos durante o processo.",
                icon: FileText,
            },
            {
                id: 13,
                title: "Revisão Humana",
                description:
                    "Consultores experientes revisam todos os documentos e validam as análises e recomendações. Aqui é que a expertise humana faz a diferença. Analisamos com cuidado o Mapa do cliente para entregar um plano consistente com a realidade da empresa, seus objetivos e o mercado.",
                icon: CheckCircle2,
            },
            {
                id: 14,
                title: "Entrega ao Cliente",
                description:
                    "O Documento principal (Relatório Final) é enviado ao cliente.",
                icon: FileText,
            },
        ],
    },
    {
        phase: "Fase 5",
        phaseTitle: "Pós-Entrega & Suporte",
        colorTheme: {
            badge: "bg-fuchsia-600",
            text: "text-fuchsia-500",
            subtle: "bg-fuchsia-500/10",
            border: "border-fuchsia-500/20"
        },
        steps: [
            {
                id: 15,
                title: "Reunião Online com Consultor",
                description:
                    "Após a entrega é agendada uma reunião online com um de nossos consultores (geralmente o consultor responsável pela revisão) para que o cliente possa entender o Manual de Bordo e tirar dúvidas sobre qualquer material produzido durante o processo.",
                icon: Video,
            },
            {
                id: 16,
                title: "Início da Implementação Assistida (Opcional)",
                description:
                    "Contratação separada ou em combo. Acompanhamento hands-on para executar o plano do MAR com reuniões semanais, suporte WhatsApp e validação de execução.",
                icon: Wrench,
            },
        ],
    },
];

const MarProcessSteps = () => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Como Funciona o Sistema MAR
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Um processo estruturado em 16 etapas que combina inteligência
                        artificial, metodologias estratégicas robustas e validação humana
                        especializada para criar seu mapa estratégico personalizado.
                    </p>
                </motion.div>

                {/* Process Timeline */}
                <div className="max-w-5xl mx-auto space-y-16">
                    {processPhases.map((phase, phaseIndex) => (
                        <motion.div
                            key={phase.phase}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: phaseIndex * 0.1 }}
                            className="relative"
                        >
                            {/* Phase Header */}
                            <div className="mb-8">
                                <div className={`inline-block px-4 py-2 ${phase.colorTheme.subtle} rounded-full mb-3`}>
                                    <span className={`text-sm font-semibold ${phase.colorTheme.text}`}>
                                        {phase.phase}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold">
                                    {phase.phaseTitle}
                                </h3>
                            </div>

                            {/* Steps in this phase */}
                            <div className="space-y-6 relative pl-8 md:pl-12">
                                {/* Vertical line connecting steps */}
                                <div className={`absolute left-[19px] md:left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b ${phase.colorTheme.text.replace('text', 'from')} via-white/10 to-transparent opacity-40`}></div>

                                {phase.steps.map((step, stepIndex) => {
                                    const Icon = step.icon;
                                    return (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{
                                                duration: 0.5,
                                                delay: stepIndex * 0.1,
                                            }}
                                            className="relative group"
                                        >
                                            {/* Step number badge */}
                                            <div className={`absolute -left-8 md:-left-12 top-0 w-10 h-10 md:w-14 md:h-14 rounded-full ${phase.colorTheme.badge} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10`}>
                                                <span className="text-sm md:text-base font-bold text-white">
                                                    {step.id}
                                                </span>
                                            </div>

                                            {/* Step content card */}
                                            <div className={`bg-card rounded-lg p-6 shadow-sm border border-border/50 hover:${phase.colorTheme.border} hover:shadow-md transition-all duration-300`}>
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${phase.colorTheme.subtle} flex items-center justify-center group-hover:bg-opacity-20 transition-colors duration-300`}>
                                                        <Icon className={`w-6 h-6 ${phase.colorTheme.text}`} />
                                                    </div>

                                                    {/* Text content */}
                                                    <div className="flex-1">
                                                        <h4 className="text-lg md:text-xl font-semibold mb-2">
                                                            {step.title}
                                                        </h4>
                                                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Key Differentiator Callout */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 max-w-4xl mx-auto"
                >
                    <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-8 md:p-12 border border-primary/20">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Lightbulb className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    Os Diferenciais do MAR
                                </h3>
                                <p className="text-muted-foreground">
                                    Uma das principais características e diferenciais do MAR é a{" "}
                                    <strong className="text-foreground">
                                        personalização pelo perfil comportamental do dono da empresa
                                    </strong>
                                    . Essa análise influencia diretamente em todas as definições
                                    de pilares estratégicos, objetivos BSC, estratégias e táticas
                                    do plano, garantindo que o Mapa seja não somente
                                    personalizado para a empresa, mas também para o perfil
                                    comportamental do dono.
                                </p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    7 dias
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    vs 60-90 dias tradicional
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    R$ 3.497
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    vs R$ 30-80k consultoria
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    Método Híbrido - IA + Humano
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Tecnologia + Expertise
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default MarProcessSteps;
