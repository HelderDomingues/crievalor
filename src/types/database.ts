
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

// Extend the original Database type with our new tables
export type ExtendedDatabaseTables = OriginalDatabase & {
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
      client_logos: {
        Row: {
          id: string;
          name: string;
          logo: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo?: string;
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
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          asaas_customer_id: string | null;
          asaas_subscription_id: string | null;
          asaas_payment_link: string | null;
          plan_id: string;
          status: string;
          installments: number;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
          contract_accepted: boolean | null;
          contract_accepted_at: string | null;
          payment_status: string | null;
          payment_id: string | null;
          external_reference: string | null;
          payment_details: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          asaas_customer_id?: string | null;
          asaas_subscription_id?: string | null;
          asaas_payment_link?: string | null;
          plan_id: string;
          status: string;
          installments?: number;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
          contract_accepted?: boolean | null;
          contract_accepted_at?: string | null;
          payment_status?: string | null;
          payment_id?: string | null;
          external_reference?: string | null;
          payment_details?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          asaas_customer_id?: string | null;
          asaas_subscription_id?: string | null;
          asaas_payment_link?: string | null;
          plan_id?: string;
          status?: string;
          installments?: number;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
          contract_accepted?: boolean | null;
          contract_accepted_at?: string | null;
          payment_status?: string | null;
          payment_id?: string | null;
          external_reference?: string | null;
          payment_details?: Json | null;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          type: string;
          price: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          type: string;
          price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          type?: string;
          price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_products: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          status: string;
          access_granted_at: string;
          access_expires_at: string | null;
          granted_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          status?: string;
          access_granted_at?: string;
          access_expires_at?: string | null;
          granted_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          status?: string;
          access_granted_at?: string;
          access_expires_at?: string | null;
          granted_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_resources: {
        Row: {
          id: string;
          product_id: string;
          resource_type: string;
          resource_id: string | null;
          resource_path: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          resource_type: string;
          resource_id?: string | null;
          resource_path?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          resource_type?: string;
          resource_id?: string | null;
          resource_path?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
    } & OriginalDatabase['public']['Tables'];
    Views: {
      user_active_products: {
        Row: {
          user_id: string;
          product_id: string;
          slug: string;
          name: string;
          has_access: boolean;
          access_expires_at: string | null;
        };
      };
    } & OriginalDatabase['public']['Views'];
    Functions: {
      get_user_products: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          id: string;
          slug: string;
          name: string;
          type: string;
          has_access: boolean;
          access_granted_at: string;
          access_expires_at: string | null;
          status: string;
        }[];
      };
      user_can_access_resource: {
        Args: {
          p_user_id: string;
          p_resource_type: string;
          p_resource_id?: string;
          p_resource_path?: string;
        };
        Returns: boolean;
      };
    } & OriginalDatabase['public']['Functions'];
  };
};

// Export the full type that includes all methods from the original SupabaseClient
export type ExtendedDatabase = SupabaseClient<ExtendedDatabaseTables>;
