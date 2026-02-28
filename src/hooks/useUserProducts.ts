import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { Product, UserProductWithDetails, AssignProductFormData } from "@/types/products";
import { toast } from "sonner";

/**
 * Hook para gerenciamento administrativo de produtos e usuários.
 * Permite listar produtos, listar vínculos e atribuir acessos.
 */
export const useUserProducts = (userId?: string) => {
    const queryClient = useQueryClient();

    // Listar todos os produtos disponíveis no catálogo
    const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ["all-products"],
        queryFn: async () => {
            const { data, error } = await supabaseExtended
                .from("products")
                .select("*")
                .eq("is_active", true)
                .order("name");

            if (error) throw error;
            return data as Product[];
        },
    });

    // Listar produtos de um usuário específico
    const { data: userProducts = [], isLoading: isLoadingUserProducts } = useQuery({
        queryKey: ["admin-user-products", userId],
        queryFn: async () => {
            if (!userId) return [];

            const { data, error } = await supabaseExtended
                .from("user_products")
                .select("*, product:products(*)")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as any as UserProductWithDetails[];
        },
        enabled: !!userId,
    });

    // Mutação para atribuir um produto a um usuário
    const assignProduct = useMutation({
        mutationFn: async (data: AssignProductFormData) => {
            const { error } = await (supabaseExtended.from("user_products") as any).insert([
                {
                    user_id: data.user_id,
                    product_id: data.product_id,
                    access_expires_at: data.access_expires_at,
                    notes: data.notes,
                    status: 'active'
                },
            ]);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-user-products", userId] });
            queryClient.invalidateQueries({ queryKey: ["user-products", userId] });
            toast.success("Produto atribuído com sucesso!");
        },
        onError: (error) => {
            console.error("Error assigning product:", error);
            toast.error("Erro ao atribuir produto.");
        },
    });

    // Mutação para remover um produto de um usuário (ou cancelar)
    const revokeProduct = useMutation({
        mutationFn: async (userProductId: string) => {
            const { error } = await (supabaseExtended
                .from("user_products") as any)
                .update({ status: 'canceled' })
                .eq("id", userProductId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-user-products", userId] });
            queryClient.invalidateQueries({ queryKey: ["user-products", userId] });
            toast.success("Acesso ao produto cancelado.");
        },
        onError: (error) => {
            console.error("Error revoking product:", error);
            toast.error("Erro ao cancelar acesso.");
        },
    });

    // Mutação para editar um produto de um usuário
    const updateProduct = useMutation({
        mutationFn: async ({ userProductId, data }: { userProductId: string, data: Partial<AssignProductFormData> & { status?: string } }) => {
            const { error } = await (supabaseExtended
                .from("user_products") as any)
                .update({
                    access_expires_at: data.access_expires_at,
                    notes: data.notes,
                    status: data.status,
                })
                .eq("id", userProductId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-user-products", userId] });
            queryClient.invalidateQueries({ queryKey: ["user-products", userId] });
            toast.success("Produto atualizado com sucesso!");
        },
        onError: (error) => {
            console.error("Error updating product:", error);
            toast.error("Erro ao atualizar produto.");
        },
    });

    return {
        allProducts,
        userProducts,
        isLoading: isLoadingProducts || (!!userId && isLoadingUserProducts),
        assignProduct: assignProduct.mutate,
        isAssigning: assignProduct.isPending,
        revokeProduct: revokeProduct.mutate,
        isRevoking: revokeProduct.isPending,
        updateProduct: updateProduct.mutate,
        isUpdating: updateProduct.isPending,
    };
};
