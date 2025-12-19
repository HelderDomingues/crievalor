
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

    return data as Testimonial[] || [];
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

    return data as Testimonial[] || [];
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
    // Sanitize payload to ensure no extra fields or undefined values are sent
    const payload = {
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      text: testimonial.text,
      active: testimonial.active
    };

    const { data, error } = await supabase
      .from('testimonials')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar depoimento:", error);
      throw error;
    }

    return data as Testimonial;
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
    // Prepare update payload
    // Note: updated_at is handled by database trigger
    const payload: any = {};

    if (testimonial.name !== undefined) payload.name = testimonial.name;
    if (testimonial.role !== undefined) payload.role = testimonial.role;
    if (testimonial.company !== undefined) payload.company = testimonial.company;
    if (testimonial.text !== undefined) payload.text = testimonial.text;
    if (testimonial.active !== undefined) payload.active = testimonial.active;

    const { data, error } = await supabase
      .from('testimonials')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar depoimento:", error);
      throw error;
    }

    return data as Testimonial;
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
