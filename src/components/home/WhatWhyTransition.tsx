import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatWhyTransition = () => {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-primary/5 to-background" id="transicao-por-que-o-que">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Visual Connection */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-6">
              <div className="bg-primary/10 rounded-full p-4">
                <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <ArrowRight className="h-6 w-6 text-primary/50" aria-hidden="true" />
              </div>
              <div className="block sm:hidden">
                <ArrowDown className="h-6 w-6 text-primary/50" aria-hidden="true" />
              </div>
              <div className="bg-secondary/30 rounded-full p-4">
                <Target className="h-8 w-8 text-secondary-foreground" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl md:text-4xl font-bold animate-fade-in">
              O que fazemos é simplesmente um{" "}
              <span className="text-primary">reflexo do nosso porquê</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in" style={{animationDelay: "0.2s"}}>
              Cada serviço, cada metodologia, cada ferramenta que criamos tem um único objetivo: 
              <strong className="text-foreground"> gerar clareza e direção para impulsionar o crescimento das empresas</strong>.
            </p>
          </div>

          {/* Bridge Content */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto">
                  <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-primary">Por Quê</h3>
                <p className="text-sm text-muted-foreground">
                  Gerar clareza e direção para empresas
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-secondary/30 rounded-full p-3 w-fit mx-auto">
                  <Target className="h-6 w-6 text-secondary-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-bold">Como</h3>
                <p className="text-sm text-muted-foreground">
                  Metodologias próprias + tecnologia + expertise
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-accent/30 rounded-full p-3 w-fit mx-auto">
                  <ArrowRight className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-bold">O Quê</h3>
                <p className="text-sm text-muted-foreground">
                  Produtos e serviços que transformam
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-fade-in" style={{animationDelay: "0.6s"}}>
            <p className="text-muted-foreground mb-6">
              Conheça as soluções que criamos para transformar sua empresa:
            </p>
            
            <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300" asChild>
              <Link to="#mar-produto" onClick={(e) => {
                e.preventDefault();
                document.getElementById('mar-produto')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Ver nossos produtos e serviços <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWhyTransition;