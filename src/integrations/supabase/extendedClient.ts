
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Use a type assertion to extend the existing Supabase client instance
// This prevents creating a duplicate GoTrueClient instance
export const supabaseExtended = supabase as SupabaseClient<Database>;

// Export the base client for backward compatibility
export { supabase } from '@/integrations/supabase/client';
