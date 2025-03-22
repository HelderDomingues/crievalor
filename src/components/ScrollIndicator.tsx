
import React from "react";

const ScrollIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
      <div className="w-8 h-12 rounded-full border-2 border-muted-foreground flex justify-center items-start p-1">
        <div className="w-1 h-2 bg-muted-foreground rounded-full animate-pulse-subtle"></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
