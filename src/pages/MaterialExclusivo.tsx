import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
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
import { FolderBreadcrumb } from "@/components/materials/FolderBreadcrumb";
import { MaterialFolderView } from "@/components/materials/MaterialFolderView";
import { MaterialFolder } from "@/types/materialFolder";


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
  folder_id?: string | null;
}

const MaterialExclusivoPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [folders, setFolders] = useState<MaterialFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeFilter, setActiveFilter] = useState("todos");


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

      const { data: materialsData, error: materialsError } = await query;

      const { data: foldersData, error: foldersError } = await (supabaseExtended as any)
        .from('material_folders')
        .select('*')
        .order('order_number');

      if (materialsError) throw materialsError;
      // foldersError might happen if table doesn't exist yet or permission denied, handle gracefully
      if (foldersError) console.warn("Error fetching folders", foldersError);

      setMaterials(materialsData || []);
      setFolders((foldersData as any) || []);
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
    setCurrentFolderId(null); // Reset to root or handle filter behavior
    fetchMaterials();
  };

  const handleAccessMaterial = async (materialId: string) => {
    try {
      // Record the access
      await (supabaseExtended as any)
        .from('material_accesses')
        .insert([
          { material_id: materialId, user_id: user?.id }
        ]);

      // Update the material's access count
      await (supabaseExtended as any)
        .rpc('increment_material_access_count', { material_id: materialId });

      // Get the material details
      const { data } = await (supabaseExtended as any)
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
    // Return all materials since we now have a single tier access
    return materials;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Material Exclusivo para Assinantes MAR | Crie Valor</title>
          <meta name="description" content="Acesse materiais exclusivos com sua assinatura MAR. Conteúdos estratégicos, templates e ferramentas para impulsionar seu negócio." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <BreadcrumbSchema
          items={[
            { name: "Home", url: "https://crievalor.com.br" },
            { name: "Material Exclusivo", url: "https://crievalor.com.br/material-exclusivo" }
          ]}
        />

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
                  <a href="/lumia">Ver Planos de Assinatura</a>
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
            <div className="space-y-6">
              {activeFilter === "todos" ? (
                <>
                  <div className="flex justify-between items-center bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
                    <FolderBreadcrumb
                      currentFolderId={currentFolderId}
                      folders={folders}
                      onNavigate={setCurrentFolderId}
                    />
                  </div>

                  <MaterialFolderView
                    currentFolderId={currentFolderId}
                    folders={folders}
                    materials={materials}
                    onNavigate={setCurrentFolderId}
                    onAccessMaterial={(m) => handleAccessMaterial(m.id)}
                  />
                </>
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MaterialExclusivoPage;
