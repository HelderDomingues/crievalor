
import React from "react";
import { LucideIcon } from "lucide-react";

interface ProjectCardProps {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  results: string[];
  reversed?: boolean;
}

const ProjectCard = ({ 
  icon: Icon, 
  color, 
  title, 
  description, 
  results, 
  reversed = false 
}: ProjectCardProps) => {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${reversed ? 'md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-1/3">
        <div className={`bg-${color}-500/10 p-6 rounded-2xl`}>
          <Icon className={`w-12 h-12 text-${color}-500`} />
        </div>
      </div>
      
      <div className="w-full md:w-2/3 space-y-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        <ul className="space-y-2">
          {results.map((result, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
              <span>{result}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectCard;
