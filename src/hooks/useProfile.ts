
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
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // Fetch user roles
  useEffect(() => {
    async function loadUserRoles() {
      if (!user) {
        setIsAdmin(false);
        setRolesLoading(false);
        return;
      }

      try {
        setRolesLoading(true);
        const { hasRole, error } = await checkUserRole(user.id, 'admin');
        
        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(hasRole);
        }
      } catch (err) {
        console.error("Error checking user roles:", err);
        setIsAdmin(false);
      } finally {
        setRolesLoading(false);
      }
    }

    loadUserRoles();
  }, [user]);

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return { error: new Error("No user logged in") };

    try {
      console.log("Original updates:", updates);
      
      // Garantir que social_media seja sempre um objeto
      let updatesToSend = { ...updates };
      
      // Se estamos atualizando social_media, garantir que está completo
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
      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error: error as Error };
    }
  }

  // Atualiza um único campo
  async function updateProfileField(field: string, value: any) {
    if (!user) return { error: new Error("No user logged in") };
    
    try {
      // Trata campos aninhados em social_media
      if (field.startsWith('social_media.')) {
        const socialField = field.split('.')[1];
        
        // Cria um objeto social_media atualizado
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
      
      // Para outros campos, cria um objeto de atualização simples
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
      const { error } = await assignUserRole(user.id, 'admin');
      
      if (error) throw error;
      
      setIsAdmin(true);
      return { error: null };
    } catch (error) {
      console.error("Error granting admin role:", error);
      return { error: error as Error };
    }
  }

  async function removeAdminRole() {
    if (!user) return { error: new Error("No user logged in") };
    
    try {
      const { error } = await removeUserRole(user.id, 'admin');
      
      if (error) throw error;
      
      setIsAdmin(false);
      return { error: null };
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
        // Atualiza o estado local
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
