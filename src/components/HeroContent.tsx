
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
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
  const navigate = useNavigate();

  const handleScroll = (url: string) => {
    if (url.startsWith('#')) {
      const element = document.getElementById(url.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(url);
    }
  };

  const renderButton = (text: string, url: string, isSecondary: boolean = false) => {
    // Handle anchor links (e.g., #contact) differently from route navigation
    if (url.startsWith('#')) {
      return (
        <Button
          size="lg"
          variant={isSecondary ? "outline" : "default"}
          className={isSecondary ? "border-primary text-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"}
          onClick={() => handleScroll(url)}
        >
          {text}
          {!isSecondary && !isMarHero && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
          {!isSecondary && isMarHero && <Compass className="ml-2 h-4 w-4" aria-hidden="true" />}
        </Button>
      );
    }

    // For regular routes, use Link component
    return (
      <Button
        size="lg"
        variant={isSecondary ? "outline" : "default"}
        className={isSecondary ? "border-primary text-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"}
        asChild
      >
        <Link to={url}>
          {text}
          {!isSecondary && !isMarHero && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
          {!isSecondary && isMarHero && <Compass className="ml-2 h-4 w-4" aria-hidden="true" />}
        </Link>
      </Button>
    );
  };

  return (
    <div className="container mx-auto px-4 relative z-30">
      <div className="max-w-3xl mx-auto text-center">
        {isMarHero && (
          <div className="mb-5 animate-fade-in">
            <img 
              src="/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" 
              alt="MAR - Mapa para Alto Rendimento" 
              className="h-24 mx-auto" 
            />
          </div>
        )}
        
        <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block mb-3 animate-fade-in">
          {subtitle}
        </div>
        
        <h1 
          style={{ animationDelay: "0.2s" }} 
          className="sm:text-5xl font-bold mb-4 animate-fade-in text-3xl md:text-5xl"
        >
          {title}
        </h1>
        
        <p 
          style={{ animationDelay: "0.4s" }} 
          className="text-lg md:text-xl text-muted-foreground mb-5 animate-fade-in px-[50px]"
        >
          {description}
        </p>
        
        <div 
          className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" 
          style={{ animationDelay: "0.6s" }}
        >
          {renderButton(ctaText, ctaUrl)}
          {secondaryCtaText && secondaryCtaUrl && renderButton(secondaryCtaText, secondaryCtaUrl, true)}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
