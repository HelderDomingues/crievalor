
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroContent from "@/components/HeroContent";

const Accessibility = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Accessibility;

