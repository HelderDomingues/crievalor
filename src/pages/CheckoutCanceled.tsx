
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckoutCanceled = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mostrar toast de cancelamento
    toast({
      title: "Checkout cancelado",
      description: "O processo de assinatura foi cancelado.",
      variant: "destructive",
    });
  }, [toast]);

  const handleTryAgain = () => {
    navigate("/mar#pricing");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Checkout cancelado</h1>
            
            <p className="text-muted-foreground mb-8">
              O processo de assinatura foi cancelado. Se você encontrou algum problema
              ou tem dúvidas, entre em contato com nossa equipe de suporte.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleTryAgain}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para planos
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutCanceled;
