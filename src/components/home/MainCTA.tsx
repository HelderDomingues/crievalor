
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainCTA = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="transforme" aria-labelledby="transformeHeading">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-96 h-96 -top-48 -left-48 opacity-10"></div>
        <div className="blur-dot w-64 h-64 top-1/2 right-0 opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl p-8 md:p-12 max-w-4xl mx-auto text-center glow-border">
          <h2 id="transformeHeading" className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar sua estratégia?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubra como o MAR - Mapa para Alto Rendimento pode impulsionar os resultados
            da sua empresa com estratégias personalizadas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/mar" aria-label="Conheça o MAR - Saiba mais sobre o Mapa para Alto Rendimento">
                Conheça o MAR <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contato" aria-label="Agendar uma consulta - Fale com nossos especialistas">
                Agendar uma consulta <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/blog" aria-label="Visite nosso Blog - Conteúdos sobre estratégia e marketing">
                Visite nosso Blog <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCTA;
