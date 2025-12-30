
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders, status: 204 });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            throw new Error('No authorization header');
        }

        // Verify the caller is an admin
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            throw new Error('Invalid user token');
        }

        // Check admin role
        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .in('role', ['admin', 'owner']);

        if (rolesError || !roles || roles.length === 0) {
            throw new Error('Unauthorized: Admin access required');
        }

        const { action, userId, email, password, userData } = await req.json();

        let result;

        switch (action) {
            case 'createUser':
                if (!email || !password) throw new Error('Email and password required');
                const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                    user_metadata: userData || {}
                });
                if (createError) throw createError;
                result = newUser;
                break;

            case 'deleteUser':
                if (!userId) throw new Error('User ID required');
                const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
                if (deleteError) throw deleteError;
                // Also ensure profile and role data is cleaned up (though cascading deletes usually handle this)
                // await supabase.from('profiles').delete().eq('id', userId);
                result = { success: true };
                break;

            case 'updateUser':
                if (!userId) throw new Error('User ID required');
                const updates: any = {};
                if (email) updates.email = email;
                if (password) updates.password = password;
                if (userData) updates.user_metadata = userData;

                const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(userId, updates);
                if (updateError) throw updateError;
                result = updatedUser;
                break;

            default:
                throw new Error('Invalid action');
        }

        return new Response(
            JSON.stringify(result),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
});
