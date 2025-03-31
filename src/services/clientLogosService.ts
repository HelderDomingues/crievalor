
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export interface ClientLogo {
  id?: string;
  name: string;
  logo: string;
}

/**
 * Fetches client logos from the database
 */
export const fetchClientLogos = async (): Promise<ClientLogo[]> => {
  try {
    const { data, error } = await supabaseExtended
      .from('client_logos')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return data as ClientLogo[] || [];
  } catch (error) {
    console.error('Error fetching client logos:', error);
    return [];
  }
};
