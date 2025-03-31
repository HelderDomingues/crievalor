
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Busca todos os depoimentos ativos
 */
export const fetchActiveTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar depoimentos:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error);
    return [];
  }
};

/**
 * Busca todos os depoimentos (para administração)
 */
export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar depoimentos:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error);
    return [];
  }
};

/**
 * Cria um novo depoimento
 */
export const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial | null> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar depoimento:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar depoimento:', error);
    return null;
  }
};

/**
 * Atualiza um depoimento existente
 */
export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial | null> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        ...testimonial,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar depoimento:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar depoimento:', error);
    return null;
  }
};

/**
 * Remove um depoimento
 */
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erro ao remover depoimento:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover depoimento:', error);
    return false;
  }
};
