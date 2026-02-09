
import React from 'react';
import { cn } from '@/lib/utils';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    className?: string;
}

export const RainbowBordersButton = ({ children, className, ...props }: RainbowButtonProps) => {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <button
                className="rainbow-border relative px-5 h-8 flex items-center justify-center gap-2.5 bg-black rounded-xl border-none text-white cursor-pointer font-black transition-all duration-200"
                {...props}
            >
                {children || "Button"}
            </button>

            <style>{`
        .rainbow-border::before,
        .rainbow-border::after {
          content: '';
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 12px;
          background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ff0000, #fb0094, #0000ff, #00ff00, #ff0000);
          background-size: 300%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: -1;
          animation: rainbow 20s linear infinite;
        }
        .rainbow-border::after {
          filter: blur(10px); /* Reduced from 50px to keep it cleaner in small headers */
          opacity: 0.6;
        }
        @keyframes rainbow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
        </div>
    );
};
