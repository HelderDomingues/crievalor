
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

        setProfile(data);
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
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .maybeSingle();

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

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
}
