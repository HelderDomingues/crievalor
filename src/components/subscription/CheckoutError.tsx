
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CheckoutErrorProps {
  error: string;
  className?: string;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ error, className = "" }) => {
  const isMobile = useIsMobile();
  
  if (!error) return null;

  return (
    <Alert 
      variant="destructive" 
      className={`mb-4 fade-in slide-up ${className} ${isMobile ? 'text-sm p-3' : ''}`}
    >
      <AlertCircle className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-2 flex-shrink-0`} />
      <AlertDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default CheckoutError;
