
import React from "react";
import MaritimeWaves from "./MaritimeWaves";
import AIGridMesh from "./AIGridMesh";
import HeroNetworkAnimation from "./HeroNetworkAnimation";
import HeroContent from "./HeroContent";
import HeroIcons from "./HeroIcons";
import ScrollIndicator from "./ScrollIndicator";
import HeroCarousel from "./HeroCarousel";
import ParticleWaveBackground from "./ParticleWaveBackground";

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
}

const HeroSection: React.FC<HeroSectionProps> = (props) => {
  if (props.backgroundImages && props.backgroundImages.length > 0) {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden pt-12">
        <div className="absolute inset-0 z-0 h-full">
          <HeroCarousel images={props.backgroundImages}>
            <HeroContent {...props} />
          </HeroCarousel>
        </div>
        <ScrollIndicator />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-12">
      {props.backgroundVideo ? (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            poster="/placeholder.svg"
          >
            {props.backgroundVideo === 'home' ? (
              <source src="https://elements-video-cover-images-0.imgix.net/files/127898251/preview.mp4?auto=compress&crop=edges&fit=crop&fm=webm&h=630&w=1200&s=c02f382afdd899a14a67fa1c8d348947" type="video/mp4" />
            ) : (
              <source src={`/videos/${props.backgroundVideo}`} type="video/mp4" />
            )}
            Seu navegador não suporta vídeos.
          </video>
        </div>
      ) : props.useParticleWaves ? (
        <>
          <ParticleWaveBackground className="z-0" />
          <div className="absolute inset-0 bg-black/30 z-5"></div>
        </>
      ) : (
        <>
          <HeroNetworkAnimation />
          <AIGridMesh className="z-5" />
          <MaritimeWaves className="z-10" />
          <div className="absolute inset-0 hero-gradient opacity-70 z-10 bg-transparent"></div>
        </>
      )}
      
      <HeroIcons isVisible={props.isMarHero || false} />
      
      <HeroContent {...props} />
      
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
