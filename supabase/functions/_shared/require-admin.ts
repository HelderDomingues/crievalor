import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { corsHeaders } from "./cors.ts";
import { authorizeAdminRequest } from "./authorize-admin.ts";

type AdminAccess = { client: SupabaseClient; userId: string };

export async function requireAdmin(
  req: Request,
): Promise<AdminAccess | Response> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return errorResponse(500, "Function is not configured");
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const result = await authorizeAdminRequest(
    req.headers.get("Authorization"),
    async (token) => {
      const { data: { user }, error } = await authClient.auth.getUser(token);
      if (error || !user) return null;
      return user.id;
    },
    async (userId) => {
      const { data, error } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .in("role", ["admin", "owner"])
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Admin role lookup failed", error.message);
        throw error;
      }

      return data !== null;
    },
  );

  if (!result.authorized) {
    const message = result.status === 401
      ? "A valid user session is required"
      : result.status === 403
      ? "Admin or owner role required"
      : "Authorization could not be verified";
    return errorResponse(result.status, message);
  }

  return { client: adminClient, userId: result.userId };
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
