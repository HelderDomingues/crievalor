
import React, { useEffect } from 'react';
import { HeroJourney } from '@/components/ecosystem/HeroJourney';
import { DigitalBenefits } from '@/components/ecosystem/DigitalBenefits';
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee';
import { PainEducation } from '@/components/ecosystem/PainEducation';
import { DeepProcessBreakdown } from '@/components/ecosystem/DeepProcessBreakdown';
import { ProductShowcase } from '@/components/ecosystem/ProductShowcase';
import { GuaranteeSection } from '@/components/ecosystem/GuaranteeSection';
import { ConversionCTA } from '@/components/ecosystem/ConversionCTA';
import { LumiaComparison } from '@/components/ecosystem/LumiaComparison';
import { WhyLumia } from '@/components/ecosystem/WhyLumia';
import { LumiaFAQ } from '@/components/ecosystem/LumiaFAQ';
import { QueroDemonstracao } from '@/components/ecosystem/QueroDemonstracao';
import Footer from '@/components/Footer';

const Ecosystem = () => {

    // Force scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#010816] text-slate-200 selection:bg-violet-500/30">

            {/* 1. Hero (The Hook + Strategic Intelligence) */}
            <HeroJourney />

            {/* 2. Friction Reducer (No Setup / Online) */}
            <DigitalBenefits />

            {/* 3. High-Conversion Marquee Testimonials */}
            <TestimonialsSection
                title="Líderes que já escalaram com o LUMIA"
                description="Junte-se a centenas de fundadores que transformaram 'feeling' em dados e incerteza em plano estratégico."
                testimonials={[
                    {
                        author: {
                            name: "Carlos José Alencar",
                            handle: "CEO, Primeira Linha Acabamentos",
                            avatar: "https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/testimonials-photos/carlinhos-primeiralInha.jpeg"
                        },
                        text: "O faturávamos entre 600 e 800 mil sem previsibilidade. Em um ano de MAR, crescemos 30% e ultrapassamos a casa do milhão com consistência."
                    },
                    {
                        author: {
                            name: "Debora Celine",
                            handle: "Proprietária, Expresso Contabilidade",
                            avatar: "https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/testimonials-photos/debora_expressocontabilidade.png"
                        },
                        text: "O MAR foi essencial para o crescimento do meu escritório. O resultado foi um aumento na lucratividade e uma expansão consistente da carteira de clientes."
                    },
                    {
                        author: {
                            name: "Edson Nogueira",
                            handle: "Proprietário, Loged Consultoria",
                            avatar: "https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/testimonials-photos/edson-loged.png"
                        },
                        text: "O MAR foi essencial para mudar minha empresa!! Consegui organizar processos, reduzir custos e aumentar a eficiência operacional."
                    },
                    {
                        author: {
                            name: "Cesar Gomes",
                            handle: "Proprietário, Itasul Modas",
                            avatar: "https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/testimonials-photos/cesargomes-itasul.png"
                        },
                        text: "Minha loja de roupas estava estagnada. O MAR me deu um guia prático e detalhado e assim organizei processos e otimizei estoques. O resultado foi um aumento significativo nas vendas."
                    }
                ]}
            />

            {/* 4. Education (Reporting vs Reasoning AI) */}
            <div id="education">
                <PainEducation />
            </div>

            {/* 4.1 Comparative (The Gap) */}
            <LumiaComparison />

            {/* 5. Deep Process (The 16 Steps - The "How") */}
            <div id="process">
                <DeepProcessBreakdown />
            </div>

            {/* 6. Product Showcase (Mobile/Desktop Evidence) */}
            <div id="showcase">
                <ProductShowcase />
            </div>

            {/* 6.1 Persuasion (The Choice) */}
            <WhyLumia />

            {/* 7. Risk Reversal (15 Day Guarantee) */}
            <GuaranteeSection />

            {/* 8. Final Conversion */}
            <ConversionCTA />

            {/* 8.1 Demo Request */}
            <QueroDemonstracao />

            {/* 8.2 FAQ */}
            <LumiaFAQ />

            {/* 9. Footer */}
            <Footer />
        </div>
    );
};

export default Ecosystem;
