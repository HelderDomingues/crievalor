import { createClient } from '@supabase/supabase-js';

const sioMarUrl = process.env.LUMIA_SUPABASE_URL;
const sioMarKey = process.env.LUMIA_SERVICE_ROLE_KEY;

if (!sioMarUrl || !sioMarKey) {
    // We log this as a warning instead of throwing outright to prevent 
    // crashing the entire Netlify build if env vars are momentarily missing
    console.warn('[SioMar] LUMIA_SUPABASE_URL or LUMIA_SERVICE_ROLE_KEY not configured.');
}

// We use the Service Role key to bypass RLS in the SIO_MAR project
// since these operations are triggered backend-to-backend.
export const supabaseSioMar = createClient(
    sioMarUrl || 'https://placeholder.supabase.co',
    sioMarKey || 'placeholder-key',
    {
        auth: {
            persistSession: false, // Server-side environment, no need to persist
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    }
);
