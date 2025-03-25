
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { subscriptionService } from "@/services/subscriptionService";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { useToast } from "@/hooks/use-toast";
import MaterialCard from "@/components/materials/MaterialCard";
import MaterialFilters from "@/components/materials/MaterialFilters";
import MaterialSkeleton from "@/components/materials/MaterialSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  plan_level: string;
  access_count: number;
}

const MaterialExclusivoPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { returnUrl: "/material-exclusivo" } });
      return;
    }

    const checkSubscription = async () => {
      try {
        const hasActive = await subscriptionService.hasActiveSubscription();
        setHasSubscription(hasActive);
        
        if (hasActive) {
          const subscription = await subscriptionService.getCurrentSubscription();
          const plan = subscription ? subscriptionService.getPlanFromId(subscription.plan_id) : null;
          setCurrentPlan(plan?.id || null);
          fetchMaterials();
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user, navigate]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      
      let query = supabaseExtended
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (activeFilter !== "todos") {
        query = query.eq('category', activeFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setMaterials(data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Erro ao carregar materiais",
        description: "Não foi possível carregar os materiais. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    fetchMaterials();
  };

  const handleAccessMaterial = async (materialId: string) => {
    try {
      // Record the access
      await supabaseExtended
        .from('material_accesses')
        .insert([
          { material_id: materialId, user_id: user?.id }
        ]);
        
      // Update the material's access count
      await supabaseExtended
        .rpc('increment_material_access_count', { material_id: materialId });
        
      // Get the material details
      const { data } = await supabaseExtended
        .from('materials')
        .select('file_url')
        .eq('id', materialId)
        .single();
        
      if (data && data.file_url) {
        window.open(data.file_url, '_blank');
      }
    } catch (error) {
      console.error("Error accessing material:", error);
      toast({
        title: "Erro ao acessar material",
        description: "Não foi possível acessar o material. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getFilteredMaterials = () => {
    // Filter materials by user's plan level access
    if (!currentPlan) return [];
    
    const planLevels: Record<string, number> = {
      'basic_plan': 1,
      'pro_plan': 2,
      'enterprise_plan': 3
    };
    
    const userPlanLevel = planLevels[currentPlan] || 0;
    
    return materials.filter(material => {
      const materialPlanLevel = planLevels[material.plan_level] || 0;
      return materialPlanLevel <= userPlanLevel;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Material Exclusivo</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <MaterialSkeleton key={index} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Material Exclusivo</h1>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Acesso Restrito</CardTitle>
                <CardDescription>
                  Este conteúdo é exclusivo para assinantes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Assinatura Necessária</AlertTitle>
                  <AlertDescription>
                    Para acessar o material exclusivo, é necessário ter uma assinatura ativa.
                  </AlertDescription>
                </Alert>
                <Button asChild>
                  <a href="/subscription">Ver Planos de Assinatura</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredMaterials = getFilteredMaterials();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Material Exclusivo</h1>
              <p className="text-muted-foreground">
                Acesse conteúdos exclusivos para assinantes
              </p>
            </div>
            <MaterialFilters 
              activeFilter={activeFilter} 
              onFilterChange={handleFilterChange}
            />
          </div>

          {filteredMaterials.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum material encontrado</CardTitle>
                <CardDescription>
                  Não há materiais disponíveis para os filtros selecionados.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Novos materiais serão adicionados em breve. Fique de olho!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onAccess={() => handleAccessMaterial(material.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MaterialExclusivoPage;
