
import { supabase } from "@/integrations/supabase/client";

export const getSystemSetting = async (key: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error('Error fetching system setting:', error);
      return null;
    }

    return data?.value || null;
  } catch (error) {
    console.error('Error in getSystemSetting:', error);
    return null;
  }
};

export const upsertSystemSetting = async (
  key: string,
  value: string,
  description?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        {
          key,
          value,
          description,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.error('Error upserting system setting:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in upsertSystemSetting:', error);
    return false;
  }
};
