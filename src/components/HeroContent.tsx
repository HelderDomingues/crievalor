
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  isMarHero?: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  isMarHero = false
}) => {
  return (
    <div className="container mx-auto px-4 relative z-30">
      <div className="max-w-3xl mx-auto text-center">
        {isMarHero ? (
          <div className="mb-6 animate-fade-in">
            <img src="/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" alt="MAR - Mapa para Alto Rendimento" className="h-24 mx-auto" />
          </div>
        ) : (
          // Reduced from mb-6 (by approximately 20%)
          <div className="mb-5 animate-fade-in"></div>
        )}
        
        <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block mb-3 animate-fade-in">
          {subtitle}
        </div>
        
        <h1 
          style={{ animationDelay: "0.2s" }} 
          className="sm:text-5xl font-bold mb-5 animate-fade-in text-3xl md:text-5xl"
        >
          {title}
        </h1>
        
        <p 
          className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in" 
          style={{ animationDelay: "0.4s" }}
        >
          {description}
        </p>
        
        <div 
          className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" 
          style={{ animationDelay: "0.6s" }}
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" asChild>
            <a href={ctaUrl}>
              {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          
          {secondaryCtaText && secondaryCtaUrl && (
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
              <a href={secondaryCtaUrl}>{secondaryCtaText}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
