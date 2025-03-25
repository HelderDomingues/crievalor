
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Mostrar toast de confirmação
    toast({
      title: "Assinatura realizada com sucesso!",
      description: "Bem-vindo ao seu novo plano.",
      variant: "default",
    });
  }, [toast]);

  const handleContinue = () => {
    navigate("/subscription");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Pagamento confirmado!</h1>
            
            <p className="text-muted-foreground mb-8">
              Seu pagamento foi processado com sucesso e sua assinatura está ativa.
              Você já pode começar a aproveitar todos os benefícios do seu plano.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleContinue}
              className="gap-2"
            >
              Ver minha assinatura
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
