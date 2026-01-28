import { useQuery } from "@tanstack/react-query";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { useAuth } from "@/context/AuthContext";
import { ProductWithAccess } from "@/types/products";

/**
 * Hook para verificar acesso do usuário a produtos e recursos específicos.
 * Usa React Query para cache e gerenciamento de estado global.
 */
export const useProductAccess = () => {
    const { user } = useAuth();

    // Buscar todos os produtos que o usuário possui com status de acesso
    const { data: userProducts = [], isLoading, error } = useQuery({
        queryKey: ["user-products", user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabaseExtended.rpc("get_user_products", {
                p_user_id: user.id,
            });

            if (error) throw error;
            return data as ProductWithAccess[];
        },
        enabled: !!user,
    });

    /**
     * Verifica se o usuário tem acesso ativo a um produto pelo slug.
     */
    const hasProductAccess = (productSlug: string): boolean => {
        return userProducts.some(
            (p) => p.slug === productSlug && p.has_access
        );
    };

    /**
     * Verifica se o usuário tem acesso a um recurso específico.
     * Pode ser verificado por ID (UUID) ou Path (URL).
     */
    const hasResourceAccess = async (
        resourceType: 'material' | 'folder' | 'page' | 'feature' | 'module',
        resourceId?: string,
        resourcePath?: string
    ): Promise<boolean> => {
        if (!user) return false;

        const { data, error } = await supabaseExtended.rpc("user_can_access_resource", {
            p_user_id: user.id,
            p_resource_type: resourceType,
            p_resource_id: resourceId,
            p_resource_path: resourcePath,
        });

        if (error) {
            console.error("Error checking resource access:", error);
            return false;
        }

        return !!data;
    };

    /**
     * Verifica acesso específico para os produtos principais (Shorthands)
     */
    const hasMARAccess = hasProductAccess('mar');
    const hasLUMIAAccess = hasProductAccess('lumia');

    return {
        userProducts,
        isLoading,
        error,
        hasProductAccess,
        hasResourceAccess,
        hasMARAccess,
        hasLUMIAAccess,
    };
};
