
import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { NetCredService } from "./netcredService";
import { supabaseAdmin } from "./lib/supabaseAdmin";
import { sendTemplateEmail } from "./lib/emailService";

class CreateCheckoutController extends BaseController {
    private netcred = new NetCredService();

    protected async handleRequest(req: Request, context: Context): Promise<Response> {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
        }

        // Validar Authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized - No token provided" }), { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");

        // Verificar token com Supabase Auth
        const SUPABASE_URL = process.env.SUPABASE_URL || "https://nmxfknwkhnengqqjtwru.supabase.co";
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teGZrbndraG5lbmdxcWp0d3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTUyMjgsImV4cCI6MjA1ODIzMTIyOH0.3I_qClajzP-s1j_GF2WRY7ZkVSWC4fcLgKMH8Ut-TbA";

        const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY
            }
        });

        if (!authResponse.ok) {
            console.error("[CreateCheckout] Invalid token:", authResponse.status);
            return new Response(JSON.stringify({ error: "Unauthorized - Invalid token" }), { status: 401 });
        }

        const userData = await authResponse.json();
        const verifiedUserId = userData.id;

        console.log("[CreateCheckout] Authenticated user:", verifiedUserId);

        try {
            const body = await req.json();
            const { planId, amount, name, email, intent } = body;

            // Usar userId verificado do token, não do corpo da requisição
            const userId = verifiedUserId;

            // 1. Get or Create Workspace for user
            let { data: workspace, error: wsError } = await (supabaseAdmin as any).from("workspaces")
                .select("id")
                .eq("owner_id", userId)
                .maybeSingle();

            if (wsError) throw wsError;

            if (!workspace) {
                const { data: newWorkspace, error: createWsError } = await (supabaseAdmin as any).from("workspaces")
                    .insert({
                        name: `${name}'s Workspace`,
                        owner_id: userId,
                        plan_level: planId === 'basico' ? 'free' : 'pro'
                    })
                    .select()
                    .single();

                if (createWsError) throw createWsError;
                workspace = newWorkspace;

                // 1.1 Link User to Workspace
                const { error: memberError } = await (supabaseAdmin as any).from("workspace_members")
                    .insert({
                        workspace_id: workspace.id,
                        user_id: userId,
                        role: 'admin'
                    });

                if (memberError) throw memberError;
            }

            // 2. Handle Plan Logic (Trial)
            if (planId === 'basico' && intent !== 'purchase') {
                const trialEnds = new Date();
                trialEnds.setDate(trialEnds.getDate() + 7);

                const { data: sub, error: subError } = await supabaseAdmin
                    .from("subscriptions")
                    .insert({
                        user_id: userId,
                        workspace_id: workspace.id,
                        status: 'trialing',
                        trial_ends_at: trialEnds.toISOString(),
                        plan_id: planId
                    })
                    .select()
                    .single();

                if (subError) throw subError;

                // Send Welcome Email
                try {
                    await sendTemplateEmail(email, 'welcome', {
                        name: name,
                        login_url: 'https://crievalor.com.br/login'
                    });
                } catch (emailErr) {
                    console.error("[CreateCheckout] Failed to send welcome email:", emailErr);
                }

                // 2.1 Sync SIO_MAR user (Trial version)
                try {
                    const baseUrl = process.env.URL || "http://localhost:8888";
                 const syncResponse = await fetch(`${baseUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        email: email, // Use the 'email' from the request body
                        name: name, // Use the 'name' from the request body
                        workspaceId: workspace.id,
                        workspaceName: workspace.name,
                        planLevel: planId, // 'basico' for trial
                        seatLimit: 1,
                        role: 'admin',
                        subscriptionId: sub.id // Use 'sub.id' for the newly created trial subscription
                    })
                });
                } catch (syncErr) {
                    console.error("[CreateCheckout] Trial SIO_MAR sync fetch failed:", syncErr);
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: "7-day soft trial started",
                    redirect: "/lumia/sucesso"
                }), { status: 201 });
            }

            // 3. Handle Paid Plan (NetCred)
            // 3.1 Check for ANY existing subscription for this user to avoid duplicates
            // We look for 'pending', 'trialing' or 'active' across ALL plans.
            // If they are on 'basico' (trial) and buy 'avancado', we reuse/update the record.
            let { data: existingSub, error: subFetchError } = await supabaseAdmin
                .from("subscriptions")
                .select()
                .eq('user_id', userId)
                .in('status', ['pending', 'trialing', 'active'])
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (subFetchError) throw subFetchError;

            let targetSub = existingSub;

            // 3.2 If no record exists, create a pending one
            if (!targetSub) {
                const { data: newSub, error: createError } = await supabaseAdmin
                    .from("subscriptions")
                    .insert({
                        user_id: userId,
                        workspace_id: workspace.id,
                        status: 'pending',
                        plan_id: planId
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                targetSub = newSub;
            } else {
                console.log(`[CreateCheckout] Reusing existing subscription: ${targetSub.id} (Existing Plan: ${targetSub.plan_id}, New Choice: ${planId}, Status: ${targetSub.status})`);
                
                // Update the plan_id if it's changing (e.g. from basico to avancado)
                if (targetSub.plan_id !== planId) {
                    const { error: updatePlanErr } = await supabaseAdmin.from('subscriptions')
                        .update({ plan_id: planId })
                        .eq('id', targetSub.id);
                    if (updatePlanErr) console.error("[CreateCheckout] Failed to update plan preference:", updatePlanErr);
                }
            }

            // Map planId to human-readable name
            const planNames: Record<string, string> = {
                'basico': 'LUMIA - Básico',
                'intermediario': 'LUMIA - Intermediário',
                'avancado': 'LUMIA - Avançado',
                'v-test': 'LUMIA - Teste de Integração'
            };
            const planName = planNames[planId] || `LUMIA - ${planId}`;

            // NetCred expects baseAmount in decimal format, but we receive it in cents from frontend
            const amountDecimal = amount / 100;

            const netcredLink = await this.netcred.createCheckout({
                planId: planName,
                userId,
                email,
                name,
                amount: amountDecimal,
                paymentMethods: ["CREDIT_CARD", "PIX"],
                subscriptionId: targetSub.id // Pass the sub ID
            });

            // 3. Update the subscription with the NetCred Link ID for webhook mapping
            const { error: updateError } = await supabaseAdmin.from('subscriptions')
                .update({
                    netcred_id: netcredLink.chargeLinkCreate.chargeLink.id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', targetSub.id);

            if (updateError) {
                console.error(`[CreateCheckout] Error saving NetCred ID:`, updateError);
                // We don't throw here to avoid blocking the user, but it's a critical warning
            }

            return new Response(JSON.stringify({
                success: true,
                url: netcredLink.chargeLinkCreate.chargeLink.url
            }), { status: 200 });

        } catch (error: any) {
            console.error("[CreateCheckout] Error:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            // Differentiate between 400 (client error) and 500 (server error)
            const status = error.status || (error.name === 'SyntaxError' ? 500 : 400);
            return new Response(JSON.stringify({
                error: error.message,
                details: error.details || null,
                hint: error.hint || null
            }), { status });
        }
    }
}

const controller = new CreateCheckoutController();
export const handler = controller.handler.bind(controller);
