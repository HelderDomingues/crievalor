
import { Context, Config } from "@netlify/functions";
import { supabase } from "../../src/integrations/supabase/client";
import { sendTemplateEmail } from "./lib/emailService";

export default async (req: Request, context: Context) => {
    console.log("[Trial Cron] Starting expiration check...");

    try {
        // 1. Find expired trials
        const now = new Date();
        const { data: expiredSubs, error: fetchError } = await (supabase
            .from('subscriptions') as any)
            .select('id, user_id, workspace_id')
            .eq('status', 'trialing')
            .lt('trial_ends_at', now.toISOString()); // Assuming 'now' is defined elsewhere or intended to be 'new Date()'

        if (fetchError) throw fetchError;

        console.log(`[Trial Cron] Found ${expiredSubs?.length || 0} expired subscriptions.`);

        if (expiredSubs && expiredSubs.length > 0) {
            for (const sub of expiredSubs) {
                try {
                    // 2. Update status to 'past_due' (payment required)
                    await (supabase.from('subscriptions') as any).update({ status: 'past_due' }).eq('id', sub.id);
                    await (supabase.from('profiles') as any).update({ subscription_status: 'past_due' }).eq('id', sub.user_id);
                    console.log(`[Trial Cron] Subscription ${sub.id} marked as past_due.`);

                    // 3. Send "Trial Expired" email
                    const { data: profile } = await (supabase.from('profiles') as any).select('email, full_name').eq('id', sub.user_id).single();
                    if (profile?.email) {
                        await sendTemplateEmail(profile.email, 'trial-expired', {
                            name: profile.full_name || 'Consultor',
                            upgrade_url: 'https://crievalor.com.br/pricing'
                        });
                    }
                } catch (subErr) {
                    console.error(`[Trial Cron] Error processing expired sub ${sub.id}:`, subErr);
                }
            }
        }

        // 4. Find trials ending in 2 days (48-72h range)
        const warningStart = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        const warningEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const { data: warningSubs } = await (supabase
            .from('subscriptions') as any)
            .select('id, user_id')
            .eq('status', 'trialing')
            .gte('trial_ends_at', warningStart.toISOString())
            .lt('trial_ends_at', warningEnd.toISOString());

        console.log(`[Trial Cron] Found ${warningSubs?.length || 0} subscriptions for 2-day warning.`);

        if (warningSubs && warningSubs.length > 0) {
            for (const sub of warningSubs) {
                try {
                    const { data: profile } = await (supabase.from('profiles') as any).select('email, full_name').eq('id', sub.user_id).single();
                    if (profile?.email) {
                        await sendTemplateEmail(profile.email, 'trial-warning', {
                            name: profile.full_name || 'Consultor',
                            upgrade_url: 'https://crievalor.com.br/pricing',
                            days_left: '2'
                        });
                        console.log(`[Trial Cron] Warning email sent to ${profile.email}`);
                    }
                } catch (warnErr) {
                    console.error(`[Trial Cron] Error sending warning for sub ${sub.id}:`, warnErr);
                }
            }
        }

        return new Response(JSON.stringify({
            success: true,
            expired_processed: expiredSubs?.length || 0,
            warnings_sent: warningSubs?.length || 0
        }), { status: 200 });

    } catch (error: any) {
        console.error("[Trial Cron] Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config: Config = {
    schedule: "0 0 * * *" // Run every day at midnight
};
