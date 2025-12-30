
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, AuthState } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signUp: async () => ({ error: null, data: null }),
  signIn: async () => ({ error: null, data: null }),
  signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setState({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string, fullName?: string) => {
    try {
      const userData = {
        username: username || email.split("@")[0],
        full_name: fullName,
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (data?.user) {
        console.log("User signed up successfully:", data.user.id);

        // Explicitly create/update profile as a backup for the database trigger
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            username: userData.username,
            full_name: userData.full_name,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error creating/updating profile during sign up:", profileError);
        }
      }

      return { data, error };
    } catch (error) {
      console.error("Error during sign up:", error);
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
      } else if (data?.user) {
        console.log("User signed in successfully:", data.user.id);
      }

      return { data, error };
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
