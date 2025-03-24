import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Auth = () => {
  const navigate = useNavigate();
  const {
    user,
    signIn,
    signUp
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const {
      error
    } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const {
      error
    } = await signUp(email, password, username);
    if (error) {
      setError(error.message);
    } else {
      setError("Cadastro realizado com sucesso! Você pode fazer login agora.");
    }
    setIsLoading(false);
  };
  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setError(null);
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">
            Acesso à Plataforma
          </h1>

          <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={switchTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-l-4 border-primary rounded-lg p-6 mb-8 shadow-md bg-zinc-800">
                <p className="text-center font-medium text-zinc-500">
                  <span className="block text-lg mb-2 text-slate-50">Primeira vez aqui?</span>
                  <Button onClick={() => switchTab("register")} className="mt-2 font-semibold bg-primary hover:bg-primary/90 text-white">
                    Comece pelo cadastro
                  </Button>
                </p>
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
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input id="username" type="text" placeholder="Seu nome de usuário" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input id="registerEmail" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Senha</Label>
                  <Input id="registerPassword" type="password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                
                {error && <Alert variant={error.includes("sucesso") ? "default" : "destructive"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Auth;