
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface PortfolioAdminLoginProps {
  onLogin: () => void;
}

const PortfolioAdminLogin: React.FC<PortfolioAdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple auth - in a real app, this would be handled by a secure backend
    if (username === "admin" && password === "crie2024") {
      localStorage.setItem("adminAuthenticated", "true");
      onLogin();
      toast({
        title: "Login bem sucedido",
        description: "Bem-vindo ao painel de administração."
      });
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário ou senha incorretos.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Login Administrativo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Usuário</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" size="lg">
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default PortfolioAdminLogin;
