
import { Database as OriginalDatabase } from '@/integrations/supabase/types';

// Extend the original Database type with our new tables
export type ExtendedDatabase = OriginalDatabase & {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          file_url: string;
          thumbnail_url: string | null;
          plan_level: string;
          access_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          file_url: string;
          thumbnail_url?: string | null;
          plan_level: string;
          access_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          file_url?: string;
          thumbnail_url?: string | null;
          plan_level?: string;
          access_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      material_accesses: {
        Row: {
          id: string;
          material_id: string;
          user_id: string;
          accessed_at: string;
        };
        Insert: {
          id?: string;
          material_id: string;
          user_id: string;
          accessed_at?: string;
        };
        Update: {
          id?: string;
          material_id?: string;
          user_id?: string;
          accessed_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
        };
      };
    } & OriginalDatabase['public']['Tables'];
  };
};
