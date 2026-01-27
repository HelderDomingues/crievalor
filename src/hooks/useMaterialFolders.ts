import { useState, useEffect } from "react";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { MaterialFolder, FolderTreeNode } from "@/types/materialFolder";
import { useToast } from "@/hooks/use-toast";
import { buildFolderTree } from "@/utils/folderUtils";

export const useMaterialFolders = () => {
    const [folders, setFolders] = useState<FolderTreeNode[]>([]);
    const [folderTree, setFolderTree] = useState<FolderTreeNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchFolders = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await (supabaseExtended as any)
                .from("material_folders")
                .select("*")
                .order("order_number", { ascending: true });

            if (error) throw error;

            const typedData = data as MaterialFolder[];
            setFolders(typedData as any);
            setFolderTree(buildFolderTree(typedData));
        } catch (error: any) {
            console.error("Erro ao buscar pastas:", error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar pastas",
                description: "Não foi possível carregar a estrutura de pastas.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    const createFolder = async (folder: Partial<MaterialFolder> & { name: string }) => {
        try {
            const { data, error } = await (supabaseExtended as any)
                .from("material_folders")
                .insert([folder])
                .select()
                .single();

            if (error) throw error;

            toast({ title: "Pasta criada com sucesso" });
            await fetchFolders();
            return data;
        } catch (error: any) {
            console.error("Erro ao criar pastas:", error);
            toast({
                variant: "destructive",
                title: "Erro ao criar pasta",
                description: error.message || "Erro desconhecido",
            });
        }
    };

    const updateFolder = async (id: string, updates: Partial<MaterialFolder>) => {
        try {
            const { error } = await (supabaseExtended as any)
                .from("material_folders")
                .update(updates)
                .eq("id", id);

            if (error) throw error;

            toast({ title: "Pasta atualizada" });
            await fetchFolders();
        } catch (error: any) {
            console.error("Erro ao atualizar pastas:", error);
            toast({
                variant: "destructive",
                title: "Erro ao atualizar pasta",
                description: error.message || "Erro desconhecido",
            });
        }
    };

    const deleteFolder = async (id: string) => {
        try {
            const { error } = await (supabaseExtended as any)
                .from("material_folders")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({ title: "Pasta excluída" });
            await fetchFolders();
        } catch (error: any) {
            console.error("Erro ao deletar pastas:", error);
            toast({
                variant: "destructive",
                title: "Erro ao excluir pasta",
                description: error.message || "Erro desconhecido",
            });
        }
    };

    return {
        folders,
        folderTree,
        isLoading,
        refreshFolders: fetchFolders,
        createFolder,
        updateFolder,
        deleteFolder,
    };
};
