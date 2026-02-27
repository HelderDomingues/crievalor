
import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { supabase } from "../../src/integrations/supabase/client";
import { sendTemplateEmail } from "./lib/emailService";

class NetCredWebhookController extends BaseController {
    protected async handleRequest(req: Request, context: Context): Promise<Response> {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
        }

        const authHeader = req.headers.get("Authorization");
        const webhookToken = process.env.NETCRED_WEBHOOK_TOKEN;

        if (!webhookToken) {
            console.error("[Webhook] NETCRED_WEBHOOK_TOKEN not configured in environment");
            return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500 });
        }

        if (!authHeader || authHeader !== `Bearer ${webhookToken}`) {
            console.warn("[Webhook] Unauthorized attempt with token:", authHeader);
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        try {
            const body = await req.json();
            const { type, data } = body;

            console.log(`[Webhook] Processing event type: ${type}`, data);

            // Webhook event handling logic
            // type could be 'SUBSCRIPTION_PAID', 'PAYMENT_EXPIRED', etc.

            const { externalId, status, paymentMethod, amount, customerEmail, customerName } = data;
            const subscriptionId = externalId.split('_')[0]; // Simple recovery

            // 1. Log Payment
            const { error: paymentError } = await (supabase.from("netcred_payments") as any).insert({
                subscription_id: subscriptionId,
                external_id: data.id,
                amount: amount,
                status: status,
                payment_method: paymentMethod,
                payload: body
            });

            // 2. Update Subscription if paid
            if (status === 'PAID') {
                const { error: subError } = await supabase
                    .from("subscriptions")
                    .update({
                        status: 'active',
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", subscriptionId);

                if (subError) throw subError;

                // 3. Trigger Resend Email
                try {
                    await sendTemplateEmail(customerEmail || 'owner@crievalor.com.br', 'payment-confirmed', {
                        name: customerName || 'Consultor',
                        plan: 'LUMIA Pro', // Simplified for now
                        amount: `R$ ${(amount / 100).toFixed(2)}`
                    });
                } catch (emailErr) {
                    console.error("[Webhook] Failed to send confirmation email:", emailErr);
                }
            }

            return new Response(JSON.stringify({ success: true }), { status: 200 });

        } catch (error: any) {
            console.error("[Webhook] Error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
    }
}

const controller = new NetCredWebhookController();
export const handler = controller.handler.bind(controller);
