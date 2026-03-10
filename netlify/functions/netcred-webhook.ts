
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

interface PaymentPayload {
    subscriptionId: string | null;
    customerEmail: string;
    customerName: string;
    amount: number;
    paymentMethod: string;
    externalId: string;
    chargeLinkId?: string;
}

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

        // Debug logging for token mismatch
        if (authHeader !== `Bearer ${webhookToken}`) {
            const maskedReceived = authHeader ? `${authHeader.substring(0, 10)}...${authHeader.substring(authHeader.length - 4)}` : "null";
            const maskedExpected = `Bearer ${webhookToken.substring(0, 4)}...${webhookToken.substring(webhookToken.length - 4)}`;
            console.warn(`[Webhook] Unauthorized — token mismatch. Received: ${maskedReceived}, Expected: ${maskedExpected}`);
            
            // If it's a simple case of NetCred not sending 'Bearer ', we handle it
            if (authHeader === webhookToken) {
                console.log("[Webhook] Auth match found WITHOUT Bearer prefix. Proceeding...");
            } else {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
        }

        // --- Parse Event and Body ---
        const body = await req.json() as any;
        const entity = body.entity;

        // NetCred Webhook structure is typically: { entity: { ... }, company: { ... } }
        // The entity ID is what maps to our netcred_id (chargeLink ID)
        const chargeLinkId = entity?.id?.toString() || "";
        
        // Use entity status. 'ENDED' usually means captured/paid for simple links.
        const chargeStatus = entity?.charge_status || "";
        
        // Reference code from first transaction or entity root
        const externalId = entity?.reference_code || entity?.transactions?.[0]?.charge?.reference_code || "";
        const subscriptionId = externalId.split("_")[0] || null;

        // Customer details from transactions or internal info
        const billingInfo = entity?.transactions?.[0]?.billing_info || entity?.payment_profile?.customer;
        const customerEmail = billingInfo?.customer_email || billingInfo?.email || "";
        const customerName = billingInfo?.customer_name || billingInfo?.name || "Consultor";
        
        const amount = entity?.amount ? parseFloat(entity.amount) * 100 : 0; // Convert to cents
        const paymentMethod = entity?.transactions?.[0]?.method || "";

        console.log(`[Webhook] LinkId: ${chargeLinkId}, Status: ${chargeStatus}, Sub: ${subscriptionId}`);

        try {
            // Map NetCred status to internal events
            let internalEvent = "TRANSACTION_UPDATE";
            if (chargeStatus === "ENDED") internalEvent = "PAYMENT_PAID";
            if (chargeStatus === "EXPIRED") internalEvent = "PAYMENT_EXPIRED";
            if (chargeStatus === "VOIDED") internalEvent = "PAYMENT_REFUNDED";

            await this.dispatch(internalEvent, {
                subscriptionId,
                customerEmail,
                customerName,
                amount,
                paymentMethod,
                externalId: chargeLinkId,
                chargeLinkId
            }, body);

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (error: any) {
            console.error("[Webhook] Handler error:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
    }

    private async dispatch(type: string, data: PaymentPayload, rawBody: any) {
        // --- Always log the raw payment/event ---
        await this.logPayment({
            subscriptionId: data.subscriptionId,
            externalId: data.externalId,
            amount: data.amount,
            status: type,
            paymentMethod: data.paymentMethod,
            payload: rawBody,
        });

        switch (type) {
            case "PAYMENT_PAID":
            case "SUBSCRIPTION_PAID":
                await this.onPaymentPaid(data);
                break;

            case "PAYMENT_EXPIRED":
                await this.onPaymentExpired(data);
                break;

            case "PAYMENT_REFUNDED":
            case "CHARGEBACK":
                await this.onPaymentRefunded(data);
                break;

            case "SUBSCRIPTION_CANCELED":
                await this.onSubscriptionCanceled(data);
                break;

            case "SUBSCRIPTION_RENEWED":
                await this.onSubscriptionRenewed(data);
                break;

            default:
                console.log(`[Webhook] Unhandled event type: ${type} — logged only.`);
        }
    }

    async onPaymentPaid(p: PaymentPayload) {
        console.log(`[Webhook] Processing PAID. LinkId: ${p.chargeLinkId}, SubId: ${p.subscriptionId}`);

        let subscription: any = null;

        // 1. Try by ChargeLinkId (The most reliable for links)
        if (p.chargeLinkId) {
            const { data } = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('netcred_id', p.chargeLinkId)
                .maybeSingle();
            subscription = data;
        }

        // 2. Try by subscriptionId (Fallback)
        if (!subscription && p.subscriptionId) {
            const { data } = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('id', p.subscriptionId)
                .maybeSingle();
            subscription = data;
        }

        if (!subscription) {
            console.warn(`[Webhook] Subscription NOT FOUND for activation attempt.`);
            return;
        }

        console.log(`[Webhook] Activating subscription: ${subscription.id} for user: ${subscription.user_id}`);

        const { error: updateErr } = await supabaseAdmin
            .from("subscriptions")
            .update({
                status: "active",
                payment_status: "paid",
                updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.id);

        if (updateErr) console.error("[Webhook] DB Update error:", updateErr.message);

        // Update profile
        await supabaseAdmin
            .from("profiles")
            .update({ subscription_status: "active" })
            .eq("id", subscription.user_id);

        // Workspace Management
        const multiSeatPlans = ['intermediario', 'avancado'];
        const planSeats: Record<string, number> = { 'basico': 1, 'intermediario': 3, 'avancado': 5, 'v-test': 1 };

        if (multiSeatPlans.includes(subscription.plan_id)) {
            const { data: existingWs } = await (supabaseAdmin as any).from("workspaces")
                .select("id")
                .eq("owner_id", subscription.user_id)
                .maybeSingle();

            let workspaceId = existingWs?.id;

            if (workspaceId) {
                await (supabaseAdmin as any).from("workspaces")
                    .update({ 
                        plan_level: 'pro',
                        seat_limit: planSeats[subscription.plan_id] || 3
                    })
                    .eq("id", workspaceId);
            } else {
                const { data: ws } = await (supabaseAdmin as any).from("workspaces")
                    .insert({
                        name: `${p.customerName}'s Workspace`,
                        owner_id: subscription.user_id,
                        plan_level: 'pro',
                        seat_limit: planSeats[subscription.plan_id] || 3
                    })
                    .select()
                    .single();
                workspaceId = ws?.id;
                
                if (workspaceId) {
                    await (supabaseAdmin as any).from("workspace_members")
                        .upsert({ workspace_id: workspaceId, user_id: subscription.user_id, role: 'admin' });
                }
            }

            if (workspaceId) {
                await supabaseAdmin.from("subscriptions").update({ workspace_id: workspaceId }).eq("id", subscription.id);
            }
        }

        // SIO_MAR Sync
        try {
            const baseUrl = process.env.URL || "http://localhost:8888";
            await fetch(`${baseUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: subscription.user_id,
                    email: p.customerEmail,
                    name: p.customerName,
                    subscriptionId: subscription.id
                })
            });
        } catch (e) { /* non-fatal */ }

        // Send Email
        if (p.customerEmail) {
            await this.safeSendEmail(p.customerEmail, "payment-confirmed", {
                name: p.customerName,
                amount: this.formatAmount(p.amount),
                payment_method: p.paymentMethod || "NetCred",
            });
        }
    }

    private async onPaymentExpired(p: PaymentPayload) {
        if (p.subscriptionId) {
            await supabaseAdmin.from("subscriptions").update({ payment_status: "expired" }).eq("id", p.subscriptionId);
        }
        if (p.customerEmail) await this.safeSendEmail(p.customerEmail, "payment-expired", { name: p.customerName });
    }

    private async onPaymentRefunded(p: PaymentPayload) {
        if (p.subscriptionId) {
            await supabaseAdmin.from("subscriptions").update({ status: "canceled", payment_status: "refunded" }).eq("id", p.subscriptionId);
        }
        if (p.customerEmail) await this.safeSendEmail(p.customerEmail, "payment-refunded", { name: p.customerName, amount: this.formatAmount(p.amount) });
    }

    private async onSubscriptionCanceled(p: PaymentPayload) {
        if (p.subscriptionId) {
            await supabaseAdmin.from("subscriptions").update({ status: "canceled", payment_status: "canceled" }).eq("id", p.subscriptionId);
        }
        if (p.customerEmail) await this.safeSendEmail(p.customerEmail, "subscription-canceled", { name: p.customerName });
    }

    private async onSubscriptionRenewed(p: PaymentPayload) {
        if (p.subscriptionId) {
            await supabaseAdmin.from("subscriptions").update({
                status: "active",
                payment_status: "paid",
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }).eq("id", p.subscriptionId);
        }
    }

    private async logPayment(p: { subscriptionId: string | null, externalId: string, amount: number, status: string, paymentMethod: string, payload: any }) {
        try {
            await (supabaseAdmin.from("netcred_payments") as any).insert({
                subscription_id: p.subscriptionId || undefined,
                external_id: p.externalId,
                amount: p.amount,
                status: p.status,
                payment_method: p.paymentMethod,
                payload: p.payload,
            });
        } catch (e) { console.warn("[Webhook] Log error", e); }
    }

    private async safeSendEmail(to: string, templateId: string, vars: Record<string, string>) {
        try {
            await sendTemplateEmail(to, templateId, vars);
        } catch (e) { console.error("[Webhook] Email error", e); }
    }

    private formatAmount(cents: number): string {
        return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
    }
}

const controller = new NetCredWebhookController();
export const handler = controller.handler.bind(controller);
