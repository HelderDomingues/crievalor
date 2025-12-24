
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";
import { formatProfileData } from "@/utils/profileFormatter";
import { uploadUserAvatar, updateUserProfile } from "@/services/profileService";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [rolesLoading, setRolesLoading] = useState<boolean>(true);
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setError(error);
        } else {
          const formattedProfile = formatProfileData(data, user.email);
          setProfile(formattedProfile);
        }
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setRolesLoading(false);
        return;
      }

      try {
        setRolesLoading(true);

        // First, check if user has admin role in user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleError) {
          console.error("Error checking admin role:", roleError);
        } else if (roleData) {
          setIsAdmin(true);
          setRolesLoading(false);
          return;
        }

        // If no explicit role, check if user's profile has admin role
        if (["admin", "owner"].includes(profile?.role || "")) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      } finally {
        setRolesLoading(false);
      }
    };

    checkAdmin();
  }, [user, profile]);

  // Update a specific profile field
  const updateProfileField = async (fieldName: string, value: string) => {
    if (!user) {
      return { error: new Error("No user logged in") };
    }

    try {
      let updates: Partial<UserProfile> = {};

      // Handle special case for social media fields
      if (fieldName.startsWith("social_media.")) {
        const platform = fieldName.split(".")[1];
        const currentSocialMedia = profile?.social_media || {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: ""
        };

        updates = {
          social_media: {
            ...currentSocialMedia,
            [platform]: value
          }
        };
      } else {
        updates = { [fieldName]: value };
      }

      const { data, error } = await updateUserProfile(user.id, updates, user.email);

      if (error) {
        console.error(`Error updating ${fieldName}:`, error);
        return { error };
      }

      if (data) {
        setProfile(data);
      }

      return { error: null };
    } catch (err) {
      console.error(`Unexpected error updating ${fieldName}:`, err);
      return { error: err as Error };
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { error: new Error("No user logged in"), url: null };
    }

    try {
      setAvatarUploading(true);
      const result = await uploadUserAvatar(user.id, file);

      if (result.error) {
        console.error("Error uploading avatar:", result.error);
        return { error: result.error, url: null };
      }

      if (result.url && profile) {
        // Update local profile state with new avatar URL
        setProfile({
          ...profile,
          avatar_url: result.url
        });
      }

      return { error: null, url: result.url };
    } catch (err) {
      console.error("Unexpected error uploading avatar:", err);
      return { error: err as Error, url: null };
    } finally {
      setAvatarUploading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    isAdmin,
    rolesLoading,
    uploadAvatar,
    avatarUploading,
    updateProfileField
  };
};
