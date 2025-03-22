
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);
  
  React.useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    const { error } = await updateProfile({
      username,
      avatar_url: avatarUrl,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Perfil atualizado com sucesso!");
    }
    
    setIsUpdating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div>Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <Button variant="destructive" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profile?.username || user?.email}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL do Avatar</Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/seu-avatar.jpg"
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? "Atualizando..." : "Atualizar Perfil"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
