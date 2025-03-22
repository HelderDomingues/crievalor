
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const AuthHeader = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <Link to="/profile">
          <Avatar className="cursor-pointer">
            <AvatarImage src="" alt={user.email || ""} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Link>
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
