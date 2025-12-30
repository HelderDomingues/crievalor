
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "user" | "admin" | "owner";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, isLoading: authLoading } = useAuth();
    const { profile, isAdmin, rolesLoading, isLoading: profileLoading } = useProfile();
    const location = useLocation();

    const isLoading = authLoading || profileLoading || rolesLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#010816]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the current location to return to after login
        return <Navigate to="/auth" state={{ returnUrl: location.pathname }} replace />;
    }

    // Role based access control
    if (requiredRole) {
        if (requiredRole === "admin" && !isAdmin) {
            return <Navigate to="/dashboard" replace />;
        }

        // Additional role checks can be added here if needed
        // For now isAdmin handles admin/owner
    }

    return <>{children}</>;
};

export default ProtectedRoute;
