
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a user has a specific role
 */
export async function checkUserRole(userId: string, roleName: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return { hasRole: data?.role === roleName, error: null };
  } catch (error) {
    console.error("Error checking user role:", error);
    return { hasRole: false, error: error as Error };
  }
}

/**
 * Assigns a role to a user by updating their profile
 * Only admin users can assign roles to others, with additional security checks
 */
export async function assignUserRole(userId: string, roleName: string) {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        success: false, 
        error: new Error("Você precisa estar autenticado para realizar esta operação") 
      };
    }
    
    // If not assigning to self, check if the current user is an admin
    if (user.id !== userId) {
      const { hasRole, error: checkError } = await checkUserRole(user.id, 'admin');
      
      if (checkError) {
        throw checkError;
      }
      
      if (!hasRole) {
        return { 
          success: false, 
          error: new Error("Apenas administradores podem atribuir funções a outros usuários") 
        };
      }
    } else {
      // If user is trying to self-assign admin role, prevent it
      if (roleName === 'admin') {
        return { 
          success: false, 
          error: new Error("Você não pode se auto-atribuir privilégios de administrador") 
        };
      }
    }
    
    // First check if the user already has this role
    const { hasRole, error: checkError } = await checkUserRole(userId, roleName);
    
    if (checkError) {
      throw checkError;
    }
    
    // If the user already has the role, return early
    if (hasRole) {
      return { success: true, error: null };
    }

    // Update the user's profile with the new role
    const { error } = await supabase
      .from("profiles")
      .update({ role: roleName })
      .eq("id", userId);

    if (error) {
      // Check if it's an RLS error and provide a more user-friendly message
      if (error.message && error.message.includes("row-level security")) {
        console.error("RLS policy error in role update:", error);
        return { 
          success: false, 
          error: new Error("Você não tem permissão para atribuir esta função. Contate o administrador do sistema.") 
        };
      }
      
      console.error("Error in profile role update:", error);
      throw error;
    }

    console.log(`Successfully assigned role "${roleName}" to user: ${userId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error assigning user role:", error);
    return { success: false, error: error as Error };
  }
}

/**
 * Removes a role from a user by setting it to the default 'user' role
 * Only admin users can remove roles from others
 */
export async function removeUserRole(userId: string, roleName: string) {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        success: false, 
        error: new Error("Você precisa estar autenticado para realizar esta operação") 
      };
    }
    
    // If not removing from self, check if the current user is an admin
    if (user.id !== userId) {
      const { hasRole, error: checkError } = await checkUserRole(user.id, 'admin');
      
      if (checkError) {
        throw checkError;
      }
      
      if (!hasRole) {
        return { 
          success: false, 
          error: new Error("Apenas administradores podem remover funções de outros usuários") 
        };
      }
    }
    
    // Only proceed if the user actually has this role
    const { hasRole, error: checkError } = await checkUserRole(userId, roleName);
    
    if (checkError) {
      throw checkError;
    }
    
    // If the user doesn't have this role, return early
    if (!hasRole) {
      return { success: true, error: null };
    }

    // Reset the user's role to 'user'
    const { error } = await supabase
      .from("profiles")
      .update({ role: 'user' })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error removing user role:", error);
    return { success: false, error: error as Error };
  }
}

/**
 * Get all admin users
 * Only accessible by admins
 */
export async function getAdminUsers() {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        data: null, 
        error: new Error("Você precisa estar autenticado para realizar esta operação") 
      };
    }
    
    // Check if the current user is an admin
    const { hasRole, error: checkError } = await checkUserRole(user.id, 'admin');
    
    if (checkError) {
      throw checkError;
    }
    
    if (!hasRole) {
      return { 
        data: null, 
        error: new Error("Apenas administradores podem visualizar outros administradores") 
      };
    }
    
    // Get all admin users
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, full_name, email")
      .eq("role", "admin");
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error getting admin users:", error);
    return { data: null, error: error as Error };
  }
}
