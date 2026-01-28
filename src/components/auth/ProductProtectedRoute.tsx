import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProductAccess } from "@/hooks/useProductAccess";
import { useProfile } from "@/hooks/useProfile";

interface ProductProtectedRouteProps {
    children: React.ReactNode;
    productSlug: string;
}

const ProductProtectedRoute: React.FC<ProductProtectedRouteProps> = ({
    children,
    productSlug,
}) => {
    const { user, isLoading: authLoading } = useAuth();
    const { isAdmin, isLoading: profileLoading } = useProfile();
    const { hasProductAccess, isLoading: accessLoading } = useProductAccess();
    const location = useLocation();

    const isLoading = authLoading || profileLoading || accessLoading;

    // Enquanto carrega, mostra spinner centralizado
    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Se não estiver logado, vai para auth
    if (!user) {
        return <Navigate to="/auth" state={{ returnUrl: location.pathname }} replace />;
    }

    // Admins e owners sempre têm acesso a tudo
    if (isAdmin) {
        return <>{children}</>;
    }

    // Verificar se o usuário tem acesso ativo ao produto
    if (!hasProductAccess(productSlug)) {
        console.warn(`Acesso negado ao produto: ${productSlug} para o usuário: ${user.id}`);

        // Redireciona para o dashboard com estado indicando o acesso negado
        return <Navigate to="/dashboard" replace state={{ accessDenied: productSlug }} />;
    }

    return <>{children}</>;
};

export default ProductProtectedRoute;
