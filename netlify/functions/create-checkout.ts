
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

        try {
            const body = await req.json();
            const { planId, userId, amount, name, email, intent } = body;

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
                    await fetch(`${baseUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            email,
                            name,
                            workspaceId: workspace.id,
                            workspaceName: workspace.name,
                            planLevel: 'free',
                            seatLimit: 1,
                            role: 'admin',
                            subscriptionId: sub.id
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
            // Create pending subscription first to get an ID for reference
            const { data: pendingSub, error: pendingSubError } = await supabaseAdmin
                .from("subscriptions")
                .insert({
                    user_id: userId,
                    workspace_id: workspace.id,
                    status: 'pending',
                    plan_id: planId
                })
                .select()
                .single();

            if (pendingSubError) throw pendingSubError;

            // Map planId to human-readable name
            const planNames: Record<string, string> = {
                'basico': 'LUMIA - Básico',
                'intermediario': 'LUMIA - Intermediário',
                'avancado': 'LUMIA - Avançado'
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
                subscriptionId: pendingSub.id // Pass the sub ID
            });

            // 4. Handle Redirection / Response
            if (planId === 'basico') {
                // For the basic plan (soft trial), we can sync immediately as there's no payment delay
                try {
                    const baseUrl = process.env.URL || "http://localhost:8888";
                    await fetch(`${baseUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            email,
                            name,
                            workspaceId: workspace.id,
                            workspaceName: workspace.name,
                            planLevel: 'free',
                            seatLimit: 1,
                            role: 'admin',
                            subscriptionId: pendingSub.id
                        })
                    });
                } catch (syncErr) {
                    console.error("[CreateCheckout] Trial SIO_MAR sync failed:", syncErr);
                }
            }

            // Note: For paid plans, SIO_MAR synchronization is now handled in netcred-webhook.ts
            // to avoid Netlify function chaining timeouts (502).

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
