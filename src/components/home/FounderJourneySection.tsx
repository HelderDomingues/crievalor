import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ArrowRight, Lightbulb, Target, Rocket, Award, TrendingUp, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JourneyStep {
    year: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

interface Founder {
    name: string;
    role: string;
    photo: string;
    linkedin: string;
    bioShort: string;
    bioLong: string;
}

const FounderJourneySection = () => {
    const journeySteps: JourneyStep[] = [
        {
            year: "2014",
            title: "O Chamado ao Propósito",
            description: "Helder assiste à palestra de Simon Sinek no TED sobre o poder do 'Por Quê'. A semente é plantada: empresas precisam saber seu propósito para crescer de forma sustentável.",
            icon: Lightbulb,
            color: "from-amber-500 to-orange-500"
        },
        {
            year: "Abril/2015",
            title: "Fundação da Crie Valor",
            description: "Nasce a Crie Valor - Inteligência Organizacional com propósito claro no DNA: gerar clareza e direção para empresas, fazendo da atitude o motor do crescimento. O nome não foi por acaso.",
            icon: Rocket,
            color: "from-blue-500 to-cyan-500"
        },
        {
            year: "2015-2024",
            title: "Transformação de Dezenas de Empresas",
            description: "Metodologias refinadas, empresas transformadas. Mas algo ainda faltava: como democratizar estratégia de alto nível sem perder profundidade e personalização?",
            icon: Target,
            color: "from-purple-500 to-pink-500"
        },
        {
            year: "Final de 2024",
            title: "A Transformação Começou por Nós",
            description: "Repensar todo o modelo de negócios. Revisar processos. Investir tempo, dinheiro, passar pela curva de aprendizagem. Redefinir nosso próprio propósito para torná-lo ainda mais impactante.",
            icon: TrendingUp,
            color: "from-red-500 to-rose-500"
        },
        {
            year: "2025",
            title: "Primeiro Ecossistema de IA do Brasil",
            description: "Nasce o Ecossistema de Inteligência Organizacional: MAR (7 dias vs 90), Lumia (6 consultores 24/7), Mentor de Propósito. IA nativa + Metodologia estratégica robusta + Validação humana.",
            icon: Award,
            color: "from-emerald-500 to-teal-500"
        }
    ];

    const founders: Founder[] = [
        {
            name: "Helder Domingues",
            role: "Fundador e Arquiteto do Ecossistema",
            photo: "https://media.licdn.com/dms/image/v2/D4D03AQEcKxGZ8vYGpg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1729084283090?e=1740614400&v=beta&t=YourActualToken",
            linkedin: "https://www.linkedin.com/in/helderdomingues/",
            bioShort: "Com 26+ anos de experiência em Marketing, Branding e Planejamento Estratégico, Helder é o arquiteto do Ecossistema de Inteligência Organizacional da Crie Valor. MBA em Gestão Estratégica Avançada (UCDB), fluente em inglês com vivência em Londres. Idealizou e projetou MAR, Lumia e Mentor de Propósito. Diretor de Marketing internacional há 11+ anos.",
            bioLong: "Helder Domingues é fundador da Crie Valor e arquiteto do primeiro Ecossistema de Inteligência Organizacional com IA do Brasil. Com 26+ anos de experiência em Marketing, Branding, Planejamento Estratégico e Desenvolvimento de Produtos com IA, liderou a transformação de dezenas de empresas desde 2015.\n\nPossui MBA em Gestão Estratégica Avançada e Especialização em Administração de Marketing e Propaganda (UCDB), com fluência em inglês e vivência em Londres. Há 11+ anos, atua como Diretor de Marketing para empresa inglesa de consultoria internacional (Diakrino Limited).\n\nIdealizador e projetista de todos os produtos digitais da Crie Valor: MAR - Mapa para Alto Rendimento (co-autor com Paulo Gaudioso), LUMIA - Sistema de Consultores Virtuais, e Mentor de Propósito. Este último foi inspirado pela palestra de Simon Sinek no TED em 2014 sobre o poder do propósito organizacional. Combina visão criativa com rigor estratégico para profissionalizar PMEs brasileiras, atuando como Consultor de Resultados e Mentor de Alta Performance."
        },
        {
            name: "Paulo Gaudioso",
            role: "Co-fundador e Co-autor do Método MAR",
            photo: "https://media.licdn.com/dms/image/v2/YourPauloImageURL",
            linkedin: "https://www.linkedin.com/in/paulogaudioso/",
            bioShort: "Com 27+ anos de experiência em Gestão de Pessoas e Desenvolvimento Organizacional, Paulo é co-fundador da Crie Valor e co-autor do método MAR. Psicólogo (UCDB), Coach Certificado (SBC/BCI/ICC) e idealizador dos programas FÓRMULA 3.0, FÓRMULA 4.0 e OFICINA DE LÍDERES. Transformou estruturas de empresas com 2.000+ colaboradores.",
            bioLong: "Paulo Gaudioso é co-fundador da Crie Valor e co-autor do método MAR - Mapa para Alto Rendimento. Com 27+ anos de experiência em Gestão de Pessoas, Mentoria e Desenvolvimento Organizacional, é especialista em transformar negócios e lideranças.\n\nPsicólogo (UCDB), Coach Certificado Internacional (SBC/BCI/ICC) e especialista em Dinâmica de Grupos (SBDG), liderou a gestão de RH em empresas com 2.000+ colaboradores, reduzindo indicadores de absenteísmo e turn-over significativamente.\n\nIdealizador dos programas FÓRMULA 3.0, FÓRMULA 4.0 e OFICINA DE LÍDERES, possui visão sistêmica e estratégica dos negócios, focando em resultados permanentes e sustentáveis para PMEs brasileiras. Como Consultor de Resultados e Mentor de Alta Performance, lidera iniciativas que, há mais de 15 anos, transformam a estrutura das empresas e a vida de seus colaboradores, sempre com foco no desenvolvimento efetivo e na excelência organizacional."
        }
    ];

    const impactStats = [
        { value: "50+", label: "Empresas Transformadas" },
        { value: "120+", label: "Horas Liberadas/Empresário" },
        { value: "65%", label: "Taxa de Execução do Plano" }
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="blur-dot w-96 h-96 -top-48 -left-48 opacity-5"></div>
                <div className="blur-dot w-72 h-72 top-1/2 -right-36 opacity-10"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Answer Capsule + Header */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* H2 como Pergunta (AEO/GEO) */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                        Quem está por trás da Crie Valor?
                    </h2>

                    {/* Answer Capsule (40-60 palavras) */}
                    <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-8">
                        <p className="text-lg leading-relaxed">
                            <strong>Helder Domingues</strong> e <strong>Paulo Gaudioso</strong>, co-fundadores e co-autores do método MAR, com 26+ e 27+ anos de experiência respectivamente. Arquitetos do primeiro Ecossistema de Inteligência Organizacional com IA do Brasil, transformam empresas desde abril/2015 combinando estratégia, tecnologia e validação humana.
                        </p>
                    </div>
                </motion.div>

                {/* Founders Profiles */}
                <motion.div
                    className="max-w-6xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {founders.map((founder, index) => (
                            <motion.div
                                key={index}
                                className="bg-card border border-border rounded-xl p-8 hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Photo */}
                                    <div className="flex-shrink-0">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                                            <img
                                                src={founder.photo}
                                                alt={founder.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(founder.name)}&size=128&background=3b82f6&color=fff`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-2">{founder.name}</h3>
                                        <p className="text-sm text-primary font-medium mb-4">{founder.role}</p>

                                        {/* Bio Short */}
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                            {founder.bioShort}
                                        </p>

                                        {/* LinkedIn Button */}
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                <Linkedin className="h-4 w-4" />
                                                Ver Perfil Completo
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Bio Long (Expandable) */}
                                <details className="mt-6">
                                    <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                        Ler biografia completa
                                    </summary>
                                    <div className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {founder.bioLong}
                                    </div>
                                </details>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Journey Timeline */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                        Como a Crie Valor se tornou pioneira em Inteligência Organizacional com IA?
                    </h2>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20"></div>

                        {journeySteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative pl-20 pb-12 last:pb-0"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Icon */}
                                <div className={`absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                                    <step.icon className="h-8 w-8 text-white" />
                                </div>

                                {/* Content */}
                                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-bold text-primary">{step.year}</span>
                                        <div className="h-px flex-1 bg-border"></div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Impact Stats */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                        Como medir a Inteligência Organizacional dentro de uma corporação?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {impactStats.map((stat, index) => (
                            <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:glow-border transition-all duration-300">
                                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Mission Statement */}
                <motion.div
                    className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 md:p-12 text-center mb-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Nossa Missão Hoje</h3>
                    <p className="text-lg mb-6">
                        Somos a <strong>primeira e única plataforma brasileira</strong> que combina IA nativa com metodologia estratégica robusta.
                    </p>
                    <p className="text-lg mb-6">
                        Não somos consultoria tradicional. Não somos SaaS genérico. Somos <strong>Inteligência Organizacional</strong>.
                    </p>
                    <p className="text-xl font-bold text-primary">
                        Gerar clareza e direção para empresas, fazendo da atitude o motor do crescimento.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Button size="lg" asChild>
                        <a href="/mar">
                            Conhecer o MAR <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <a href="/contato">
                            Falar com a Gente
                        </a>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FounderJourneySection;
