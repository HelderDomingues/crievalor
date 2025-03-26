
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

    // For admin role, attempt direct bootstrap function call first
    if (roleName === 'admin') {
      try {
        console.log(`Attempting to bootstrap admin role for user: ${userId}`);
        const { data: bootstrapResult, error: bootstrapError } = await supabase.rpc(
          'bootstrap_admin_role',
          { admin_user_id: userId }
        );
        
        if (bootstrapError) {
          console.error("Bootstrap admin error:", bootstrapError);
          // Continue with normal insertion as fallback
        } else if (bootstrapResult === true) {
          console.log("Bootstrap admin function succeeded");
          return { success: true, error: null };
        } else {
          console.log("Bootstrap admin function returned false (admins already exist)");
        }
      } catch (bootstrapError) {
        console.error("Bootstrap admin exception:", bootstrapError);
        // Continue with normal insertion as fallback
      }
    }

    // If bootstrap didn't succeed or wasn't attempted, try normal insertion
    console.log(`Attempting direct insertion of role "${roleName}" for user: ${userId}`);
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: roleName
      });

    if (error) {
      console.error("Error in direct role insertion:", error);
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
