import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface FloatingCTAProps {
  className?: string;
}
const FloatingCTA: React.FC<FloatingCTAProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show after scrolling 30% of viewport
      if (scrolled > windowHeight * 0.3 && !hasInteracted) {
        setIsVisible(true);
      }
    };
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsVisible(true);
      }
    }, 15000); // Show after 15 seconds

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [hasInteracted]);
  const handleClose = () => {
    setIsVisible(false);
    setHasInteracted(true);
  };
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  const handleCTAClick = () => {
    setHasInteracted(true);
  };
  if (!isVisible) return null;
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "scale-75" : "scale-100",
        className,
      )}
    >
      <Card className="w-80 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-0">
          {!isMinimized ? (
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">FALE CONOSCO</h3>
                    <p className="text-xs text-muted-foreground">
                      Faça seu cadastro ou entre em contato diretamente com nossa equipe.
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleMinimize}>
                    <span className="text-xs">_</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleClose}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Descubra exatamente onde sua empresa pode melhorar e transpor as barreiras que impedem o seu
                  crescimento.
                </p>

                <div className="space-y-2">
                  <Button size="sm" className="w-full shadow-glow text-xs" onClick={handleCTAClick} asChild>
                    <Link to="/contato">
                      Cadastre-se <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleCTAClick} asChild>
                    <a
                      href="https://wa.me/+5547992150289?text=Tenho%20interesse%20no%20diagnóstico%20gratuito"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="mr-2 h-3 w-3" />
                      WhatsApp direto
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <Button variant="outline" size="sm" className="w-full" onClick={handleMinimize}>
                <Calendar className="mr-2 h-4 w-4" />
                Diagnóstico Gratuito
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default FloatingCTA;
