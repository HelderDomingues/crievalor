
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, UserPlus, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is already signed in
  useEffect(() => {
    if (user) {
      const selectedPlanId = localStorage.getItem('selectedPlanId');
      if (selectedPlanId) {
        localStorage.removeItem('selectedPlanId');
        navigate(`/checkout?plan=${selectedPlanId}`);
      } else {
        const state = location.state as { returnUrl?: string };
        navigate(state?.returnUrl || "/dashboard");
      }
    }
  }, [user, navigate, location.state]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("Erro inesperado durante o login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error, data } = await signUp(signUpEmail, signUpPassword, username, fullName);

      if (error) {
        setError(error.message);
      } else if (data?.user) {
        // Update user metadata with company name if needed or handle via profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ company_name: companyName })
          .eq('id', data.user.id);

        if (profileError) console.error("Error updating profile with company name:", profileError);

        toast({
          title: "Conta criada!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
        });
      }
    } catch (err) {
      console.error("Unexpected error during sign up:", err);
      setError("Erro inesperado durante o cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#010816]">
      <Header />

      <main className="flex-grow py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              Plataforma Crie Valor
            </h1>
            <p className="text-gray-400">
              Sua inteligência organizacional em um só lugar
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full bg-[#1a2e4c]/30 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#010816]/50 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="bg-[#010816]/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" title="Senha" className="text-gray-300">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="bg-[#010816]/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  />
                </div>

                {error && <Alert variant="destructive" className="bg-red-950/20 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}

                <Button type="submit" className="w-full h-12 text-md font-semibold mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Processando..." : "Entrar na conta"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname" className="text-gray-300">Nome Completo</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="Ex: João Silva"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="bg-[#010816]/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-gray-300">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Ex: joaosilva"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="bg-[#010816]/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    required
                    className="bg-[#010816]/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" title="Senha" className="text-gray-300">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    required
                    className="bg-[#010816]/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  />
                </div>

                {error && <Alert variant="destructive" className="bg-red-950/20 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}

                <Button type="submit" className="w-full h-12 text-md font-semibold mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar minha conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center mt-8 text-sm text-gray-500">
            Ao continuar, você concorda com nossos <a href="/termos-de-servico" className="text-primary hover:underline">Termos</a> e <a href="/politica-de-privacidade" className="text-primary hover:underline">Privacidade</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
