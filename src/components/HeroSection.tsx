
import React from "react";
import MaritimeWaves from "./MaritimeWaves";
import AIGridMesh from "./AIGridMesh";
import HeroNetworkAnimation from "./HeroNetworkAnimation";
import HeroContent from "./HeroContent";
import HeroIcons from "./HeroIcons";
import ScrollIndicator from "./ScrollIndicator";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  isMarHero?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = (props) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <HeroNetworkAnimation />
      
      <AIGridMesh className="z-5" />
      
      <MaritimeWaves className="z-10" />
      
      <div className="absolute inset-0 hero-gradient opacity-70 z-10 bg-transparent"></div>
      
      <HeroIcons isVisible={props.isMarHero || false} />
      
      <HeroContent {...props} />
      
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
