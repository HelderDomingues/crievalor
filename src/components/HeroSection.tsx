
import React from "react";
import HeroNetworkAnimation from "./HeroNetworkAnimation";
import HeroContent from "./HeroContent";
import ScrollIndicator from "./ScrollIndicator";
import HeroCarousel from "./HeroCarousel";
import ParticleWaveBackground from "./ParticleWaveBackground";
import MaritimeWaves from "./MaritimeWaves";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  isMarHero?: boolean;
  backgroundVideo?: string;
  backgroundImages?: string[];
  useParticleWaves?: boolean;
  useMaritimeWaves?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = props => {
  if (props.backgroundImages && props.backgroundImages.length > 0) {
    return <section className="relative min-h-screen flex items-center overflow-hidden pt-12" aria-labelledby="heroTitle">
        <div className="absolute inset-0 z-0 h-full">
          <HeroCarousel images={props.backgroundImages}>
            <HeroContent {...props} />
          </HeroCarousel>
        </div>
        <ScrollIndicator />
      </section>;
  }
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-12" aria-labelledby="heroTitle">
      {props.backgroundVideo ? (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover" poster="/placeholder.svg" aria-label={`Vídeo de fundo: ${props.title}`}>
            {props.backgroundVideo === 'home' ? <source src="https://elements-video-cover-images-0.imgix.net/files/127898251/preview.mp4?auto=compress&crop=edges&fit=crop&fm=webm&h=630&w=1200&s=c02f382afdd899a14a67fa1c8d348947" type="video/mp4" /> : <source src={`/videos/${props.backgroundVideo}`} type="video/mp4" />}
            Seu navegador não suporta vídeos.
          </video>
        </div>
      ) : props.useParticleWaves ? (
        <>
          <ParticleWaveBackground className="z-0" />
          <div className="absolute inset-0 bg-black/30 z-5"></div>
        </>
      ) : props.useMaritimeWaves ? (
        <div className="absolute inset-0 z-0">
          <MaritimeWaves className="w-full h-full" />
          <div className="absolute inset-0 bg-black/30 z-5"></div>
        </div>
      ) : (
        <HeroNetworkAnimation />
      )}
      
      <HeroContent {...props} />
      
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
