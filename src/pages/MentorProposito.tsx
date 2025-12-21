import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Compass, Target, Heart, Lightbulb, ArrowRight, Check, Quote } from 'lucide-react';
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

const MentorProposito = () => {
    const beneficios = [
        {
            icon: Target,
            titulo: "Clareza Estratégica",
            descricao: "Descubra o 'Por Quê' que guia todas as decisões da sua empresa."
        },
        {
            icon: Heart,
            titulo: "Cultura Autêntica",
            descricao: "Construa uma cultura organizacional alinhada com seu propósito."
        },
        {
            icon: Lightbulb,
            titulo: "Diferenciação no Mercado",
            descricao: "Destaque-se da concorrência com um propósito único e inspirador."
        }
    ];

    const jornada = [
        {
            etapa: "1",
            titulo: "Descoberta",
            descricao: "Explore suas motivações, valores e visão de futuro através de perguntas guiadas."
        },
        {
            etapa: "2",
            titulo: "Reflexão",
            descricao: "Analise padrões, identifique conexões e compreenda o que realmente importa."
        },
        {
            etapa: "3",
            titulo: "Definição",
            descricao: "Articule seu propósito de forma clara, inspiradora e acionável."
        },
        {
            etapa: "4",
            titulo: "Implementação",
            descricao: "Receba orientações práticas para incorporar o propósito no dia a dia."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>Mentor de Propósito - Descubra o Propósito da Sua Empresa com IA | Crie Valor</title>
                <meta
                    name="description"
                    content="Mentor de Propósito é uma jornada guiada por agente especializado de IA para descobrir o propósito organizacional. R$ 299 pagamento único. Bússola digital para clareza estratégica inspirada em Simon Sinek. Fundadores: Helder Domingues e Paulo Gaudioso."
                />
                <meta property="og:title" content="Mentor de Propósito - Descubra o Propósito com IA | Crie Valor" />
                <meta
                    property="og:description"
                    content="Jornada guiada por IA para descobrir o propósito da sua empresa. R$ 299 pagamento único. Clareza estratégica e diferenciação no mercado."
                />
                <meta property="og:type" content="product" />
                <meta property="og:url" content="https://crievalor.com.br/mentor-proposito" />
                <link rel="canonical" href="https://crievalor.com.br/mentor-proposito" />
            </Helmet>

            <ProductSchema
                name="Mentor de Propósito - Jornada de Descoberta com IA"
                description="Jornada guiada por agente especializado de IA para descobrir o propósito organizacional. Bússola digital para clareza estratégica inspirada em Simon Sinek. Investimento único de R$ 299."
                image="https://iili.io/KnFOVTb.png"
                brand="Crie Valor - Inteligência Organizacional"
                offers={{
                    price: "299.00",
                    priceCurrency: "BRL",
                    availability: "https://schema.org/InStock",
                    url: "https://crievalor.com.br/mentor-proposito"
                }}
                isDigital={true}
            />

            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://crievalor.com.br" },
                    { name: "Mentor de Propósito", url: "https://crievalor.com.br/mentor-proposito" }
                ]}
            />

            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 bg-gradient-to-br from-yellow-900/20 via-orange-900/10 to-amber-900/20 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="blur-dot w-96 h-96 -top-48 -left-48 opacity-10"></div>
                        <div className="blur-dot w-72 h-72 top-1/2 -right-36 opacity-15"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Answer Capsule */}
                            <div className="mb-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg text-left">
                                <p className="text-lg leading-relaxed">
                                    <strong>Mentor de Propósito</strong> é uma jornada guiada por <strong>agente especializado de IA</strong> para descobrir o propósito organizacional. <strong>R$ 299 pagamento único</strong>. Bússola digital para clareza estratégica inspirada em <strong>Simon Sinek</strong>.
                                </p>
                            </div>

                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                                <Compass className="h-10 w-10 text-primary" />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Por que sua empresa existe?
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                                Descubra o propósito que transforma empresas comuns em marcas extraordinárias.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="https://proposito.crievalor.com.br"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                >
                                    Iniciar Jornada <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                                <a
                                    href="/contato"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                                >
                                    Falar com Especialista
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* O que é */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                O que é o Mentor de Propósito?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                O Mentor de Propósito é uma <strong>ferramenta de inteligência conversacional</strong> que guia líderes e organizações na descoberta do propósito que impulsiona resultados extraordinários.
                            </p>
                            <p className="text-lg text-muted-foreground">
                                Inspirado nos ensinamentos de <strong>Simon Sinek</strong> sobre o "Golden Circle" (Por Quê, Como, O Quê), o Mentor conduz você por uma jornada estruturada de autoconhecimento organizacional.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {beneficios.map((beneficio, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-card border border-border rounded-xl p-6 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <beneficio.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{beneficio.titulo}</h3>
                                    <p className="text-muted-foreground">{beneficio.descricao}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Por que propósito importa */}
                <section className="py-16 md:py-24 bg-secondary/10">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                                Por que propósito importa?
                            </h2>

                            <div className="bg-card border-l-4 border-primary p-6 rounded-r-lg mb-8">
                                <Quote className="h-8 w-8 text-primary mb-4" />
                                <p className="text-lg italic mb-4">
                                    "As pessoas não compram O QUE você faz, elas compram POR QUÊ você faz."
                                </p>
                                <p className="text-sm text-muted-foreground">— Simon Sinek</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    "Empresas com propósito claro crescem 3x mais rápido",
                                    "Colaboradores engajados com o propósito são 87% mais produtivos",
                                    "Clientes pagam até 20% a mais por marcas com propósito autêntico",
                                    "Propósito reduz turnover em até 40%"
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-lg">{stat}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Como funciona a jornada */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Como funciona a jornada?
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Uma jornada guiada em 4 etapas para descobrir e articular o propósito da sua empresa.
                            </p>
                        </motion.div>

                        <div className="max-w-4xl mx-auto space-y-8">
                            {jornada.map((etapa, index) => (
                                <motion.div
                                    key={index}
                                    className="flex gap-6 items-start"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                                        <span className="text-2xl font-bold text-primary">{etapa.etapa}</span>
                                    </div>
                                    <div className="flex-1 bg-card border border-border rounded-xl p-6">
                                        <h3 className="text-2xl font-bold mb-2">{etapa.titulo}</h3>
                                        <p className="text-muted-foreground">{etapa.descricao}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Preço e CTA */}
                <section className="py-16 md:py-24 bg-primary/5">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Quanto custa?
                            </h2>
                            <div className="bg-card border border-border rounded-xl p-8 mb-8">
                                <div className="mb-4">
                                    <span className="text-5xl font-bold">R$ 299</span>
                                    <span className="text-muted-foreground text-xl"> / pagamento único</span>
                                </div>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Acesso completo à jornada guiada de descoberta de propósito
                                </p>
                                <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
                                    {[
                                        "Jornada completa em 4 etapas",
                                        "Agente de IA especializado",
                                        "Dashboard personalizado",
                                        "Documento final de propósito",
                                        "Orientações de implementação"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="https://proposito.crievalor.com.br"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                    >
                                        Iniciar Jornada Agora <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                    <a
                                        href="/mar"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                                    >
                                        Conhecer o MAR
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MentorProposito;
