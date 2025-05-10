
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  iconAriaLabel?: string;  // Added iconAriaLabel prop as optional
}

const FeatureCard = ({ icon: Icon, title, description, index, iconAriaLabel }: FeatureCardProps) => {
  // Calculation for staggered animation
  const delay = (index * 0.1) + 0.3;
  
  return (
    <div 
      className="bg-card rounded-xl p-6 glass-card hover:glow-border transition-all duration-300 transform hover:-translate-y-1"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="text-primary h-6 w-6" aria-label={iconAriaLabel} />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
