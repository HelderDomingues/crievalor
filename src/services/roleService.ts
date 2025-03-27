
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
 */
export async function assignUserRole(userId: string, roleName: string) {
  try {
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
 */
export async function removeUserRole(userId: string, roleName: string) {
  try {
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
