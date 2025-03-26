
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a user has a specific role
 */
export async function checkUserRole(userId: string, roleName: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", roleName)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return { hasRole: !!data, error: null };
  } catch (error) {
    console.error("Error checking user role:", error);
    return { hasRole: false, error: error as Error };
  }
}

/**
 * Assigns a role to a user
 * For the first admin, it uses the bootstrap function
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

    // For admin role, first attempt to bootstrap if this is the first admin
    if (roleName === 'admin') {
      const { data: bootstrapResult, error: bootstrapError } = await supabase.rpc(
        'bootstrap_admin_role',
        { admin_user_id: userId }
      );
      
      if (bootstrapError) {
        console.error("Bootstrap admin error:", bootstrapError);
        // Continue with normal insertion as fallback
      } else if (bootstrapResult === true) {
        // Bootstrap succeeded
        return { success: true, error: null };
      }
      
      // If bootstrap reported false (already have admins), continue with normal insert
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: roleName
      });

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error assigning user role:", error);
    return { success: false, error: error as Error };
  }
}

/**
 * Removes a role from a user
 */
export async function removeUserRole(userId: string, roleName: string) {
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", roleName);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error removing user role:", error);
    return { success: false, error: error as Error };
  }
}
