
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { formatProfileData } from "@/utils/profileFormatter";
import { v4 as uuidv4 } from "uuid";

/**
 * Busca o perfil do usuário pelo ID
 */
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>, userEmail?: string | null) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    const formattedData = formatProfileData(data, userEmail);
    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Faz upload do avatar do usuário
 */
export async function uploadUserAvatar(userId: string, file: File) {
  try {
    // Verifica se o bucket existe, cria se não existir
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        console.log("Creating avatars bucket");
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
        });
        
        if (createBucketError) {
          console.error("Error creating avatars bucket:", createBucketError);
        }
      }
    } catch (bucketError) {
      console.error("Error checking/creating avatars bucket:", bucketError);
    }
    
    // Cria um caminho único para o avatar
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;
    
    // Upload do arquivo
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type
      });
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Obter a URL pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    // Atualizar o perfil do usuário com a nova URL do avatar
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
    
    return { error: null, url: urlData.publicUrl };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { error: error as Error, url: null };
  }
}
