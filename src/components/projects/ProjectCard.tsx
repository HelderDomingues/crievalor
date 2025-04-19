
import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  results: string[];
  reversed?: boolean;
}

const ProjectCard = ({ icon: Icon, color, title, description, results, reversed }: ProjectCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`${reversed ? 'order-2 md:order-1' : ''} p-8`}>
          <div className={`bg-${color}-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
            <Icon className={`text-${color}-500 h-6 w-6`} />
          </div>
          <h3 className="text-2xl font-medium mb-3">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <h4 className="font-medium mb-2">Resultados:</h4>
          <ul className="space-y-2 mb-6">
            {results.map((result, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                  <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">{result}</p>
              </li>
            ))}
          </ul>
          
          <Button variant="outline" size="sm">Ver Detalhes</Button>
        </div>
        
        <div className={`${reversed ? 'order-1 md:order-2' : ''} bg-secondary/20 flex items-center justify-center p-8`}>
          <div className={`bg-${color}-500/10 p-8 rounded-full`}>
            <Icon className={`h-16 w-16 text-${color}-500 opacity-70`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
