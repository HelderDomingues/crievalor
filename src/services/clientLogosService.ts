
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  created_at: string;
}

/**
 * Fetches client logos from the database
 * @returns {Promise<ClientLogo[]>} Promise that resolves to an array of client logos
 */
export const fetchClientLogos = async (): Promise<ClientLogo[]> => {
  try {
    console.log("Fetching client logos...");
    const { data, error } = await supabaseExtended
      .from("client_logos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client logos:", error);
      throw new Error(`Failed to fetch client logos: ${error.message}`);
    }

    console.log("Client logos data from DB:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchClientLogos:", error);
    throw error;
  }
};

/**
 * Adds a new client logo to the database
 * @param name Client name
 * @param logoUrl URL of the logo (external URL)
 */
export const addClientLogo = async (name: string, logoUrl: string): Promise<void> => {
  try {
    // Insert record directly with the external URL
    const { error } = await supabaseExtended
      .from('client_logos')
      .insert({
        name,
        logo: logoUrl
      });

    if (error) {
      console.error("Error inserting logo record:", error);
      throw new Error(`Failed to create logo record: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in addClientLogo:", error);
    throw error;
  }
};

/**
 * Deletes a client logo from the database
 * @param id ID of the logo to delete
 */
export const deleteClientLogo = async (id: string): Promise<void> => {
  try {
    // Remove the record from the database
    const { error: deleteError } = await supabaseExtended
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error("Error deleting logo record:", deleteError);
      throw new Error(`Failed to delete logo record: ${deleteError.message}`);
    }
  } catch (error) {
    console.error("Error in deleteClientLogo:", error);
    throw error;
  }
};

/**
 * Adds multiple client logos at once (useful for initial setup)
 * @param logos Array of {name, logoUrl} objects
 */
export const addMultipleClientLogos = async (
  logos: Array<{ name: string; logoUrl: string }>
): Promise<void> => {
  try {
    const records = logos.map(logo => ({
      name: logo.name,
      logo: logo.logoUrl
    }));

    const { error } = await supabaseExtended
      .from('client_logos')
      .insert(records);

    if (error) {
      console.error("Error inserting multiple logo records:", error);
      throw new Error(`Failed to create logo records: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in addMultipleClientLogos:", error);
    throw error;
  }
};
