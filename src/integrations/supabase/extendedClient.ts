
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

// Use the existing Supabase client instance to prevent duplicate GoTrueClient instances
export const supabaseExtended = supabase as SupabaseClient<Database>;
