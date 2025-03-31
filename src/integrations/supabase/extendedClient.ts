
import { supabase } from '@/integrations/supabase/client';
import { ExtendedDatabase } from '@/types/database';

// Re-export the existing Supabase client with the extended database type
// This solves the multiple GoTrueClient instances issue
export const supabaseExtended = supabase as unknown as ExtendedDatabase;
