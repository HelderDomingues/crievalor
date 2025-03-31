
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, User, Briefcase, Globe, CreditCard, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AvatarUpload from "@/components/AvatarUpload";
import { UserProfile } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/types/subscription";

interface ProfileSidebarProps {
  profile: UserProfile | null;
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isProfileComplete: boolean;
  handleSignOut: () => void;
  subscription?: Subscription | null;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  user,
  activeTab,
  setActiveTab,
  isProfileComplete,
  handleSignOut,
  subscription
}) => {
  const navigate = useNavigate();
  
  // Handle subscription tab click with navigation
  const handleSubscriptionClick = () => {
    setActiveTab("subscription");
    navigate("/subscription?tab=details");
  };
  
  const hasActiveSubscription = subscription && ["active", "ACTIVE", "trialing"].includes(subscription.status);
  
  return (
    <Card className="bg-card border-0 shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <AvatarUpload 
            avatarUrl={profile?.avatar_url || null} 
            username={profile?.username || null}
          />
          
          <div className="mt-4 text-center">
            <h3 className="font-medium">{profile?.full_name || user?.email}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            
            {hasActiveSubscription && (
              <Badge className="mt-2 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Assinante
              </Badge>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {!isProfileComplete && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete seu perfil para continuar
            </AlertDescription>
          </Alert>
        )}
        
        <nav className="flex flex-col space-y-1">
          <Button 
            variant={activeTab === "personal" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("personal")}
          >
            <User className="mr-2 h-4 w-4" />
            Dados Pessoais
          </Button>
          <Button 
            variant={activeTab === "company" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("company")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Dados da Empresa
          </Button>
          <Button 
            variant={activeTab === "social" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("social")}
          >
            <Globe className="mr-2 h-4 w-4" />
            Redes Sociais
          </Button>
          <Button 
            variant={activeTab === "subscription" ? "default" : "ghost"} 
            className={`justify-start ${hasActiveSubscription ? "text-green-600 hover:text-green-700 hover:bg-green-50/50" : ""}`}
            onClick={handleSubscriptionClick}
          >
            <CreditCard className={`mr-2 h-4 w-4 ${hasActiveSubscription ? "text-green-600" : ""}`} />
            Assinatura
            {hasActiveSubscription && <CheckCircle className="ml-2 h-3 w-3 text-green-600" />}
          </Button>
        </nav>

        <Separator className="my-4" />
        
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          Sair
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
