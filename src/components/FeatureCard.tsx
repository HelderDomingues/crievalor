
import React from "react";
import { LucideIcon } from "lucide-react";
import EditableText from "./EditableText";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:shadow-primary/5 transition-all hover:border-primary/20 h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="text-primary h-6 w-6" />
      </div>
      
      <EditableText 
        initialText={title}
        as="h3"
        className="text-xl font-semibold mb-3"
      />
      
      <EditableText 
        initialText={description}
        as="p"
        className="text-muted-foreground"
      />
    </div>
  );
};

export default FeatureCard;
