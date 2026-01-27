
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAuth from "@/components/admin/AdminAuth";
import MaterialsList from "@/components/admin/MaterialsList";
import MaterialForm from "@/components/admin/MaterialForm";
import { FolderTreeManager } from "@/components/admin/FolderTreeManager";
import { useToast } from "@/hooks/use-toast";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { Material } from "@/pages/MaterialExclusivo";

const AdminMaterialsManager: React.FC = () => {
    const { toast } = useToast();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    // Fetch materials logic replicated from AdminMaterialsPage
    // We could move this to a hook or keep it here if it's the main container
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

    React.useEffect(() => {
        if (isAuthenticated) {
            fetchMaterials();
        }
    }, [isAuthenticated]);


    const handleMaterialAdded = () => {
        fetchMaterials();
        setActiveTab("list");
        setEditingMaterial(null);
        toast({
            title: editingMaterial ? "Material atualizado" : "Material adicionado",
            description: editingMaterial ? "As alterações foram salvas." : "O material foi adicionado com sucesso.",
        });
    };

    const handleEditMaterial = (material: Material) => {
        setEditingMaterial(material);
        setActiveTab("add");
    };

    const handleCancelEdit = () => {
        setEditingMaterial(null);
        setActiveTab("list");
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
        <AdminAuth onAuthenticated={() => setIsAuthenticated(true)}>
            {isAuthenticated && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList>
                        <TabsTrigger value="list">Lista de Materiais</TabsTrigger>
                        <TabsTrigger value="add">
                            {editingMaterial ? "Editar Material" : "Adicionar Material"}
                        </TabsTrigger>
                        <TabsTrigger value="folders">Gerenciar Pastas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                        <MaterialsList
                            materials={materials}
                            onDelete={handleMaterialDeleted}
                            onEdit={handleEditMaterial}
                            isLoading={isLoading}
                        />
                    </TabsContent>

                    <TabsContent value="add">
                        <MaterialForm
                            onMaterialAdded={handleMaterialAdded}
                            initialData={editingMaterial}
                            onCancel={editingMaterial ? handleCancelEdit : undefined}
                        />
                    </TabsContent>

                    <TabsContent value="folders">
                        <FolderTreeManager
                            materials={materials}
                            onEditMaterial={handleEditMaterial}
                            onDeleteMaterial={handleMaterialDeleted}
                        />
                    </TabsContent>
                </Tabs>
            )}
        </AdminAuth>
    );
};

export default AdminMaterialsManager;
