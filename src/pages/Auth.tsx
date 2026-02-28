
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
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
  const { profile, isLoading: profileLoading } = useProfile();
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
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is already signed in
  useEffect(() => {
    if (user && !profileLoading) {
      const params = new URLSearchParams(location.search);
      const planFromUrl = params.get('plan');

      const effectivePlanId = localStorage.getItem('selectedPlanId') || localStorage.getItem('checkoutPlanId') || planFromUrl;
      const checkoutIntent = localStorage.getItem('checkoutIntent');

      if (effectivePlanId) {
        // Handle checkout/trial intent first
        if (effectivePlanId === 'basico' && checkoutIntent === 'trial') {
          localStorage.removeItem('selectedPlanId');
          localStorage.removeItem('checkoutIntent');
          navigate('/lumia/sucesso');
        } else {
          localStorage.removeItem('selectedPlanId');
          localStorage.removeItem('checkoutIntent');
          navigate(`/checkout?plan=${effectivePlanId}`);
        }
        return; // Important: stop execution here
      }

      // If no pending checkout, handle normal login flow
      const state = location.state as { returnUrl?: string };
      if (state?.returnUrl) {
        navigate(state.returnUrl);
        return;
      }

      // Logic for LUMIA vs Materials
      const status = (profile as any)?.subscription_status;
      if (status === 'trialing' || status === 'active') {
        navigate('/lumia/dashboard');
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, profile, profileLoading, navigate, location.state, location.search]);

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

    // Get plan from search params if present
    const params = new URLSearchParams(location.search);
    const planFromUrl = params.get('plan');

    if (!termsAccepted) {
      setError("Você precisa ler e aceitar os Termos de Serviço e a Política de Privacidade para criar uma conta.");
      setIsLoading(false);
      return;
    }

    try {
      const { error, data } = await signUp(signUpEmail, signUpPassword, username, fullName);

      if (error) {
        setError(error.message);
      } else if (data?.user) {
        if (planFromUrl) {
          localStorage.setItem('selectedPlanId', planFromUrl);
        }

        // Update user metadata with company name and terms acceptance
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            company_name: companyName,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (profileError) console.error("Error updating profile:", profileError);

        // Fetch Lumia Basico Product ID
        const { data: productData } = await (supabase as any)
          .from('products')
          .select('id')
          .eq('slug', 'lumia-basico')
          .single();

        if (productData) {
          // Grant access to Lumia Basico on signup
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // 7-day trial example limit

          await (supabase as any).from('user_products').insert({
            user_id: data.user.id,
            product_id: productData.id,
            access_granted_at: new Date().toISOString(),
            access_expires_at: expiresAt.toISOString(),
            status: 'active',
            notes: 'Atribuição automática após cadastro (Trial 7 dias)'
          });
        }

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

                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-[#010816]/50 text-primary focus:ring-primary focus:ring-offset-0"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-400 font-normal leading-tight cursor-pointer">
                    Li e aceito o <a href="/termos-de-servico" target="_blank" className="text-primary hover:underline">Contrato de Licença de Uso (Termos de Serviço)</a> e a <a href="/politica-de-privacidade" target="_blank" className="text-primary hover:underline">Política de Privacidade</a>.
                  </Label>
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

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
