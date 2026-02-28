import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { supabaseAdmin } from "./lib/supabaseAdmin";
import { sendTemplateEmail } from "./lib/emailService";

function getSeatLimit(planId: string) {
    if (planId === 'avancado') return 5;
    if (planId === 'intermediario') return 3;
    return 1;
}

class InviteMemberController extends BaseController {
    protected async handleRequest(req: Request, _ctx: Context): Promise<Response> {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
        }

        try {
            // 1. Auth check
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }

            const token = authHeader.replace('Bearer ', '');
            const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
            if (authError || !user) {
                return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
            }

            const body = await req.json();
            const { email, workspaceId } = body;

            if (!email || !workspaceId) {
                return new Response(JSON.stringify({ error: "Email and workspaceId are required" }), { status: 400 });
            }

            // 2. Validate caller is an admin of the workspace
            const { data: callerMember, error: callerError } = await (supabaseAdmin as any)
                .from('workspace_members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', user.id)
                .single();

            if (callerError || callerMember?.role !== 'admin') {
                return new Response(JSON.stringify({ error: "Forbidden: Not a workspace admin" }), { status: 403 });
            }

            // 3. Get Active Subscription to verify seat limits
            const { data: subData } = await supabaseAdmin
                .from('subscriptions')
                .select('plan_id, status')
                .eq('workspace_id', workspaceId)
                .in('status', ['active', 'trialing'])
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            const planId = subData?.plan_id || 'basico';
            const limit = getSeatLimit(planId);

            // 4. Check Current Member Count
            const { count, error: countError } = await (supabaseAdmin as any)
                .from('workspace_members')
                .select('*', { count: 'exact', head: true })
                .eq('workspace_id', workspaceId);

            if (countError) throw countError;

            if ((count || 0) >= limit) {
                return new Response(JSON.stringify({ error: `Limite de ${limit} assentos atingido para o plano atual.` }), { status: 400 });
            }

            // 5. Create user in crievalor
            const tempPassword = Math.random().toString(36).slice(-10) + 'A1!'; // Secure temp password
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: tempPassword,
                email_confirm: true,
                user_metadata: { role: 'company_user' }
            });

            if (createError) {
                if (createError.message.includes('already been registered')) {
                    return new Response(JSON.stringify({ error: "Este email já possui uma conta na Crie Valor." }), { status: 409 });
                }
                throw createError;
            }

            if (!newUser.user) throw new Error("Failed to create user");

            const newUserId = newUser.user.id;

            // 6. Add to workspace
            const { error: insertError } = await (supabaseAdmin as any)
                .from('workspace_members')
                .insert({
                    workspace_id: workspaceId,
                    user_id: newUserId,
                    role: 'member'
                });

            if (insertError) throw insertError;

            // 7. Get workspace name for context
            const { data: wsData } = await (supabaseAdmin as any)
                .from('workspaces')
                .select('name')
                .eq('id', workspaceId)
                .single();

            // 8. Fire Sync to SIO_MAR (non-blocking)
            try {
                const baseUrl = process.env.URL || "http://localhost:8888";
                await fetch(`${baseUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: newUserId,
                        email,
                        name: email.split('@')[0], // simple fallback
                        workspaceId,
                        workspaceName: wsData?.name || 'Workspace',
                        planLevel: planId === 'basico' ? 'free' : 'pro',
                        seatLimit: limit,
                        role: 'member'
                    })
                });
            } catch (e) {
                console.error("[InviteMember] Failed to trigger sync:", e);
            }

            // 9. Send welcome email with temp password
            try {
                await sendTemplateEmail(email, 'welcome', {
                    name: email.split('@')[0],
                    temp_password: tempPassword,
                    login_url: 'https://crievalor.com.br/login'
                });
            } catch (e) {
                console.error("[InviteMember] Failed to send email:", e);
            }

            return new Response(JSON.stringify({ success: true, userId: newUserId }), { status: 200 });

        } catch (error: any) {
            console.error("[InviteMember] Error:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    }
}

const controller = new InviteMemberController();
export const handler = controller.handler.bind(controller);
