
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "Qual a diferença entre o LUMIA e o ChatGPT ou IA genérica?",
        answer: "O ChatGPT é um oráculo genérico. O LUMIA é um ecossistema de especialistas treinado especificamente na metodologia MAR e no contexto estratégico do seu negócio. Ele não 'inventa' respostas; ele aplica frameworks testados de alta performance ao seu cenário real."
    },
    {
        question: "Eu preciso ter conhecimento técnico de IA para usar?",
        answer: "Nenhum. O LUMIA foi desenhado para ser conversacional e intuitivo. Ele fala a língua do empresário, não do programador. Se você sabe enviar uma mensagem, você sabe usar o LUMIA."
    },
    {
        question: "Meus dados empresariais estão seguros?",
        answer: "Sim. Utilizamos infraestrutura de nível corporativo com criptografia de ponta a ponta. Seus dados estratégicos são isolados e nunca são utilizados para treinar modelos públicos de IA."
    },
    {
        question: "Quanto tempo leva para ver os primeiros resultados?",
        answer: "Diferente de consultorias que levam meses, o impacto do LUMIA é sentido na primeira semana. A clareza diagnóstica é instantânea, permitindo correções de curso imediatas na sua operação."
    },
    {
        question: "O sistema substitui um consultor humano?",
        answer: "O LUMIA potencializa o humano. Ele remove o trabalho braçal de análise e organização, permitindo que você (ou seus consultores) foquem na tomada de decisão de alto nível, com 10x mais velocidade e precisão."
    }
];

export const LumiaFAQ = () => {
    return (
        <section className="py-24 bg-[#010816]">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">FAQ - Perguntas Frequentes</h2>
                        <p className="text-slate-400">
                            Esclareça suas dúvidas sobre como o Ecossistema de Inteligência vai transformar seu negócio.
                        </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqData.map((item, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="border border-white/5 bg-slate-900/30 rounded-xl px-6"
                            >
                                <AccordionTrigger className="text-white hover:text-violet-400 transition-colors text-left py-6">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 pb-6 leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};
