import React from "react";
import { Brain, BarChart3, Zap } from "lucide-react";
interface HeroIconsProps {
  isVisible: boolean;
}
const HeroIcons: React.FC<HeroIconsProps> = ({
  isVisible
}) => {
  if (!isVisible) return null;
  return <>
      <div className="absolute top-1/4 left-10 md:left-20 z-20 animate-float opacity-20 hidden md:block">
        
      </div>
      <div className="absolute bottom-1/4 right-10 md:right-20 z-20 animate-float opacity-20 hidden md:block" style={{
      animationDelay: "1s"
    }}>
        
      </div>
      <div className="absolute top-2/3 left-1/4 z-20 animate-float opacity-20 hidden md:block" style={{
      animationDelay: "2s"
    }}>
        <Zap size={60} className="text-primary" />
      </div>
    </>;
};
export default HeroIcons;