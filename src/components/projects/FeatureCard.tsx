
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, color, title, description }: FeatureCardProps) => {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow duration-300">
      <div className={`bg-${color}-500/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
        <Icon className={`text-${color}-500 w-6 h-6`} />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
