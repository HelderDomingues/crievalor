
import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { NetCredService } from "./netcredService";
import { supabase } from "../../src/integrations/supabase/client";
import { sendTemplateEmail } from "./lib/emailService";

class CreateCheckoutController extends BaseController {
    private netcred = new NetCredService();

    protected async handleRequest(req: Request, context: Context): Promise<Response> {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
        }

        try {
            const body = await req.json();
            const { planId, userId, amount, name, email } = body;

            // 1. Create Workspace for user (Self-onboarding)
            const { data: workspace, error: wsError } = await (supabase as any).from("workspaces")
                .insert({
                    name: `${name}'s Workspace`,
                    owner_id: userId,
                    plan_level: planId === 'free' ? 'free' : 'pro'
                })
                .select()
                .single();

            if (wsError) throw wsError;

            // 2. Link User to Workspace
            const { error: memberError } = await (supabase as any).from("workspace_members")
                .insert({
                    workspace_id: workspace.id,
                    user_id: userId,
                    role: 'admin'
                });

            if (memberError) throw memberError;

            // 3. Handle Plan Logic
            if (planId === 'free') {
                const trialEnds = new Date();
                trialEnds.setDate(trialEnds.getDate() + 7);

                const { data: sub, error: subError } = await supabase
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

                // 3.1 Send Welcome Email
                try {
                    await sendTemplateEmail(email, 'welcome', {
                        name: name,
                        login_url: 'https://crievalor.com.br/login'
                    });
                } catch (emailErr) {
                    console.error("[CreateCheckout] Failed to send welcome email:", emailErr);
                    // Don't fail the whole request if email fails
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: "7-day soft trial started",
                    redirect: "/dashboard"
                }), { status: 201 });
            }

            // 4. Handle Paid Plan (NetCred)
            const netcredLink = await this.netcred.createCheckout({
                planId,
                userId,
                email,
                name,
                amount,
                paymentMethods: ["CREDIT_CARD", "PIX"]
            });

            return new Response(JSON.stringify({
                success: true,
                url: netcredLink.createSubscriptionLink.url
            }), { status: 200 });

        } catch (error: any) {
            console.error("[CreateCheckout] Error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
    }
}

const controller = new CreateCheckoutController();
export const handler = controller.handler.bind(controller);
