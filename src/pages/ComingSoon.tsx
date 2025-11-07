import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { Palette, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  useScrollToTop();

  return (
    <>
      <Helmet>
        <title>Portfólio em Breve | Crie Valor Consultoria</title>
        <meta name="description" content="Estamos preparando nosso portfólio de identidades visuais. Em breve você poderá conferir nossos projetos incríveis!" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30">
        <Header />
        
        <main className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Icon Animation */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="animate-[bounce_3s_ease-in-out_infinite]">
                <Palette className="w-16 h-16 text-primary" />
              </div>
              <div className="animate-[bounce_3s_ease-in-out_infinite_0.2s]">
                <Sparkles className="w-16 h-16 text-accent" />
              </div>
              <div className="animate-[bounce_3s_ease-in-out_infinite_0.4s]">
                <Clock className="w-16 h-16 text-primary" />
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-[gradient_6s_ease_infinite]">
                Em Breve
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-foreground/90">
                Nosso Portfólio de Identidades Visuais
              </p>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-4 text-lg text-muted-foreground">
              <p>
                Estamos selecionando nossos melhores cases de identidade visual para você.
              </p>
              <p>
                Em breve, você poderá conferir projetos incríveis que transformaram marcas e criaram valor real para nossos clientes.
              </p>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>

            {/* CTA Section */}
            <div className="space-y-6 pt-8">
              <p className="text-xl font-medium text-foreground">
                Enquanto isso, que tal conversarmos sobre o seu projeto?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  asChild
                  className="min-w-[200px]"
                >
                  <a 
                    href="https://wa.me/5547992150289" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Falar no WhatsApp
                  </a>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  asChild
                  className="min-w-[200px]"
                >
                  <Link to="/contato">
                    Entrar em Contato
                  </Link>
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-12 space-y-4">
              <p className="text-sm text-muted-foreground">
                Quer conhecer outros serviços? Explore nossas soluções:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="ghost" asChild>
                  <Link to="/mar">MAR - Método de Avaliação de Risco</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/mentorias">Mentorias</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/projetos">Projetos</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ComingSoon;
