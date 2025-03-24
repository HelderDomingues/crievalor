
import { createClient } from '@supabase/supabase-js';
import { ExtendedDatabase } from '@/types/database';

const SUPABASE_URL = "https://nmxfknwkhnengqqjtwru.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teGZrbndraG5lbmdxcWp0d3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTUyMjgsImV4cCI6MjA1ODIzMTIyOH0.3I_qClajzP-s1j_GF2WRY7ZkVSWC4fcLgKMH8Ut-TbA";

// Import this client instead of the regular one when dealing with the extended tables
export const supabaseExtended = createClient<ExtendedDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
