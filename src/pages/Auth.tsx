
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is already signed in, redirect to home or checkout if there's a selected plan
  useEffect(() => {
    if (user) {
      const selectedPlanId = localStorage.getItem('selectedPlanId');
      if (selectedPlanId) {
        // Se tiver um plano selecionado, redirecionar para checkout
        localStorage.removeItem('selectedPlanId'); // Limpar após usar
        navigate(`/checkout?plan=${selectedPlanId}`);
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleChoosePlan = () => {
    console.log("Redirecting to MAR pricing section...");
    // Navigate to the MAR page and scroll to the pricing section
    window.location.href = "/mar#pricing";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">
            Acesso à Plataforma
          </h1>

          <div className="bg-[#1a2e4c] border-l-4 border-primary p-6 mb-8 shadow-md rounded-2xl">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-3 text-white">Não tem uma conta ainda?</h2>
              <p className="text-gray-300 mb-4">
                Para criar uma conta, você precisa primeiro escolher um plano MAR e realizar o pagamento.
              </p>
              <Button 
                onClick={handleChoosePlan} 
                className="mt-2 font-semibold bg-primary hover:bg-primary/90 text-white"
              >
                Escolha um plano para começar
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            
            {error && <Alert variant={error.includes("sucesso") ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
