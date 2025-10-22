import React from "react";
import { ChevronDown } from "lucide-react";

const ScrollIndicator: React.FC = () => {
  const handleScrollDown = () => {
    // Scroll to the next section (client logos section)
    const nextSection = document.getElementById('clientes');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll one viewport height
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleScrollDown}
      className="fixed bottom-10 left-0 right-0 mx-auto w-fit z-30 animate-bounce cursor-pointer group"
      aria-label="Rolar para a próxima seção"
    >
      <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm border-2 border-white/30 flex justify-center items-center group-hover:bg-white/10 group-hover:border-white/50 transition-all duration-300">
        <ChevronDown className="h-8 w-8 text-white animate-pulse-subtle group-hover:scale-110 transition-transform" />
      </div>
    </button>
  );
};

export default ScrollIndicator;
