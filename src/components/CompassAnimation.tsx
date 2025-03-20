
import React, { useEffect, useRef } from "react";

interface CompassAnimationProps {
  className?: string;
  size?: number;
}

const CompassAnimation: React.FC<CompassAnimationProps> = ({
  className = "",
  size = 200,
}) => {
  const compassRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const compass = compassRef.current;
    if (!compass) return;
    
    // Add slight rotation animation on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rotation = scrollY * 0.05; // Adjust speed as needed
      compass.style.transform = `rotate(${rotation}deg)`;
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <div 
      ref={compassRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Compass Rose */}
      <svg viewBox="0 0 200 200" width={size} height={size} className="absolute inset-0">
        {/* Outer Circle */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
        
        {/* Inner Circle */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
        
        {/* Directional Points */}
        <g stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1">
          {/* Main Directions */}
          <line x1="100" y1="10" x2="100" y2="30" />
          <line x1="100" y1="170" x2="100" y2="190" />
          <line x1="10" y1="100" x2="30" y2="100" />
          <line x1="170" y1="100" x2="190" y2="100" />
          
          {/* Cardinal Points Text */}
          <text x="100" y="20" textAnchor="middle" fill="rgba(59, 130, 246, 0.8)" fontSize="10" fontWeight="bold">N</text>
          <text x="100" y="185" textAnchor="middle" fill="rgba(59, 130, 246, 0.8)" fontSize="10" fontWeight="bold">S</text>
          <text x="185" y="104" textAnchor="middle" fill="rgba(59, 130, 246, 0.8)" fontSize="10" fontWeight="bold">E</text>
          <text x="15" y="104" textAnchor="middle" fill="rgba(59, 130, 246, 0.8)" fontSize="10" fontWeight="bold">W</text>
          
          {/* Intermediate Directions */}
          <line x1="129" y1="29" x2="139" y2="39" />
          <line x1="171" y1="71" x2="161" y2="61" />
          <line x1="171" y1="129" x2="161" y2="139" />
          <line x1="129" y1="171" x2="139" y2="161" />
          <line x1="71" y1="171" x2="61" y2="161" />
          <line x1="29" y1="129" x2="39" y2="139" />
          <line x1="29" y1="71" x2="39" y2="61" />
          <line x1="71" y1="29" x2="61" y2="39" />
        </g>
        
        {/* Decorative Inner Lines */}
        <g stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5">
          <line x1="100" y1="30" x2="100" y2="170" />
          <line x1="30" y1="100" x2="170" y2="100" />
          <line x1="41" y1="41" x2="159" y2="159" />
          <line x1="41" y1="159" x2="159" y2="41" />
        </g>
        
        {/* Compass Needle */}
        <g>
          {/* North Direction (Primary) */}
          <path d="M100,40 L110,100 L100,90 L90,100 Z" fill="rgba(59, 130, 246, 0.8)" />
          
          {/* South Direction (Secondary) */}
          <path d="M100,160 L110,100 L100,110 L90,100 Z" fill="rgba(255, 255, 255, 0.3)" />
          
          {/* Center Circle */}
          <circle cx="100" cy="100" r="5" fill="rgba(59, 130, 246, 0.8)" />
        </g>
      </svg>
    </div>
  );
};

export default CompassAnimation;
