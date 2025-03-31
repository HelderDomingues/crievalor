
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CheckoutErrorProps {
  error: string;
  className?: string;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ error, className = "" }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={`mb-4 fade-in slide-up ${className}`}>
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription className="text-sm">
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default CheckoutError;
