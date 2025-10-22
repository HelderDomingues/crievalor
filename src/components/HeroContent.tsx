import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import oficinaLideresLogo from "@/assets/oficina-lideres-logo.png";
interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  isMarHero?: boolean;
  isOficinaLideresHero?: boolean;
}
const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  isMarHero = false,
  isOficinaLideresHero = false
}) => {
  const navigate = useNavigate();
  const handleScroll = (url: string) => {
    if (url.startsWith('#')) {
      const element = document.getElementById(url.substring(1));
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      navigate(url);
    }
  };
  const renderButton = (text: string, url: string, isSecondary: boolean = false) => {
    // Handle anchor links (e.g., #contact) differently from route navigation
    if (url.startsWith('#')) {
      return <Button size="lg" variant={isSecondary ? "outline" : "default"} className={isSecondary ? "border-primary text-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"} onClick={() => handleScroll(url)} aria-label={`${text} - ir para seção da página`}>
          {text}
          {!isSecondary && !isMarHero && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
          {!isSecondary && isMarHero && <Compass className="ml-2 h-4 w-4" aria-hidden="true" />}
        </Button>;
    }

    // Special case for whatsapp links
    if (url.startsWith('https://wa.me') || url.startsWith('wa.me')) {
      return <Button size="lg" variant={isSecondary ? "outline" : "default"} className={isSecondary ? "border-primary text-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"} asChild>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${text} - abrir WhatsApp em nova janela`}>
            {text}
            {!isSecondary && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
          </a>
        </Button>;
    }

    // For external links 
    if (url.startsWith('http')) {
      return <Button size="lg" variant={isSecondary ? "outline" : "default"} className={isSecondary ? "border-primary text-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"} asChild>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${text} - abrir em nova janela`}>
            {text}
            {!isSecondary && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
          </a>
        </Button>;
    }

    // For regular routes, use Link component
    return <Button size="lg" variant={isSecondary ? "outline" : "default"} className={isSecondary ? "border-primary text-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"} asChild>
        <Link to={url} aria-label={`${text} - ir para ${url.replace('/', '')}`}>
          {text}
          {!isSecondary && !isMarHero && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
          {!isSecondary && isMarHero && <Compass className="ml-2 h-4 w-4" aria-hidden="true" />}
        </Link>
      </Button>;
  };
  return <div className="container mx-auto px-4 relative z-30">
      <div className="max-w-3xl mx-auto text-center">
        {isMarHero && <div className="mb-5 animate-fade-in">
            <img alt="MAR - Mapa para Alto Rendimento" width="300" height="192" loading="eager" src="https://iili.io/3vlTe6l.png" className="h-48 mx-auto object-contain" />
          </div>}
        
        {isOficinaLideresHero && <div className="mb-5 animate-fade-in">
            <img alt="Oficina de Líderes" width="400" height="200" loading="eager" src={oficinaLideresLogo} className="h-32 md:h-40 mx-auto object-contain" />
          </div>}
        
        <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block mb-3 animate-fade-in">
          {subtitle}
        </div>
        
        {!isOficinaLideresHero && <h1 style={{
        animationDelay: "0.2s"
      }} className="sm:text-5xl font-bold mb-4 animate-fade-in text-3xl md:text-5xl" id="heroTitle">
          {title}
        </h1>}
        
        <p style={{
        animationDelay: "0.4s"
      }} className="text-lg md:text-xl text-muted-foreground mb-5 animate-fade-in">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          {renderButton(ctaText, ctaUrl)}
          {secondaryCtaText && secondaryCtaUrl && renderButton(secondaryCtaText, secondaryCtaUrl, true)}
        </div>
      </div>
    </div>;
};
export default HeroContent;