
import React from "react";
import { ChevronDown } from "lucide-react";

const ScrollIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce">
      <div className="w-10 h-10 rounded-full border-2 border-muted-foreground flex justify-center items-center">
        <ChevronDown className="h-5 w-5 text-muted-foreground animate-pulse-subtle" />
      </div>
    </div>
  );
};

export default ScrollIndicator;
