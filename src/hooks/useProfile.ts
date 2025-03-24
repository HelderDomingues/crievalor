
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";
import { v4 as uuidv4 } from "uuid";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        // Ensure social_media is properly structured
        const formattedData = data ? {
          ...data,
          social_media: data.social_media || {
            linkedin: "",
            twitter: "",
            instagram: "",
            facebook: ""
          }
        } : null;

        setProfile(formattedData as UserProfile | null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return { error: new Error("No user logged in") };

    try {
      // Ensure we're not sending null for social_media
      const updatesToSend = { 
        ...updates,
        // If social_media is provided in updates but is null, use an empty object
        social_media: updates.social_media || profile?.social_media || {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: ""
        }
      };

      console.log("Updating profile with:", updatesToSend);

      const { data, error } = await supabase
        .from("profiles")
        .update(updatesToSend)
        .eq("id", user.id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Process the response data to ensure social_media is properly structured
      const formattedData = data ? {
        ...data,
        social_media: data.social_media || {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: ""
        }
      } : null;

      setProfile(formattedData as UserProfile | null);
      return { data: formattedData, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error: error as Error };
    }
  }

  async function uploadAvatar(file: File) {
    if (!user) return { error: new Error("No user logged in"), url: null };
    
    try {
      setAvatarUploading(true);
      
      // Check if the storage bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
      }
      
      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update the user profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: urlData.publicUrl } : null);
      
      return { error: null, url: urlData.publicUrl };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { error: error as Error, url: null };
    } finally {
      setAvatarUploading(false);
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    avatarUploading
  };
}
