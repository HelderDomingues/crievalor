import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { combos, individualProducts } from "@/components/pricing/pricingData";
import ComboCard from "@/components/pricing/ComboCard";
import ProductCard from "@/components/pricing/ProductCard";
import ContactSection from "@/components/ContactSection";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const Pricing = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Helmet>
                <title>Quanto Custa Inteligência Organizacional com IA? | Planos - Crie Valor</title>
                <meta name="description" content="Planos a partir de R$ 299 (Mentor de Propósito). MAR: R$ 3.500-5.000. LUMIA: R$ 697/mês. Combos com desconto. Primeira plataforma brasileira de IA para PMEs. Fundadores: Helder Domingues e Paulo Gaudioso." />
                <link rel="canonical" href="https://crievalor.com.br/planos" />
            </Helmet>

            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30 bg-primary/5 text-primary">
                            <Sparkles className="w-3 h-3 mr-2 fill-current" />
                            Investimento em Crescimento
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            Escolha o plano ideal para <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                acelerar sua empresa
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Soluções completas de planejamento estratégico, inteligência artificial e desenvolvimento de liderança.
                        </p>
                    </div>
                </section>

                {/* Combos Section (Priority) */}
                <section className="py-12 md:py-20 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Combos Recomendados</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Maximize seus resultados e economize com nossos pacotes integrados de soluções.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {combos.map((combo) => (
                                <ComboCard key={combo.id} combo={combo} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Individual Products Section */}
                <section className="py-16 md:py-24 bg-secondary/20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Soluções Individuais</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Contrate nossas soluções separadamente conforme a necessidade específica do seu negócio.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {individualProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ or Additional Info could go here */}

                <ContactSection />
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
