
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroContent from "@/components/HeroContent";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { FAQSchema } from "@/components/seo/SchemaMarkup";

const Accessibility = () => {
  useScrollToTop();
  
  // FAQ data for the FAQ schema and component
  const accessibilityFAQs = [
    {
      question: "O que significa acessibilidade web?",
      answer: "Acessibilidade web significa que sites, ferramentas e tecnologias são projetados e desenvolvidos para que pessoas com deficiências possam usá-los. Isso inclui perceber, entender, navegar, interagir e contribuir com a web."
    },
    {
      question: "Quais diretrizes de acessibilidade a Crie Valor segue?",
      answer: "A Crie Valor busca seguir as diretrizes WCAG 2.1 (Web Content Accessibility Guidelines), que são o padrão internacional para acessibilidade web. Estamos constantemente trabalhando para melhorar nossa conformidade com estas diretrizes."
    },
    {
      question: "Como posso ajustar o tamanho da fonte no site?",
      answer: "Você pode ajustar o tamanho da fonte usando as funcionalidades do seu navegador. Na maioria dos navegadores, você pode aumentar o zoom pressionando Ctrl + (Windows/Linux) ou Command + (Mac), e diminuir com Ctrl - ou Command -."
    },
    {
      question: "O site é compatível com leitores de tela?",
      answer: "Sim, trabalhamos para garantir que nosso site seja compatível com leitores de tela populares como NVDA, JAWS e VoiceOver. Utilizamos texto alternativo para imagens e estrutura semântica de HTML para melhorar a navegação."
    },
    {
      question: "Como posso reportar problemas de acessibilidade encontrados no site?",
      answer: "Se você encontrar qualquer problema de acessibilidade em nosso site, por favor entre em contato conosco pelo e-mail: contato@crievalor.com.br. Seu feedback é importante para continuarmos melhorando."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Acessibilidade | Crie Valor Estratégia</title>
        <meta name="description" content="Nosso compromisso em tornar nosso conteúdo acessível para todos os usuários, independentemente de suas habilidades." />
        <meta property="og:title" content="Acessibilidade | Crie Valor Estratégia" />
        <meta property="og:description" content="Nosso compromisso em tornar nosso conteúdo acessível para todos os usuários, independentemente de suas habilidades." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br/acessibilidade" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Acessibilidade | Crie Valor" />
        <meta name="twitter:description" content="Nosso compromisso com a acessibilidade web para todos os usuários." />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br/acessibilidade" />
      </Helmet>
      
      <FAQSchema questions={accessibilityFAQs} />
      
      <Header />
      
      <main className="flex-grow pt-16">
        <HeroContent
          title="Acessibilidade"
          subtitle="Nosso Compromisso"
          description="Comprometidos em tornar nosso conteúdo acessível para todos os usuários."
          ctaText="Entre em Contato"
          ctaUrl="/contato"
        />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-3xl mx-auto">
              <h2>Nosso Compromisso com a Acessibilidade</h2>
              <p>
                A Crie Valor está comprometida em garantir que nosso site seja 
                acessível a todos os usuários, independentemente de suas 
                habilidades ou tecnologias assistivas utilizadas.
              </p>
              
              <h3>Recursos de Acessibilidade</h3>
              <ul>
                <li>Navegação por teclado</li>
                <li>Texto alternativo para imagens</li>
                <li>Estrutura semântica clara</li>
                <li>Contraste adequado de cores</li>
                <li>Tamanho de fonte ajustável</li>
              </ul>
              
              <h3>Feedback e Suporte</h3>
              <p>
                Se você encontrar alguma dificuldade ao acessar nosso site ou 
                tiver sugestões para melhorar nossa acessibilidade, entre em 
                contato conosco.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                {accessibilityFAQs.map((faq, index) => (
                  <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Accessibility;
