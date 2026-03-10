
import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { supabaseAdmin } from "./lib/supabaseAdmin";
import { sendTemplateEmail } from "./lib/emailService";
import { createHash, createHmac, timingSafeEqual } from "crypto";

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
        const customTokenHeader = req.headers.get("x-netcred-token");
        const netcredSignatureHeader = req.headers.get("x-netcred-signature");
        const webhookToken = process.env.NETCRED_WEBHOOK_TOKEN;

        if (!webhookToken) {
            console.error("[Webhook] NETCRED_WEBHOOK_TOKEN not configured");
            return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500 });
        }

        // NetCred sends an HMAC SHA256 of the body using the secret key in x-netcred-signature
        const rawBody = await req.text();
        let body: any;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            console.error("[Webhook] Failed to parse JSON body");
            return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }

        const expectedSignature = createHmac("sha256", webhookToken).update(rawBody).digest("hex");

        const netcredEvent = req.headers.get("x-netcred-event");

        // --- Log discovery info ---
        console.log(`[Webhook] Discovery - Auth: ${authHeader ? "✓" : "✗"}, Custom: ${customTokenHeader ? "✓" : "✗"}, Signature: ${netcredSignatureHeader ? "✓" : "✗"}, Event Header: ${netcredEvent || "none"}`);
        console.log(`[Webhook] Body Keys: ${Object.keys(body).join(", ")}`);

        // Prioritize body.entity if present, otherwise fallback to root body
        const activeEntity = body.entity || body;
        
        // If it's a list of objects (some webhooks do this), take the first
        const entity = Array.isArray(activeEntity) ? activeEntity[0] : activeEntity;

        // --- Production Extraction Logic ---
        // 1. ChargeLink ID (Mapping to netcred_id in DB)
        // In CHARGE_CREATE, it's 'charge_link_id'. In TRANSACTION events, it's often nested in 'charge'.
        const chargeLinkId = (
            entity?.charge_link_id || 
            entity?.charge?.charge_link_id || 
            entity?.id?.toString() || 
            body.id?.toString() || 
            ""
        );

        // 2. Charge Status
        const chargeStatus = entity?.charge_status || entity?.charge?.charge_status || body.charge_status || "";
        
        // 3. Reference and Subscription Mapping
        const externalId = (
            entity?.reference_code || 
            entity?.charge?.reference_code || 
            entity?.transactions?.[0]?.charge?.reference_code || 
            body.reference_code || 
            ""
        );
        const subscriptionId = externalId.split("_")[0] || null;

        // 4. Customer and Email
        const t0 = entity?.transactions?.[0] || body.transactions?.[0];
        const billingInfo = t0?.billing_info || entity?.payment_profile?.customer || body.payment_profile?.customer || entity?.customer || body.customer;
        const customerEmail = billingInfo?.customer_email || billingInfo?.email || entity?.email || body.email || "";
        const customerName = billingInfo?.customer_name || billingInfo?.name || entity?.name || body.name || "Consultor";
        
        const amount = entity?.amount ? parseFloat(entity.amount) * 100 : (body.amount ? parseFloat(body.amount) * 100 : 0);
        const paymentMethod = t0?.method || entity?.method || "";

        // --- Event Mapping ---
        let internalEvent = "TRANSACTION_UPDATE";
        
        // PAYMENT_PAID triggers:
        // - Header event is TRANSACTION_CAPTURE (The most definitive for card/captured pix)
        // - Header event is PAYMENT_PAID
        // - Internal status is ENDED
        if (netcredEvent === "TRANSACTION_CAPTURE" || netcredEvent === "PAYMENT_PAID" || chargeStatus === "ENDED") {
            internalEvent = "PAYMENT_PAID";
        }

        // Other mappings
        if (chargeStatus === "EXPIRED" || netcredEvent === "PAYMENT_EXPIRED") {
            internalEvent = "PAYMENT_EXPIRED";
        }
        if (chargeStatus === "VOIDED" || netcredEvent === "PAYMENT_REFUNDED") {
            internalEvent = "PAYMENT_REFUNDED";
        }

        console.log(`[Webhook] Extraction Result — LinkId: ${chargeLinkId}, Status: ${chargeStatus}, InternalEvent: ${internalEvent}, SubId: ${subscriptionId}`);
        console.log(`[Webhook] Customer: ${customerName} (${customerEmail})`);

        try {
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

        // --- Data Enrichment ---
        // If email or name is missing, fetch from profile
        let finalEmail = p.customerEmail;
        let finalName = p.customerName;

        if (!finalEmail || finalName === "Consultor") {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('email, full_name')
                .eq('id', subscription.user_id)
                .maybeSingle();
            
            if (profile) {
                if (!finalEmail) finalEmail = profile.email || "";
                if (finalName === "Consultor") finalName = profile.full_name || "Consultor";
            }
        }

        console.log(`[Webhook] Data Enrichment: Email: ${finalEmail}, Name: ${finalName}`);
        console.log(`[Webhook] Activating subscription: ${subscription.id} for user: ${subscription.user_id}`);

        const { error: updateErr } = await supabaseAdmin
            .from("subscriptions")
            .update({
                status: "active",
                payment_status: "paid",
                payment_id: p.externalId,
                payment_details: {
                    method: p.paymentMethod,
                    amount: p.amount,
                    webhook_event: "PAID"
                },
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
            const siteUrl = process.env.URL || "https://crievalor.com.br";
            console.log(`[Webhook] Triggering SIO_MAR sync for ${subscription.user_id} at ${siteUrl}`);
            
            const response = await fetch(`${siteUrl}/.netlify/functions/sync-user-to-sio-mar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: subscription.user_id,
                    email: finalEmail,
                    name: finalName,
                    workspaceId: subscription.workspace_id,
                    workspaceName: `${finalName}'s Workspace`,
                    subscriptionId: subscription.id,
                    planLevel: subscription.plan_id // 'basico', 'intermediario', etc.
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[Webhook] SIO_MAR sync failed: ${response.status} ${errorText}`);
            } else {
                console.log("[Webhook] SIO_MAR sync successfully triggered.");
            }
        } catch (e: any) { 
            console.error("[Webhook] SIO_MAR sync fetch error:", e.message);
        }

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
