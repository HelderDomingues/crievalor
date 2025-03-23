
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CheckoutErrorProps {
  error: string;
}

const CheckoutError = ({ error }: CheckoutErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao iniciar checkout</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default CheckoutError;
