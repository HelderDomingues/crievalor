
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldAlert, Lock } from "lucide-react";

const ADMIN_PASSWORD = "crie2024"; // Password for admin auth in production environment

interface AdminAuthProps {
  onAuthenticated: () => void;
  redirectPath?: string;
  children?: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ 
  onAuthenticated,
  redirectPath = "/admin-setup",
  children
}) => {
  // Supabase auth
  const { user } = useAuth();
  const { isAdmin, rolesLoading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Legacy portfolio admin auth
  const [legacyPassword, setLegacyPassword] = useState("");
  const [isLegacyLoading, setIsLegacyLoading] = useState(false);
  const [showLegacyLogin, setShowLegacyLogin] = useState(false);
  
  useEffect(() => {
    // Check if the user is already authenticated in legacy portfolio admin
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  useEffect(() => {
    // If the user is an admin in Supabase, authenticate them
    if (isAdmin && !rolesLoading) {
      onAuthenticated();
    }
  }, [isAdmin, rolesLoading, onAuthenticated]);

  const handleLegacyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLegacyLoading(true);
    
    // Legacy auth logic - simple password check
    if (legacyPassword === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuthenticated", "true");
      setIsLegacyLoading(false);
      toast({
        title: "Login bem sucedido",
        description: "Bem-vindo ao painel de administração."
      });
      onAuthenticated();
    } else {
      setIsLegacyLoading(false);
      toast({
        title: "Erro de autenticação",
        description: "Senha incorreta.",
        variant: "destructive"
      });
    }
  };

  // If already authenticated through Supabase or loading, show loading state
  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Verificando permissões...</p>
      </div>
    );
  }

  // If not an admin and not authenticated legacy, show login options
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>Acesso administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>É necessário fazer login para acessar esta área.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/auth", { state: { returnUrl: window.location.pathname } })}>
                Ir para login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
                Permissão necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sua conta não possui permissões de administrador.</p>
              <p className="mt-2 text-sm text-gray-500">Se você é um administrador, por favor entre em contato com outro administrador para obter acesso.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                Voltar para a Home
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Legacy authentication option - only show to admins */}
        {user && showLegacyLogin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Login Legado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLegacyLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="legacy-password">Senha de administrador</Label>
                  <Input
                    id="legacy-password"
                    type="password"
                    value={legacyPassword}
                    onChange={(e) => setLegacyPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLegacyLoading}>
                  {isLegacyLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {user && !showLegacyLogin && (
          <div className="text-center">
            <Button variant="ghost" onClick={() => setShowLegacyLogin(true)}>
              Usar método alternativo de login
            </Button>
          </div>
        )}
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AdminAuth;
