import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import MaterialCard from "@/components/materials/MaterialCard";
import MaterialSkeleton from "@/components/materials/MaterialSkeleton";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { useToast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Material } from "@/pages/MaterialExclusivo";

const PalestraMateriaisPage: React.FC = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabaseExtended
        .from('materials')
        .select('*')
        .contains('product_types', ['palestras'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMaterials(data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Erro ao carregar materiais",
        description: "Não foi possível carregar os materiais da palestra. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessMaterial = async (materialId: string) => {
    try {
      // Tenta registrar o acesso
      const { error: rpcError } = await (supabaseExtended as any)
        .rpc('increment_material_access_count', { material_id: materialId });
        
      if (rpcError) {
        console.warn('Could not increment access count', rpcError);
      }

      const { data, error } = await (supabaseExtended as any)
        .from('materials')
        .select('file_url')
        .eq('id', materialId)
        .single();

      if (error) throw error;

      if (data && data.file_url) {
        window.open(data.file_url, '_blank');
      }
    } catch (error) {
      console.error("Error accessing material:", error);
      toast({
        title: "Erro ao acessar material",
        description: "Não foi possível acessar o material selecionado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Materiais da Palestra | Crie Valor</title>
        <meta name="description" content="Materiais exclusivos da palestra Como melhorar a gestão da sua empresa na prática." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="absolute inset-0 z-0">
            <VideoBackground />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 bg-slate-900/60 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="inline-flex items-center gap-2 text-white/90 mb-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <BookOpen className="h-5 w-5 text-white" />
                <span className="text-sm font-medium uppercase tracking-wider text-white">Conteúdo Exclusivo</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Como melhorar a gestão da sua empresa na prática
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Escolha os materiais abaixo para fazer o download.
              </p>
            </div>
          </div>
        </section>

        {/* Materials List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <MaterialSkeleton key={index} />
                ))}
              </div>
            ) : materials.length === 0 ? (
              <Card className="max-w-3xl mx-auto border-border bg-card">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-foreground">Nenhum material encontrado</CardTitle>
                  <CardDescription className="text-lg">
                    Ainda não há materiais disponíveis para esta palestra.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-20 w-20 text-muted-foreground/30 mb-6" />
                  <p className="text-center text-muted-foreground text-lg">
                    Os materiais serão adicionados aqui em breve. Fique de olho!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    onAccess={() => handleAccessMaterial(material.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PalestraMateriaisPage;
