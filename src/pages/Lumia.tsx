import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, DollarSign, Users, Target, ArrowRight, Check } from 'lucide-react';
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

const Lumia = () => {
    const consultores = [
        {
            icon: Target,
            nome: "Consultor de Estratégia",
            descricao: "Análise de cenários, planejamento estratégico e tomada de decisões complexas."
        },
        {
            icon: TrendingUp,
            nome: "Consultor de Marketing",
            descricao: "Posicionamento, branding, campanhas e estratégias de crescimento."
        },
        {
            icon: DollarSign,
            nome: "Consultor de Vendas",
            descricao: "Processos comerciais, negociação e aceleração de resultados."
        },
        {
            icon: Brain,
            nome: "Consultor de Finanças",
            descricao: "Gestão financeira, fluxo de caixa e análise de viabilidade."
        },
        {
            icon: Users,
            nome: "Consultor de Operações",
            descricao: "Processos, produtividade e otimização operacional."
        },
        {
            icon: Sparkles,
            nome: "Consultor de Pessoas",
            descricao: "Gestão de equipes, cultura organizacional e desenvolvimento humano."
        }
    ];

    const planos = [
        {
            nome: "Mensal",
            preco: "697",
            periodo: "/mês",
            descricao: "Flexibilidade total",
            features: ["6 consultores especializados", "Disponível 24/7", "Sem fidelidade"]
        },
        {
            nome: "Trimestral",
            preco: "1.797",
            periodo: "/trimestre",
            descricao: "Economia de 14%",
            features: ["6 consultores especializados", "Disponível 24/7", "R$ 599/mês"],
            destaque: true
        },
        {
            nome: "Anual",
            preco: "5.649",
            periodo: "/ano",
            descricao: "Máxima economia",
            features: ["6 consultores especializados", "Disponível 24/7", "R$ 471/mês"]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>LUMIA - 6 Consultores Virtuais de IA Disponíveis 24/7 | Crie Valor</title>
                <meta
                    name="description"
                    content="LUMIA é um sistema de 6 agentes de IA especializados (Estratégia, Marketing, Vendas, Finanças, Operações, Pessoas) disponíveis 24/7. R$ 697/mês ou R$ 1.797/trimestre. Decisões do dia a dia com inteligência de consultoria. Fundadores: Helder Domingues e Paulo Gaudioso."
                />
                <meta property="og:title" content="LUMIA - 6 Consultores Virtuais de IA 24/7 | Crie Valor" />
                <meta
                    property="og:description"
                    content="6 consultores especializados com IA disponíveis 24/7 por R$ 697/mês. Estratégia, Marketing, Vendas, Finanças, Operações e Pessoas."
                />
                <meta property="og:type" content="product" />
                <meta property="og:url" content="https://crievalor.com.br/lumia" />
                <link rel="canonical" href="https://crievalor.com.br/lumia" />
            </Helmet>

            <ProductSchema
                name="LUMIA - 6 Consultores Virtuais com IA"
                description="Sistema de 6 agentes de IA especializados (Estratégia, Marketing, Vendas, Finanças, Operações, Pessoas) disponíveis 24/7 para decisões empresariais. Consultoria de bolso acessível o tempo todo."
                image="https://iili.io/KnFOVTb.png"
                brand="Crie Valor - Inteligência Organizacional"
                offers={{
                    price: "697.00",
                    priceCurrency: "BRL",
                    availability: "https://schema.org/InStock",
                    url: "https://crievalor.com.br/lumia"
                }}
                isDigital={true}
            />

            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://crievalor.com.br" },
                    { name: "LUMIA - Consultores Virtuais", url: "https://crievalor.com.br/lumia" }
                ]}
            />

            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-pink-900/20 overflow-hidden">
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
                                    <strong>LUMIA</strong> é um sistema de <strong>6 agentes de IA especializados</strong> (Estratégia, Marketing, Vendas, Finanças, Operações, Pessoas) disponíveis <strong>24/7</strong>. <strong>R$ 697/mês</strong> ou <strong>R$ 1.797/trimestre</strong>. Decisões do dia a dia com inteligência de consultoria.
                                </p>
                            </div>

                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                                <Sparkles className="h-10 w-10 text-primary" />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Como ter 6 consultores especializados disponíveis 24/7 por R$ 697/mês?
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                                Consultoria de bolso com inteligência artificial. Sempre disponível, sempre precisa.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="https://lumia.crievalor.com.br"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                >
                                    Experimentar LUMIA <ArrowRight className="ml-2 h-4 w-4" />
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

                {/* O que é LUMIA */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                O que é LUMIA?
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                LUMIA é o primeiro sistema brasileiro de <strong>consultores virtuais especializados</strong> que combina inteligência artificial com a metodologia estratégica da Crie Valor. São <strong>6 consultores</strong> treinados para atender sua empresa <strong>24 horas por dia, 7 dias por semana</strong>.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {consultores.map((consultor, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-card border border-border rounded-xl p-6 hover:glow-border transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <consultor.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{consultor.nome}</h3>
                                    <p className="text-muted-foreground">{consultor.descricao}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Para quem é */}
                <section className="py-16 md:py-24 bg-secondary/10">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Para quem é LUMIA?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                LUMIA é ideal para empresários e gestores que:
                            </p>
                        </motion.div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            {[
                                "Precisam de orientação estratégica rápida e precisa",
                                "Querem validar ideias e decisões antes de executar",
                                "Buscam insights especializados sem custo de consultoria tradicional",
                                "Desejam acompanhamento contínuo em múltiplas áreas",
                                "Valorizam agilidade e disponibilidade 24/7"
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-lg">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Planos e Preços */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Quanto custa LUMIA?
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Escolha o plano ideal para sua empresa. Todos incluem os 6 consultores especializados.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {planos.map((plano, index) => (
                                <motion.div
                                    key={index}
                                    className={`bg-card border rounded-xl p-8 ${plano.destaque ? 'border-primary glow-border scale-105' : 'border-border'}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {plano.destaque && (
                                        <div className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                                            Mais Popular
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold mb-2">{plano.nome}</h3>
                                    <p className="text-muted-foreground mb-4">{plano.descricao}</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">R$ {plano.preco}</span>
                                        <span className="text-muted-foreground">{plano.periodo}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plano.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="h-5 w-5 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href="https://lumia.crievalor.com.br"
                                        className={`block text-center rounded-md text-sm font-medium h-11 px-8 py-3 transition-colors ${plano.destaque
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                    >
                                        Começar Agora
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="py-16 md:py-24 bg-primary/5">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Pronto para ter consultoria 24/7?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Experimente LUMIA e tenha 6 consultores especializados sempre disponíveis para sua empresa.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="https://lumia.crievalor.com.br"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                >
                                    Experimentar LUMIA <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                                <a
                                    href="/projetos"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                                >
                                    Conhecer nossos Projetos
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Lumia;
