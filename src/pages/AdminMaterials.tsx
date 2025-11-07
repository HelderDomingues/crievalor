
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { useToast } from "@/hooks/use-toast";
import MaterialForm from "@/components/admin/MaterialForm";
import MaterialsList from "@/components/admin/MaterialsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Material } from "@/pages/MaterialExclusivo";
import AdminAuth from "@/components/admin/AdminAuth";

const AdminMaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMaterials();
    }
  }, [isAuthenticated]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseExtended
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMaterials(data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Erro ao carregar materiais",
        description: "Não foi possível carregar a lista de materiais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaterialAdded = () => {
    fetchMaterials();
    toast({
      title: "Material adicionado",
      description: "O material foi adicionado com sucesso.",
    });
  };

  const handleMaterialDeleted = async (id: string) => {
    try {
      const { error } = await supabaseExtended
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from state
      setMaterials(materials.filter(material => material.id !== id));
      
      toast({
        title: "Material excluído",
        description: "O material foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Erro ao excluir material",
        description: "Não foi possível excluir o material.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Administração de Materiais</h1>
          
          <AdminAuth onAuthenticated={() => setIsAuthenticated(true)}>
            {isAuthenticated && (
              <Tabs defaultValue="list" className="space-y-8">
                <TabsList>
                  <TabsTrigger value="list">Lista de Materiais</TabsTrigger>
                  <TabsTrigger value="add">Adicionar Material</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <MaterialsList 
                    materials={materials} 
                    onDelete={handleMaterialDeleted} 
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="add">
                  <MaterialForm onMaterialAdded={handleMaterialAdded} />
                </TabsContent>
              </Tabs>
            )}
          </AdminAuth>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminMaterialsPage;
