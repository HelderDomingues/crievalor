import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import ContactSection from "@/components/ContactSection";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import PricingSection from "@/components/home/PricingSection";

import { FAQSchema } from "@/components/seo/SchemaMarkup";

const Pricing = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Helmet>
                <title>Planos e Preços | Ecossistema LUMIA - Crie Valor</title>
                <meta name="description" content="Confira os planos do Ecossistema LUMIA. Inteligência Organizacional a partir de R$ 560/mês. Básico, Intermediário e Avançado. Ideal para empresas que buscam crescimento estruturado." />
                <link rel="canonical" href="https://crievalor.com.br/planos" />
            </Helmet>

            <FAQSchema
                questions={[
                    {
                        question: "O que está incluído no Plano Básico?",
                        answer: "O Plano Básico inclui acesso ao planejamento estratégico acelerado, 6 consultores virtuais especialistas em IA e ferramentas de propósito organizacional do Sistema LUMIA, para 1 usuário principal."
                    },
                    {
                        question: "Como funciona a Implementação Assistida?",
                        answer: "Nos planos Intermediário e Avançado, você recebe acompanhamento de consultores seniores (humanos) em reuniões quinzenais ou semanais para garantir a execução do plano."
                    },
                    {
                        question: "Posso mudar de plano depois?",
                        answer: "Sim, você pode fazer o upgrade ou downgrade do seu plano a qualquer momento entrando em contato com nosso suporte."
                    },
                    {
                        question: "Existe fidelidade?",
                        answer: "Os planos mensais podem ser cancelados a qualquer momento. Os planos anuais oferecem desconto e possuem condições específicas de fidelidade."
                    }
                ]}
            />

            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30 bg-primary/5 text-primary">
                            <Sparkles className="w-3 h-3 mr-2 fill-current" />
                            Investimento Inteligente
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
                            Acelere sua empresa com o <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                Ecossistema LUMIA
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                            Escolha o plano ideal para o momento da sua empresa. Do planejamento à execução assistida, temos a estrutura certa para você.
                        </p>
                    </div>
                </section>

                {/* Pricing Grid */}
                <PricingSection />

                {/* Contact Section */}
                <ContactSection />
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
