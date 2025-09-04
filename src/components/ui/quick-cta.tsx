import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickCTAProps {
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  isExternal?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  icon?: React.ReactNode;
  centerAlign?: boolean;
}

const QuickCTA: React.FC<QuickCTAProps> = ({
  title,
  description,
  ctaText,
  ctaUrl,
  isExternal = false,
  variant = "default",
  size = "default",
  className,
  icon,
  centerAlign = false
}) => {
  const buttonContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {ctaText}
      {isExternal ? (
        <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
      ) : (
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      )}
    </>
  );

  const button = isExternal ? (
    <Button 
      variant={variant} 
      size={size}
      className="shadow-sm hover:shadow-md transition-all duration-300"
      asChild
    >
      <a 
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ctaText}
      >
        {buttonContent}
      </a>
    </Button>
  ) : (
    <Button 
      variant={variant} 
      size={size}
      className="shadow-sm hover:shadow-md transition-all duration-300"
      asChild
    >
      <Link to={ctaUrl} aria-label={ctaText}>
        {buttonContent}
      </Link>
    </Button>
  );

  return (
    <div className={cn(
      "py-8 px-4",
      centerAlign ? "text-center" : "text-left",
      className
    )}>
      <div className="space-y-4">
        <div>
          <h3 className={cn(
            "font-bold text-lg",
            centerAlign ? "mx-auto" : ""
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              "text-muted-foreground mt-2",
              centerAlign ? "mx-auto max-w-md" : ""
            )}>
              {description}
            </p>
          )}
        </div>
        
        <div className={cn(
          centerAlign ? "flex justify-center" : "flex"
        )}>
          {button}
        </div>
      </div>
    </div>
  );
};

export default QuickCTA;