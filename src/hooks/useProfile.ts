
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";
import { formatProfileData } from "@/utils/profileFormatter";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [rolesLoading, setRolesLoading] = useState<boolean>(true);

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
        if (profile?.role === "admin") {
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

  return { profile, isLoading, error, isAdmin, rolesLoading };
};
