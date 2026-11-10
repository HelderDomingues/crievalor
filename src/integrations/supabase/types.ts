export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      atualizar: {
        Row: {
          created_at: string
          id: number
          numero: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          numero?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          numero?: number | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
          social_links: Json | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          created_at: string
          id: string
          logo: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      diagnostic_requests: {
        Row: {
          company_name: string | null
          company_size: string | null
          completed_date: string | null
          created_at: string | null
          current_revenue: string | null
          desired_results: string | null
          email: string
          id: string
          lead_id: string | null
          main_challenge: string | null
          metadata: Json | null
          name: string
          phone: string
          report_generated: boolean | null
          scheduled_date: string | null
          status: string | null
          timeline: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          company_size?: string | null
          completed_date?: string | null
          created_at?: string | null
          current_revenue?: string | null
          desired_results?: string | null
          email: string
          id?: string
          lead_id?: string | null
          main_challenge?: string | null
          metadata?: Json | null
          name: string
          phone: string
          report_generated?: boolean | null
          scheduled_date?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          company_size?: string | null
          completed_date?: string | null
          created_at?: string | null
          current_revenue?: string | null
          desired_results?: string | null
          email?: string
          id?: string
          lead_id?: string | null
          main_challenge?: string | null
          metadata?: Json | null
          name?: string
          phone?: string
          report_generated?: boolean | null
          scheduled_date?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      event_leads: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          id: string
          instagram: string | null
          lecture_date: string | null
          lecture_id: string | null
          material_sent: boolean
          name: string
          notes: string | null
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          instagram?: string | null
          lecture_date?: string | null
          lecture_id?: string | null
          material_sent?: boolean
          name: string
          notes?: string | null
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          instagram?: string | null
          lecture_date?: string | null
          lecture_id?: string | null
          material_sent?: boolean
          name?: string
          notes?: string | null
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_leads_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      image_placeholders: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string | null
          id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          category: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          id: string
          lead_source: string
          metadata: Json | null
          name: string | null
          notes: string | null
          phone: string
          qualification: string | null
          service_interest: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp_conversation_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lead_source?: string
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          phone: string
          qualification?: string | null
          service_interest?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_conversation_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lead_source?: string
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          phone?: string
          qualification?: string | null
          service_interest?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_conversation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_whatsapp_conversation_id_fkey"
            columns: ["whatsapp_conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          speaker: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          speaker?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          speaker?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      material_accesses: {
        Row: {
          accessed_at: string | null
          id: string
          material_id: string | null
          user_id: string | null
        }
        Insert: {
          accessed_at?: string | null
          id?: string
          material_id?: string | null
          user_id?: string | null
        }
        Update: {
          accessed_at?: string | null
          id?: string
          material_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_accesses_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      material_folders: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_number: number | null
          parent_id: string | null
          product_id: string | null
          product_types: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_number?: number | null
          parent_id?: string | null
          product_id?: string | null
          product_types?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_number?: number | null
          parent_id?: string | null
          product_id?: string | null
          product_types?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "material_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_folders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          access_count: number | null
          category: string
          created_at: string | null
          description: string
          file_url: string
          folder_id: string | null
          id: string
          plan_level: string
          product_id: string | null
          product_types: string[] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          access_count?: number | null
          category: string
          created_at?: string | null
          description: string
          file_url: string
          folder_id?: string | null
          id?: string
          plan_level: string
          product_id?: string | null
          product_types?: string[] | null
          thumbnail_url?: string | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          access_count?: number | null
          category?: string
          created_at?: string | null
          description?: string
          file_url?: string
          folder_id?: string | null
          id?: string
          plan_level?: string
          product_id?: string | null
          product_types?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "material_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      netcred_payments: {
        Row: {
          amount: number
          created_at: string | null
          external_id: string
          id: string
          payload: Json | null
          payment_method: string | null
          status: string
          subscription_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          external_id: string
          id?: string
          payload?: Json | null
          payment_method?: string | null
          status: string
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          external_id?: string
          id?: string
          payload?: Json | null
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "netcred_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_content: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          client: string | null
          cover_image: string
          created_at: string
          description: string
          gallery: string[]
          id: string
          project_date: string | null
          project_url: string | null
          sort_order: number
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          client?: string | null
          cover_image: string
          created_at?: string
          description?: string
          gallery?: string[]
          id?: string
          project_date?: string | null
          project_url?: string | null
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client?: string | null
          cover_image?: string
          created_at?: string
          description?: string
          gallery?: string[]
          id?: string
          project_date?: string | null
          project_url?: string | null
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          display_author_id: string | null
          excerpt: string | null
          featured: boolean
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          display_author_id?: string | null
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          display_author_id?: string | null
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_display_author_id_fkey"
            columns: ["display_author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_resources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          product_id: string
          resource_id: string | null
          resource_path: string | null
          resource_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          product_id: string
          resource_id?: string | null
          resource_path?: string | null
          resource_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          product_id?: string
          resource_id?: string | null
          resource_path?: string | null
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_resources_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number | null
          slug: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          slug: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          slug?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cnpj: string | null
          company_address: string | null
          company_name: string | null
          cpf: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          sio_mar_synced: boolean
          sio_mar_synced_at: string | null
          social_media: Json | null
          subscription_status: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          cnpj?: string | null
          company_address?: string | null
          company_name?: string | null
          cpf?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          sio_mar_synced?: boolean
          sio_mar_synced_at?: string | null
          social_media?: Json | null
          subscription_status?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          cnpj?: string | null
          company_address?: string | null
          company_name?: string | null
          cpf?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          sio_mar_synced?: boolean
          sio_mar_synced_at?: string | null
          social_media?: Json | null
          subscription_status?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          question_id: string
          question_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          question_id: string
          question_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          question_id?: string
          question_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_responses_flat"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_submission_details"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "quiz_answers_question_text_fkey"
            columns: ["question_text"]
            isOneToOne: true
            referencedRelation: "quiz_questions"
            referencedColumns: ["text"]
          },
          {
            foreignKeyName: "quiz_answers_question_text_fkey"
            columns: ["question_text"]
            isOneToOne: true
            referencedRelation: "quiz_responses_flat"
            referencedColumns: ["question_text"]
          },
          {
            foreignKeyName: "quiz_answers_question_text_fkey"
            columns: ["question_text"]
            isOneToOne: true
            referencedRelation: "quiz_submission_details"
            referencedColumns: ["question_text"]
          },
        ]
      }
      quiz_modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_number: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_number: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          created_at: string
          id: string
          order_number: number
          question_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number: number
          question_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: number
          question_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_responses_flat"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_submission_details"
            referencedColumns: ["question_id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          hint: string | null
          id: string
          module_id: string
          module_tittle: string | null
          order_number: number
          required: boolean
          text: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hint?: string | null
          id?: string
          module_id: string
          module_tittle?: string | null
          order_number: number
          required?: boolean
          text?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hint?: string | null
          id?: string
          module_id?: string
          module_tittle?: string | null
          order_number?: number
          required?: boolean
          text?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "quiz_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_respostas_completas: {
        Row: {
          company_name: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          m1_cargo: string | null
          m1_email: string | null
          m1_empresa: string | null
          m1_nome: string | null
          m1_telefone: string | null
          m2_faturamento: string | null
          m2_funcionarios: string | null
          m2_localizacao: string | null
          m2_segmento: string | null
          m2_site: string | null
          m2_tempo_atuacao: string | null
          m3_instagram_concorrente_a: string | null
          m3_instagram_concorrente_b: string | null
          m3_instagram_concorrente_c: string | null
          m3_instagram_empresa: string | null
          m3_presenca_digital: string | null
          m3_principais_canais: string | null
          m4_acoes_marketing: string | null
          m4_atuais_campanhas: string | null
          m4_desafios_atuais: string | null
          m4_investimento_marketing: string | null
          m5_canais_vendas: string | null
          m5_equipe_comercial: string | null
          m5_estrategia_comercial: string | null
          m5_metas_vendas: string | null
          m5_processo_vendas: string | null
          m5_sistema_crm: string | null
          m6_expectativas: string | null
          m6_prazo_resultados: string | null
          m6_principais_desafios: string | null
          m6_resultados_esperados: string | null
          m7_como_conheceu: string | null
          m7_detalhes_adicionais: string | null
          m7_preferencia_contato: string | null
          submission_id: string | null
          updated_at: string | null
          user_id: string
          webhook_processed: boolean | null
        }
        Insert: {
          company_name?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          m1_cargo?: string | null
          m1_email?: string | null
          m1_empresa?: string | null
          m1_nome?: string | null
          m1_telefone?: string | null
          m2_faturamento?: string | null
          m2_funcionarios?: string | null
          m2_localizacao?: string | null
          m2_segmento?: string | null
          m2_site?: string | null
          m2_tempo_atuacao?: string | null
          m3_instagram_concorrente_a?: string | null
          m3_instagram_concorrente_b?: string | null
          m3_instagram_concorrente_c?: string | null
          m3_instagram_empresa?: string | null
          m3_presenca_digital?: string | null
          m3_principais_canais?: string | null
          m4_acoes_marketing?: string | null
          m4_atuais_campanhas?: string | null
          m4_desafios_atuais?: string | null
          m4_investimento_marketing?: string | null
          m5_canais_vendas?: string | null
          m5_equipe_comercial?: string | null
          m5_estrategia_comercial?: string | null
          m5_metas_vendas?: string | null
          m5_processo_vendas?: string | null
          m5_sistema_crm?: string | null
          m6_expectativas?: string | null
          m6_prazo_resultados?: string | null
          m6_principais_desafios?: string | null
          m6_resultados_esperados?: string | null
          m7_como_conheceu?: string | null
          m7_detalhes_adicionais?: string | null
          m7_preferencia_contato?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id: string
          webhook_processed?: boolean | null
        }
        Update: {
          company_name?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          m1_cargo?: string | null
          m1_email?: string | null
          m1_empresa?: string | null
          m1_nome?: string | null
          m1_telefone?: string | null
          m2_faturamento?: string | null
          m2_funcionarios?: string | null
          m2_localizacao?: string | null
          m2_segmento?: string | null
          m2_site?: string | null
          m2_tempo_atuacao?: string | null
          m3_instagram_concorrente_a?: string | null
          m3_instagram_concorrente_b?: string | null
          m3_instagram_concorrente_c?: string | null
          m3_instagram_empresa?: string | null
          m3_presenca_digital?: string | null
          m3_principais_canais?: string | null
          m4_acoes_marketing?: string | null
          m4_atuais_campanhas?: string | null
          m4_desafios_atuais?: string | null
          m4_investimento_marketing?: string | null
          m5_canais_vendas?: string | null
          m5_equipe_comercial?: string | null
          m5_estrategia_comercial?: string | null
          m5_metas_vendas?: string | null
          m5_processo_vendas?: string | null
          m5_sistema_crm?: string | null
          m6_expectativas?: string | null
          m6_prazo_resultados?: string | null
          m6_principais_desafios?: string | null
          m6_resultados_esperados?: string | null
          m7_como_conheceu?: string | null
          m7_detalhes_adicionais?: string | null
          m7_preferencia_contato?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_processed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_respostas_completas_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "quiz_responses_flat"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "quiz_respostas_completas_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "quiz_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submissions: {
        Row: {
          completed: boolean
          completed_at: string | null
          contact_consent: boolean
          created_at: string
          current_module: number
          email: string | null
          id: string
          started_at: string
          updated_at: string
          user_id: string
          webhook_processed: boolean | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          contact_consent?: boolean
          created_at?: string
          current_module?: number
          email?: string | null
          id?: string
          started_at?: string
          updated_at?: string
          user_id: string
          webhook_processed?: boolean | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          contact_consent?: boolean
          created_at?: string
          current_module?: number
          email?: string | null
          id?: string
          started_at?: string
          updated_at?: string
          user_id?: string
          webhook_processed?: boolean | null
        }
        Relationships: []
      }
      storage_buckets_metadata: {
        Row: {
          bucket_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          bucket_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          bucket_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          contract_accepted: boolean | null
          contract_accepted_at: string | null
          created_at: string
          current_period_end: string | null
          external_reference: string | null
          id: string
          installments: number | null
          netcred_id: string | null
          payment_details: Json | null
          payment_id: string | null
          payment_status: string | null
          plan_id: string
          status: string
          trial_ends_at: string | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          contract_accepted?: boolean | null
          contract_accepted_at?: string | null
          created_at?: string
          current_period_end?: string | null
          external_reference?: string | null
          id?: string
          installments?: number | null
          netcred_id?: string | null
          payment_details?: Json | null
          payment_id?: string | null
          payment_status?: string | null
          plan_id: string
          status: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          contract_accepted?: boolean | null
          contract_accepted_at?: string | null
          created_at?: string
          current_period_end?: string | null
          external_reference?: string | null
          id?: string
          installments?: number | null
          netcred_id?: string | null
          payment_details?: Json | null
          payment_id?: string | null
          payment_status?: string | null
          plan_id?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      system_installation_status: {
        Row: {
          component: string
          created_at: string | null
          id: number
          message: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          component: string
          created_at?: string | null
          id?: number
          message?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          component?: string
          created_at?: string | null
          id?: number
          message?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean | null
          company: string
          created_at: string | null
          id: string
          name: string
          photo_path: string | null
          role: string
          text: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company: string
          created_at?: string | null
          id?: string
          name: string
          photo_path?: string | null
          role: string
          text: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company?: string
          created_at?: string | null
          id?: string
          name?: string
          photo_path?: string | null
          role?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_products: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string
          created_at: string
          granted_by: string | null
          id: string
          notes: string | null
          product_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_expires_at?: string | null
          access_granted_at?: string
          created_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          product_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_expires_at?: string | null
          access_granted_at?: string
          created_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          conversation_status: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          lead_qualification: string | null
          metadata: Json | null
          phone_number: string
          source: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_status?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          lead_qualification?: string | null
          metadata?: Json | null
          phone_number: string
          source?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_status?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          lead_qualification?: string | null
          metadata?: Json | null
          phone_number?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          direction: string
          id: string
          media_url: string | null
          message_id: string | null
          message_type: string | null
          metadata: Json | null
          phone_number: string
          status: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          direction: string
          id?: string
          media_url?: string | null
          message_id?: string | null
          message_type?: string | null
          metadata?: Json | null
          phone_number: string
          status?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          direction?: string
          id?: string
          media_url?: string | null
          message_id?: string | null
          message_type?: string | null
          metadata?: Json | null
          phone_number?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          plan_level: string | null
          seat_limit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          plan_level?: string | null
          seat_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          plan_level?: string | null
          seat_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      quiz_responses_flat: {
        Row: {
          answer: string | null
          company_name: string | null
          completed: boolean | null
          completed_at: string | null
          contact_consent: boolean | null
          email: string | null
          full_name: string | null
          question_id: string | null
          question_text: string | null
          started_at: string | null
          submission_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      quiz_submission_details: {
        Row: {
          answer: string | null
          question_id: string | null
          question_text: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_active_products: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string | null
          created_at: string | null
          description: string | null
          has_access: boolean | null
          id: string | null
          name: string | null
          product_id: string | null
          slug: string | null
          status: string | null
          type: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      bootstrap_admin_role: {
        Args: { admin_user_id: string }
        Returns: boolean
      }
      check_and_migrate_data: { Args: never; Returns: Json }
      check_if_user_is_admin: { Args: { user_id: string }; Returns: boolean }
      check_is_admin: { Args: never; Returns: boolean }
      complete_quiz_submission: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      create_bucket_if_not_exists:
        | { Args: { bucket_name: string }; Returns: boolean }
        | {
            Args: { bucket_name: string; is_public?: boolean }
            Returns: boolean
          }
      create_table_if_not_exists: {
        Args: { table_definition: string; table_name: string }
        Returns: undefined
      }
      execute_sql: { Args: { sql_query: string }; Returns: undefined }
      get_system_setting: { Args: { setting_key: string }; Returns: string }
      get_user_accessible_products: { Args: never; Returns: string[] }
      get_user_emails: {
        Args: never
        Returns: {
          email: string
        }[]
      }
      get_user_products: {
        Args: { p_user_id: string }
        Returns: {
          access_expires_at: string
          has_access: boolean
          product_id: string
          product_name: string
          product_slug: string
          product_type: string
        }[]
      }
      increment_material_access_count: {
        Args: { material_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_quiz_admin: { Args: { user_email: string }; Returns: boolean }
      is_workspace_member: { Args: { ws_id: string }; Returns: boolean }
      is_workspace_owner: { Args: { ws_id: string }; Returns: boolean }
      process_quiz_completion:
        | { Args: never; Returns: undefined }
        | { Args: { p_user_id: string }; Returns: undefined }
      setup_storage_bucket_policies: {
        Args: { bucket_name: string }
        Returns: boolean
      }
      setup_subscriptions_rls_policies: { Args: never; Returns: undefined }
      sync_existing_users: { Args: never; Returns: number }
      track_installation_status:
        | {
            Args: { component: string; message?: string; status: string }
            Returns: undefined
          }
        | { Args: { status?: string }; Returns: boolean }
      user_can_access_resource: {
        Args: {
          p_resource_id?: string
          p_resource_path?: string
          p_resource_type: string
          p_user_id: string
        }
        Returns: boolean
      }
      user_has_product_access: {
        Args: { p_product_slug: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
