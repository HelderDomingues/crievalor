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

            // 1. Check if user already exists in SIO_MAR (Idempotency)
            const { data: existingUser } = await supabaseSioMar.auth.admin.getUserById(userId);

            if (existingUser?.user) {
                console.log(`[SyncSioMar] User ${userId} already exists in SIO_MAR. Proceeding to update workspace context.`);
            } else {
                // 2. Create the user in SIO_MAR using the same UUID
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
                    console.error('[SyncSioMar] Error creating user in SIO_MAR:', createError.message);
                    return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
                }
                console.log(`[SyncSioMar] User ${userId} successfully created in SIO_MAR.`);
            }

            // 3. Upsert Workspace Context if workspace info is provided
            if (workspaceId && workspaceName) {
                const { error: contextError } = await supabaseSioMar.from('workspace_context').upsert({
                    user_id: userId,
                    workspace_id: workspaceId,
                    workspace_name: workspaceName,
                    plan_level: planLevel || 'free',
                    seat_limit: seatLimit || 1,
                    role: role || 'member',
                    crievalor_sub_id: subscriptionId || null,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

                if (contextError) {
                    console.error('[SyncSioMar] Error upserting workspace_context:', contextError.message);
                    // Do not fail the request if just the context fails, as the user was created.
                } else {
                    console.log(`[SyncSioMar] Workspace context upserted for user ${userId}.`);
                }
            }

            // 4. Mark as synced in local crievalor DB
            const { error: updateLocalError } = await supabaseAdmin
                .from('profiles')
                .update({
                    sio_mar_synced: true,
                    sio_mar_synced_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (updateLocalError) {
                console.error('[SyncSioMar] Error marking as synced locally:', updateLocalError.message);
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
