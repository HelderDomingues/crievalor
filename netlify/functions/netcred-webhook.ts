
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

        // --- Parse Event and Body ---
        const eventType = req.headers.get("x-netcred-event");
        const body = await req.json() as any;

        // Common mapping based on NetCred Docs:
        // transaction_state: "PAID", "EXPIRED", etc.
        // charge.reference_code: Our internal subscription ID
        const type = eventType || body.type; // Fallback to body.type for manual tests
        const transactionState = body.transaction_state;
        const externalId = body.charge?.reference_code || body.externalId || "";
        const subscriptionId = externalId.split("_")[0] || null;
        const customerEmail = body.charge?.customer_email || body.customerEmail || "";
        const customerName = body.charge?.customer_name || body.customerName || "Consultor";
        const amount = body.amount ?? 0;
        const paymentMethod = body.method ?? body.paymentMethod ?? "";

        console.log(`[Webhook] Event: ${type}, State: ${transactionState}, Sub: ${subscriptionId}`);

        try {
            // Map NetCred states to our internal dispatch events
            let internalEvent = type;
            if (type === "TRANSACTION_UPDATE") {
                if (transactionState === "PAID") internalEvent = "PAYMENT_PAID";
                if (transactionState === "EXPIRED") internalEvent = "PAYMENT_EXPIRED";
                if (transactionState === "REFUNDED") internalEvent = "PAYMENT_REFUNDED";
            }

            await this.dispatch(internalEvent, {
                subscriptionId,
                customerEmail,
                customerName,
                amount,
                paymentMethod,
                externalId: body.id || externalId
            }, body);

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
        const { subscriptionId, customerEmail, customerName, amount, paymentMethod, externalId } = data;

        // --- Always log the raw payment/event ---
        await this.logPayment({
            subscriptionId,
            externalId,
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

                // --- SIO_MAR Synchronization ---
                // Now that payment is confirmed, we trigger the account sync
                try {
                    const baseUrl = process.env.URL || "http://localhost:8888";
                    console.log(`[Webhook][PAID] Triggering SIO_MAR sync for user: ${sub.user_id}`);

                    await fetch(`${baseUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: sub.user_id,
                            email: p.customerEmail,
                            name: p.customerName,
                            // Fetch additional workspace data if needed, or use defaults
                            // Using defaults for now as profiles/subscriptions are updated
                            planLevel: sub.plan_id === 'avancado' ? 'pro' : (sub.plan_id === 'basico' ? 'free' : 'pro'),
                            subscriptionId: p.subscriptionId
                        })
                    });
                } catch (syncErr: any) {
                    console.error("[Webhook][PAID] SIO_MAR Sync trigger failed:", syncErr.message);
                }
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
