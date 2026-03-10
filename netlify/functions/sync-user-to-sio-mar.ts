import { BaseController } from "./baseController";
import { Context } from "@netlify/functions";
import { supabaseSioMar } from "./lib/supabaseSioMar";
import { supabaseAdmin } from "./lib/supabaseAdmin";

class SyncUserToSioMarController extends BaseController {
    protected async handleRequest(req: Request, _ctx: Context): Promise<Response> {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
        }

        try {
            const body = await req.json();
            const { userId, email, name, workspaceId, workspaceName, planLevel, seatLimit, role, subscriptionId } = body;

            if (!userId || !email) {
                return new Response(JSON.stringify({ error: "userId and email are required" }), { status: 400 });
            }

            console.log(`[SyncSioMar] Starting sync for user: ${userId} (${email})`);

            // 2. Create the user in SIO_MAR Auth if missing
            const { data: userData } = await supabaseSioMar.auth.admin.getUserById(userId);

            if (!userData?.user) {
                const { error: createError } = await supabaseSioMar.auth.admin.createUser({
                    id: userId,
                    email: email,
                    email_confirm: true,
                    user_metadata: {
                        name: name || '',
                        synced_from: 'crievalor',
                        synced_at: new Date().toISOString()
                    }
                });

                if (createError) {
                    console.error('[SyncSioMar] Error creating auth user in SIO_MAR:', createError.message);
                    return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
                }
                console.log(`[SyncSioMar] Auth User ${userId} created in SIO_MAR.`);
            }

            // --- DATA INTEGRITY: Sync SIO_MAR Profiles table ---
            // Even if workspace sync fails, we WANT the profile to exist
            const { error: profileError } = await supabaseSioMar.from('profiles').upsert({
                id: userId,
                full_name: name || '',
                user_email: email,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

            if (profileError) {
                console.error('[SyncSioMar] Error upserting profile in SIO_MAR:', profileError.message);
                // We continue, as auth user is already created/exists
            } else {
                console.log(`[SyncSioMar] Profile upserted for user ${userId} in SIO_MAR.`);
            }

            // 3. Upsert Workspace Context if workspace info is provided
            if (workspaceId && workspaceName) {
                // Map plan ID to normalized level and seat limit
                // IDs in Website DB are 'basico', 'intermediario', 'avancado'
                let finalPlanLevel = 'free';
                let finalSeatLimit = 1;

                if (planLevel === 'basico' || planLevel === 'Básico') {
                    finalPlanLevel = 'free'; // Basic trial is free in SIO_MAR terms? No, wait. 
                    // Let's stick to the SIO_MAR constraint: free, pro, enterprise
                    finalPlanLevel = 'pro'; 
                    finalSeatLimit = 1;
                } else if (planLevel === 'intermediario' || planLevel === 'Intermediário') {
                    finalPlanLevel = 'pro';
                    finalSeatLimit = 3;
                } else if (planLevel === 'avancado' || planLevel === 'Avançado' || planLevel === 'v-test') {
                    finalPlanLevel = 'pro';
                    finalSeatLimit = 5;
                }

                const { error: contextError } = await supabaseSioMar.from('workspace_context').upsert({
                    user_id: userId,
                    workspace_id: workspaceId,
                    workspace_name: workspaceName,
                    plan_level: finalPlanLevel,
                    seat_limit: finalSeatLimit,
                    role: role || 'admin', // Default to admin for the primary synced user
                    crievalor_sub_id: subscriptionId || null,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

                if (contextError) {
                    console.error('[SyncSioMar] Error upserting workspace_context:', contextError.message);
                } else {
                    console.log(`[SyncSioMar] Workspace context (Plan: ${finalPlanLevel}, Seats: ${finalSeatLimit}) upserted for user ${userId}.`);
                }
            }

            // 4. Mark as synced in local Website DB
            try {
                const { error: updateLocalError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        sio_mar_synced: true,
                        sio_mar_synced_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (updateLocalError) {
                    // Check if it's a "column does not exist" error
                    if (updateLocalError.message.includes('column') && updateLocalError.message.includes('not find')) {
                        console.warn('[SyncSioMar] LOCAL SYNC TRACKING FAILED: Columns sio_mar_synced/at missing in DB. Sync to SIO_MAR was still successful.');
                    } else {
                        console.error('[SyncSioMar] Error marking as synced locally:', updateLocalError.message);
                    }
                }
            } catch (localErr: any) {
                console.warn('[SyncSioMar] Local update exception (likely missing columns):', localErr.message);
            }

            return new Response(JSON.stringify({ success: true }), { status: 200 });

        } catch (error: any) {
            console.error("[SyncSioMar] Unexpected error:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    }
}

const controller = new SyncUserToSioMarController();
export const handler = controller.handler.bind(controller);
