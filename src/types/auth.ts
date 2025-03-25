
import { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username?: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  company_address: string | null;
  website: string | null;
  social_media: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
  cnpj: string | null;
  cpf: string | null;
  email?: string | null;
}
