import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { User, CreditCard, LogOut, Settings, Shield, Palette } from "lucide-react";

const AuthHeader = () => {
  const { user, signOut } = useAuth();
  const { profile, isAdmin, rolesLoading } = useProfile();

  console.log("AuthHeader - User:", user?.id);
  console.log("AuthHeader - Profile:", profile);
  console.log("AuthHeader - isAdmin:", isAdmin);
  console.log("AuthHeader - rolesLoading:", rolesLoading);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || user.email || ""} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50 min-w-[200px] bg-background shadow-md">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/subscription" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Assinaturas</span>
              </Link>
            </DropdownMenuItem>
            
            {isAdmin && !rolesLoading && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Administração</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/admin-setup" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Painel Admin</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-portfolio" className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Portfólio</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-materials" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Materiais</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-webhooks" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Webhooks</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Entrar
          </Button>
        </Link>
      )}
    </div>
  );
};

export default AuthHeader;
