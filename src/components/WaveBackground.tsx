import React from 'react';

const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.03" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        
        {/* Animated waves */}
        <g>
          <path
            d="M0,300 Q250,200 500,300 T1000,300 L1000,600 L0,600 Z"
            fill="url(#waveGradient1)"
            className="animate-[wave_15s_ease-in-out_infinite]"
          />
          <path
            d="M0,350 Q200,250 400,350 T800,350 Q900,300 1000,350 L1000,600 L0,600 Z"
            fill="url(#waveGradient2)"
            className="animate-[wave_20s_ease-in-out_infinite_reverse]"
          />
          <path
            d="M0,400 Q300,320 600,400 T1000,400 L1000,600 L0,600 Z"
            fill="url(#waveGradient1)"
            className="animate-[wave_25s_ease-in-out_infinite]"
          />
        </g>
      </svg>
      
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(-5%) translateY(-10px);
          }
          50% {
            transform: translateX(5%) translateY(10px);
          }
          75% {
            transform: translateX(-2%) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default WaveBackground;