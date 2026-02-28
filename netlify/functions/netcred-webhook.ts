
import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { supabaseAdmin } from "./lib/supabaseAdmin";
import { sendTemplateEmail } from "./lib/emailService";

// ---------------------------------------------------------------------------
// NetCred Webhook Event Types
// ---------------------------------------------------------------------------
// PAYMENT_PAID          – payment confirmed (PIX, boleto, card)
// PAYMENT_EXPIRED       – boleto/pix expired without payment
// PAYMENT_REFUNDED      – payment refunded / chargeback
// SUBSCRIPTION_CANCELED – subscription manually cancelled by customer or admin
// SUBSCRIPTION_RENEWED  – recurring subscription auto-renewed (future)
// ---------------------------------------------------------------------------

class NetCredWebhookController extends BaseController {
    protected async handleRequest(req: Request, _ctx: Context): Promise<Response> {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
        }

        // --- Auth ---
        const authHeader = req.headers.get("Authorization");
        const webhookToken = process.env.NETCRED_WEBHOOK_TOKEN;

        if (!webhookToken) {
            console.error("[Webhook] NETCRED_WEBHOOK_TOKEN not configured");
            return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500 });
        }

        if (!authHeader || authHeader !== `Bearer ${webhookToken}`) {
            console.warn("[Webhook] Unauthorized — token mismatch");
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // --- Parse body ---
        const body = await req.json();
        const { type, data } = body as {
            type: string;
            data: Record<string, any>;
        };

        console.log(`[Webhook] Event received: ${type}`, JSON.stringify(data));

        try {
            await this.dispatch(type, data, body);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (error: any) {
            console.error("[Webhook] Handler error:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
    }

    // ------------------------------------------------------------------
    // dispatch – routes each event type to its handler
    // ------------------------------------------------------------------
    private async dispatch(type: string, data: Record<string, any>, rawBody: any) {
        // Safely extract common fields
        const externalId: string = data.externalId ?? data.external_id ?? "";
        const subscriptionId = externalId.split("_")[0] || null;
        const customerEmail: string = data.customerEmail ?? data.email ?? "";
        const customerName: string = data.customerName ?? data.name ?? "Consultor";
        const amount: number = data.amount ?? 0;
        const paymentMethod: string = data.paymentMethod ?? data.method ?? "";

        // --- Always log the raw payment/event ---
        await this.logPayment({
            subscriptionId,
            externalId: data.id ?? externalId,
            amount,
            status: type,
            paymentMethod,
            payload: rawBody,
        });

        switch (type) {
            case "PAYMENT_PAID":
            case "SUBSCRIPTION_PAID": // legacy alias
                await this.onPaymentPaid({ subscriptionId, customerEmail, customerName, amount, paymentMethod });
                break;

            case "PAYMENT_EXPIRED":
                await this.onPaymentExpired({ subscriptionId, customerEmail, customerName });
                break;

            case "PAYMENT_REFUNDED":
            case "CHARGEBACK":
                await this.onPaymentRefunded({ subscriptionId, customerEmail, customerName, amount });
                break;

            case "SUBSCRIPTION_CANCELED":
                await this.onSubscriptionCanceled({ subscriptionId, customerEmail, customerName });
                break;

            case "SUBSCRIPTION_RENEWED":
                await this.onSubscriptionRenewed({ subscriptionId, customerEmail, customerName, amount });
                break;

            default:
                console.log(`[Webhook] Unhandled event type: ${type} — logged only.`);
        }
    }

    // ------------------------------------------------------------------
    // PAID
    // ------------------------------------------------------------------
    private async onPaymentPaid(p: {
        subscriptionId: string | null;
        customerEmail: string;
        customerName: string;
        amount: number;
        paymentMethod: string;
    }) {
        console.log("[Webhook][PAID] Activating subscription:", p.subscriptionId);

        if (p.subscriptionId) {
            const { error } = await supabaseAdmin
                .from("subscriptions")
                .update({
                    status: "active",
                    payment_status: "paid",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", p.subscriptionId);

            if (error) console.error("[Webhook][PAID] Subscription update error:", error.message);

            // Also update the user's profile subscription_status
            const { data: sub } = await supabaseAdmin
                .from("subscriptions")
                .select("user_id, plan_id")
                .eq("id", p.subscriptionId)
                .single();

            if (sub?.user_id) {
                await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_status: "active" })
                    .eq("id", sub.user_id);
            }
        }

        // Send confirmation email
        if (p.customerEmail) {
            await this.safeSendEmail(p.customerEmail, "payment-confirmed", {
                name: p.customerName,
                amount: this.formatAmount(p.amount),
                payment_method: p.paymentMethod === "PIX" ? "PIX" : "Cartão/Boleto",
            });
        }
    }

    // ------------------------------------------------------------------
    // EXPIRED
    // ------------------------------------------------------------------
    private async onPaymentExpired(p: {
        subscriptionId: string | null;
        customerEmail: string;
        customerName: string;
    }) {
        console.log("[Webhook][EXPIRED] Payment expired for subscription:", p.subscriptionId);

        if (p.subscriptionId) {
            await supabaseAdmin
                .from("subscriptions")
                .update({
                    payment_status: "expired",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", p.subscriptionId);
        }

        if (p.customerEmail) {
            await this.safeSendEmail(p.customerEmail, "payment-expired", {
                name: p.customerName,
            });
        }
    }

    // ------------------------------------------------------------------
    // REFUNDED / CHARGEBACK
    // ------------------------------------------------------------------
    private async onPaymentRefunded(p: {
        subscriptionId: string | null;
        customerEmail: string;
        customerName: string;
        amount: number;
    }) {
        console.log("[Webhook][REFUNDED] Refund for subscription:", p.subscriptionId);

        if (p.subscriptionId) {
            await supabaseAdmin
                .from("subscriptions")
                .update({
                    status: "canceled",
                    payment_status: "refunded",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", p.subscriptionId);

            // Revoke profile status
            const { data: sub } = await supabaseAdmin
                .from("subscriptions")
                .select("user_id")
                .eq("id", p.subscriptionId)
                .single();

            if (sub?.user_id) {
                await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_status: "canceled" })
                    .eq("id", sub.user_id);
            }
        }

        if (p.customerEmail) {
            await this.safeSendEmail(p.customerEmail, "payment-refunded", {
                name: p.customerName,
                amount: this.formatAmount(p.amount),
            });
        }
    }

    // ------------------------------------------------------------------
    // SUBSCRIPTION CANCELED
    // ------------------------------------------------------------------
    private async onSubscriptionCanceled(p: {
        subscriptionId: string | null;
        customerEmail: string;
        customerName: string;
    }) {
        console.log("[Webhook][CANCELED] Subscription canceled:", p.subscriptionId);

        if (p.subscriptionId) {
            await supabaseAdmin
                .from("subscriptions")
                .update({
                    status: "canceled",
                    payment_status: "canceled",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", p.subscriptionId);

            const { data: sub } = await supabaseAdmin
                .from("subscriptions")
                .select("user_id")
                .eq("id", p.subscriptionId)
                .single();

            if (sub?.user_id) {
                await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_status: "canceled" })
                    .eq("id", sub.user_id);
            }
        }

        if (p.customerEmail) {
            await this.safeSendEmail(p.customerEmail, "subscription-canceled", {
                name: p.customerName,
            });
        }
    }

    // ------------------------------------------------------------------
    // SUBSCRIPTION RENEWED
    // ------------------------------------------------------------------
    private async onSubscriptionRenewed(p: {
        subscriptionId: string | null;
        customerEmail: string;
        customerName: string;
        amount: number;
    }) {
        console.log("[Webhook][RENEWED] Subscription renewed:", p.subscriptionId);

        if (p.subscriptionId) {
            await supabaseAdmin
                .from("subscriptions")
                .update({
                    status: "active",
                    payment_status: "paid",
                    updated_at: new Date().toISOString(),
                    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                })
                .eq("id", p.subscriptionId);
        }

        if (p.customerEmail) {
            await this.safeSendEmail(p.customerEmail, "payment-confirmed", {
                name: p.customerName,
                amount: this.formatAmount(p.amount),
                payment_method: "Renovação automática",
            });
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    private async logPayment(p: {
        subscriptionId: string | null;
        externalId: string;
        amount: number;
        status: string;
        paymentMethod: string;
        payload: any;
    }) {
        const { error } = await (supabaseAdmin.from("netcred_payments") as any).insert({
            subscription_id: p.subscriptionId || undefined,
            external_id: p.externalId,
            amount: p.amount,
            status: p.status,
            payment_method: p.paymentMethod,
            payload: p.payload,
        });

        if (error) {
            console.warn("[Webhook] logPayment error (non-fatal):", error.message);
        }
    }

    private async safeSendEmail(to: string, templateId: string, vars: Record<string, string>) {
        try {
            await sendTemplateEmail(to, templateId, vars);
            console.log(`[Webhook] Email "${templateId}" sent to ${to}`);
        } catch (err: any) {
            console.error(`[Webhook] Email "${templateId}" failed:`, err.message);
            // Never throw — email failure must NOT fail the webhook response
        }
    }

    private formatAmount(cents: number): string {
        return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
    }
}

const controller = new NetCredWebhookController();
export const handler = controller.handler.bind(controller);
