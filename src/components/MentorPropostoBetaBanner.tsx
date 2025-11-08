import React from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MentorPropostoBetaBanner = () => {
  return (
    <section className="py-8 md:py-12 relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border-y border-amber-500/20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 -top-32 -left-32 opacity-20" style={{ background: 'linear-gradient(135deg, hsl(40, 75%, 65%), hsl(30, 70%, 60%))' }}></div>
        <div className="blur-dot w-64 h-64 -bottom-32 -right-32 opacity-20" style={{ background: 'linear-gradient(135deg, hsl(30, 75%, 65%), hsl(20, 70%, 60%))' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Icon & Badge */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-600 to-amber-500 p-4 rounded-2xl shadow-lg">
                  <Heart className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  BETA
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-grow text-center lg:text-left">
              <div className="inline-flex items-center bg-amber-500/20 text-amber-400 rounded-full px-3 py-1 mb-3">
                <Sparkles className="mr-2 h-3 w-3" aria-hidden="true" />
                <span className="font-medium text-sm">Acesso Gratuito por Tempo Limitado</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Mentor de Propósito: Descubra seu "Por Quê"
              </h2>
              
              <p className="text-muted-foreground mb-3">
                Sistema de inteligência conversacional que guia você na descoberta do propósito autêntico da sua empresa. 
                <strong className="text-amber-400"> 100% gratuito até 30/11/2025!</strong>
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span>
                  Após essa data, novos cadastros passarão a ser pagos. 
                  <strong className="text-foreground"> Garanta seu acesso agora!</strong>
                </span>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="shadow-glow bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 whitespace-nowrap"
                asChild
              >
                <a href="https://proposito.crievalor.com.br" target="_blank" rel="noopener noreferrer">
                  Começar Agora <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-amber-500/50 hover:bg-amber-500/10 whitespace-nowrap"
                asChild
              >
                <Link to="/sobre">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorPropostoBetaBanner;
