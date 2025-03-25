
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

        // Ensure social_media is properly structured as an object, never null
        const social_media = data?.social_media || {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: ""
        };

        const formattedData = data ? {
          ...data,
          social_media: social_media
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
      console.log("Original updates:", updates);
      
      // Make sure social_media is always an object
      let updatesToSend = { ...updates };
      
      // If we're updating social_media, ensure it's complete
      if ('social_media' in updates) {
        updatesToSend.social_media = {
          linkedin: updates.social_media?.linkedin || profile?.social_media?.linkedin || "",
          twitter: updates.social_media?.twitter || profile?.social_media?.twitter || "",
          instagram: updates.social_media?.instagram || profile?.social_media?.instagram || "",
          facebook: updates.social_media?.facebook || profile?.social_media?.facebook || ""
        };
      }
      
      console.log("Sending updates to Supabase:", updatesToSend);

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
      const social_media = data?.social_media || {
        linkedin: "",
        twitter: "",
        instagram: "",
        facebook: ""
      };

      const formattedData = data ? {
        ...data,
        social_media: social_media
      } : null;

      setProfile(formattedData as UserProfile | null);
      return { data: formattedData, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error: error as Error };
    }
  }

  // Update a single field
  async function updateProfileField(field: string, value: any) {
    if (!user) return { error: new Error("No user logged in") };
    
    try {
      // Handle nested social_media fields
      if (field.startsWith('social_media.')) {
        const socialField = field.split('.')[1];
        
        // Create an updated social_media object
        const updatedSocialMedia = {
          ...(profile?.social_media || {
            linkedin: "",
            twitter: "",
            instagram: "",
            facebook: ""
          }),
          [socialField]: value
        };
        
        return updateProfile({ social_media: updatedSocialMedia });
      }
      
      // For other fields, create a simple update object
      const updates = { [field]: value };
      return updateProfile(updates);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async function uploadAvatar(file: File) {
    if (!user) return { error: new Error("No user logged in"), url: null };
    
    try {
      setAvatarUploading(true);
      
      // Check if the storage bucket exists, create if not
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
        // Continue with upload attempt even if bucket check/creation fails
      }
      
      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading avatar to path: ${filePath}`);
      
      // Upload the file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });
        
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }
      
      console.log("File uploaded successfully:", uploadData);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      console.log("Public URL:", urlData.publicUrl);
      
      // Update the user profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Error updating profile with avatar URL:", updateError);
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
    updateProfileField,
    uploadAvatar,
    avatarUploading
  };
}
