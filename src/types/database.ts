
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
        };
      };
    } & OriginalDatabase['public']['Tables'];
  };
};
