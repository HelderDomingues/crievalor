
import type { Config } from "@netlify/functions";
import { supabaseAdmin } from "./lib/supabaseAdmin";
import { sendTemplateEmail } from "./lib/emailService";

/**
 * Scheduled Function: trial-ending-reminder
 *
 * Runs every day at 10:00 UTC.
 * Queries for subscriptions in 'trialing' status whose trial ends in 3 days,
 * then sends a reminder email to the user.
 */
export default async function handler() {
    console.log("[TrialReminder] Running trial-ending check...");

    // Define the 3-day window
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const startWindow = now.toISOString();
    const endWindow = in3Days.toISOString();

    // Fetch trials ending in next 3 days, joined with profiles for email
    const { data: expiringTrials, error } = await supabaseAdmin
        .from("subscriptions")
        .select("id, user_id, trial_ends_at, plan_id, profiles (email, full_name)")
        .eq("status", "trialing")
        .gte("trial_ends_at", startWindow)
        .lte("trial_ends_at", endWindow) as any;

    if (error) {
        console.error("[TrialReminder] Query error:", error.message);
        return;
    }

    if (!expiringTrials || expiringTrials.length === 0) {
        console.log("[TrialReminder] No expiring trials found.");
        return;
    }

    console.log(`[TrialReminder] Found ${expiringTrials.length} trial(s) expiring soon.`);

    for (const sub of expiringTrials) {
        const email = sub.profiles?.email;
        const name = sub.profiles?.full_name || "Consultor";

        if (!email) {
            console.warn(`[TrialReminder] No email for subscription ${sub.id}, skipping.`);
            continue;
        }

        const trialEnd = new Date(sub.trial_ends_at);
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        try {
            await sendTemplateEmail(email, "trial-ending", {
                name,
                days_left: String(daysLeft),
                plan: sub.plan_id ?? "LUMIA",
            });
            console.log(`[TrialReminder] Reminder sent to ${email} (${daysLeft} day(s) left)`);
        } catch (err: any) {
            console.error(`[TrialReminder] Failed to send to ${email}:`, err.message);
        }
    }

    console.log("[TrialReminder] Done.");
}

// Schedule: runs every day at 10:00 UTC
export const config: Config = {
    schedule: "0 10 * * *",
};
