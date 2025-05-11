
/**
 * Serviço para gerenciar cookies e consentimento
 */

/**
 * Define os tipos de cookies utilizados pela aplicação
 */
export type CookieType = 'essential' | 'analytics' | 'marketing';

/**
 * Define as preferências de cookies do usuário
 */
export interface CookiePreferences {
  essential: boolean; // Sempre true, pois são necessários
  analytics: boolean;
  marketing: boolean;
  lastUpdated: string;
}

/**
 * Recupera as preferências de cookies do usuário
 */
export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const preferences = localStorage.getItem('cookie-preferences');
    if (preferences) {
      return JSON.parse(preferences);
    }
    return null;
  } catch (error) {
    console.error('Erro ao recuperar preferências de cookies:', error);
    return null;
  }
};

/**
 * Salva as preferências de cookies do usuário
 */
export const saveCookiePreferences = (preferences: Partial<CookiePreferences>): void => {
  try {
    // Essentials são sempre true
    const updatedPreferences: CookiePreferences = {
      essential: true,
      analytics: preferences.analytics ?? false,
      marketing: preferences.marketing ?? false,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem('cookie-preferences', JSON.stringify(updatedPreferences));
    
    // Definir flag simples para verificação rápida do consentimento
    if (updatedPreferences.analytics || updatedPreferences.marketing) {
      localStorage.setItem('cookie-consent', 'accepted');
    } else {
      localStorage.setItem('cookie-consent', 'declined');
    }
  } catch (error) {
    console.error('Erro ao salvar preferências de cookies:', error);
  }
};

/**
 * Verifica se o tipo de cookie foi aceito pelo usuário
 */
export const isCookieTypeAccepted = (type: CookieType): boolean => {
  if (type === 'essential') return true; // Sempre permitidos
  
  const preferences = getCookiePreferences();
  if (!preferences) return false;
  
  return !!preferences[type];
};

/**
 * Limpa todas as preferências de cookies
 */
export const clearCookiePreferences = (): void => {
  localStorage.removeItem('cookie-preferences');
  localStorage.removeItem('cookie-consent');
};
