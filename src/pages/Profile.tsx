
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { subscriptionService } from "@/services/subscriptionService";
import SubscriptionDetails from "@/components/profile/SubscriptionDetails";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileTabs from "@/components/profile/ProfileTabs";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfileField } = useProfile();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadSubscription = async () => {
      if (user) {
        try {
          setSubscriptionLoading(true);
          const sub = await subscriptionService.getCurrentSubscription();
          setSubscription(sub);
        } catch (error) {
          console.error("Error loading subscription:", error);
        } finally {
          setSubscriptionLoading(false);
        }
      }
    };
    
    loadSubscription();
  }, [user]);

  const handleSaveField = async (field: string, value: string) => {
    console.log(`Saving field ${field} with value:`, value);
    const { error } = await updateProfileField(field, value);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar campo",
        description: error.message
      });
      return Promise.reject(error);
    }
    
    return Promise.resolve();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre os planos para empresas sem CNPJ.");
    window.open(`https://wa.me/5547992150289?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Carregando suas informações...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fix: Convert string values to boolean for isProfileComplete
  const isProfileComplete = !!(
    profile?.full_name && 
    profile?.company_name && 
    profile?.company_address && 
    (profile?.cnpj || profile?.cpf)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <div className="lg:col-span-1">
              <ProfileSidebar 
                profile={profile} 
                user={user} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                isProfileComplete={isProfileComplete} 
                handleSignOut={handleSignOut} 
                subscription={subscription}
              />
            </div>
            
            <div className="lg:col-span-3">
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle>
                    {activeTab === "personal" && "Dados Pessoais"}
                    {activeTab === "company" && "Dados da Empresa"}
                    {activeTab === "social" && "Redes Sociais"}
                    {activeTab === "subscription" && "Assinatura e Financeiro"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "personal" && "Gerencie suas informações pessoais"}
                    {activeTab === "company" && "Gerencie as informações da sua empresa"}
                    {activeTab === "social" && "Gerencie suas redes sociais"}
                    {activeTab === "subscription" && "Gerencie sua assinatura e dados financeiros"}
                  </CardDescription>
                </CardHeader>
                
                {activeTab === "subscription" ? (
                  <CardContent>
                    <SubscriptionDetails />
                  </CardContent>
                ) : (
                  <ProfileTabs 
                    activeTab={activeTab} 
                    profile={profile} 
                    loading={isLoading} 
                    handleSaveField={handleSaveField} 
                    openWhatsApp={openWhatsApp} 
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
