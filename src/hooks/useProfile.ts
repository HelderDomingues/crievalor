
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";
import { fetchUserProfile, updateUserProfile, uploadUserAvatar } from "@/services/profileService";
import { formatProfileData, formatSocialMedia } from "@/utils/profileFormatter";
import { checkUserRole, assignUserRole, removeUserRole } from "@/services/roleService";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        setRolesLoading(false);
        setIsAdmin(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await fetchUserProfile(user.id);

        if (error) {
          throw error;
        }

        const formattedData = formatProfileData(data, user.email);
        setProfile(formattedData);
        
        // Check and set admin status based on the role field
        console.log("Profile role:", formattedData?.role);
        setIsAdmin(formattedData?.role === 'admin');
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
        setRolesLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return { error: new Error("No user logged in") };

    try {
      console.log("Original updates:", updates);
      
      let updatesToSend = { ...updates };
      
      if ('social_media' in updates) {
        updatesToSend.social_media = {
          linkedin: updates.social_media?.linkedin || profile?.social_media?.linkedin || "",
          twitter: updates.social_media?.twitter || profile?.social_media?.twitter || "",
          instagram: updates.social_media?.instagram || profile?.social_media?.instagram || "",
          facebook: updates.social_media?.facebook || profile?.social_media?.facebook || ""
        };
      }
      
      console.log("Sending updates to Supabase:", updatesToSend);

      const { data, error } = await updateUserProfile(user.id, updatesToSend, user.email);

      if (error) {
        throw error;
      }

      setProfile(data);
      
      // Update isAdmin if role was changed
      if (updatesToSend.role !== undefined) {
        setIsAdmin(updatesToSend.role === 'admin');
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error: error as Error };
    }
  }

  async function updateProfileField(field: string, value: any) {
    if (!user) return { error: new Error("No user logged in") };
    
    try {
      if (field.startsWith('social_media.')) {
        const socialField = field.split('.')[1];
        
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
      
      const updates = { [field]: value };
      return updateProfile(updates);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async function grantAdminRole() {
    if (!user) return { error: new Error("No user logged in") };
    
    try {
      console.log("useProfile: Attempting to grant admin role to user:", user.id);
      const { success, error } = await assignUserRole(user.id, 'admin');
      
      if (error) {
        console.error("useProfile: Error from assignUserRole:", error);
        return { error };
      }
      
      if (success) {
        console.log("useProfile: Successfully granted admin role");
        setIsAdmin(true);
        setProfile(prev => prev ? { ...prev, role: 'admin' } : null);
        return { error: null };
      } else {
        console.error("useProfile: Failed to grant admin role (no success reported)");
        return { error: new Error("Falha ao conceder privilégios de administrador") };
      }
    } catch (error) {
      console.error("useProfile: Exception in grantAdminRole:", error);
      return { error: error as Error };
    }
  }

  async function removeAdminRole() {
    if (!user) return { error: new Error("No user logged in") };
    
    try {
      const { success, error } = await removeUserRole(user.id, 'admin');
      
      if (error) throw error;
      
      if (success) {
        setIsAdmin(false);
        setProfile(prev => prev ? { ...prev, role: 'user' } : null);
        return { error: null };
      } else {
        return { error: new Error("Failed to remove admin role") };
      }
    } catch (error) {
      console.error("Error removing admin role:", error);
      return { error: error as Error };
    }
  }

  async function uploadAvatar(file: File) {
    if (!user) return { error: new Error("No user logged in"), url: null };
    
    try {
      setAvatarUploading(true);
      const result = await uploadUserAvatar(user.id, file);
      
      if (result.url) {
        setProfile(prev => prev ? { ...prev, avatar_url: result.url } : null);
      }
      
      return result;
    } catch (error) {
      console.error("Error in uploadAvatar:", error);
      return { error: error as Error, url: null };
    } finally {
      setAvatarUploading(false);
    }
  }

  return {
    profile,
    loading,
    error,
    isAdmin,
    rolesLoading,
    updateProfile,
    updateProfileField,
    uploadAvatar,
    avatarUploading,
    grantAdminRole,
    removeAdminRole
  };
}
