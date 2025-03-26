
import { Json } from "@/integrations/supabase/types";
import { UserProfile } from "@/types/auth";

/**
 * Formata os dados sociais garantindo a estrutura correta
 */
export function formatSocialMedia(socialMediaData: Json | null) {
  const defaultSocialMedia = {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: ""
  };

  if (!socialMediaData) return defaultSocialMedia;

  // Handle different possible types from the database
  const socialMedia = socialMediaData as any;
  
  if (typeof socialMedia === 'object' && !Array.isArray(socialMedia)) {
    return {
      linkedin: socialMedia.linkedin || "",
      twitter: socialMedia.twitter || "",
      instagram: socialMedia.instagram || "",
      facebook: socialMedia.facebook || ""
    };
  }

  return defaultSocialMedia;
}

/**
 * Formata o perfil completo garantindo a tipagem correta
 */
export function formatProfileData(data: any, userEmail: string | null | undefined): UserProfile | null {
  if (!data) return null;

  const formattedSocialMedia = formatSocialMedia(data.social_media);

  return {
    id: data.id,
    username: data.username,
    avatar_url: data.avatar_url,
    updated_at: data.updated_at,
    full_name: data.full_name,
    phone: data.phone,
    company_name: data.company_name,
    company_address: data.company_address,
    website: data.website,
    cnpj: data.cnpj,
    cpf: data.cpf,
    social_media: formattedSocialMedia,
    email: userEmail
  };
}
