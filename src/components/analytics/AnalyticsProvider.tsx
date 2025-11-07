import React from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';
import { GoogleTagManager } from './GoogleTagManager';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  gaTrackingId?: string; // Google Analytics ID (formato: G-XXXXXXXXXX)
  gtmId?: string; // Google Tag Manager ID (formato: GTM-XXXXXX)
}

/**
 * AnalyticsProvider - Componente para integração de Google Analytics e Google Tag Manager
 * 
 * Uso:
 * 1. Adicione este provider no App.tsx ou main.tsx
 * 2. Configure as variáveis de ambiente:
 *    - VITE_GA_TRACKING_ID para Google Analytics
 *    - VITE_GTM_ID para Google Tag Manager
 * 
 * Exemplo:
 * ```tsx
 * <AnalyticsProvider 
 *   gaTrackingId={import.meta.env.VITE_GA_TRACKING_ID}
 *   gtmId={import.meta.env.VITE_GTM_ID}
 * >
 *   <App />
 * </AnalyticsProvider>
 * ```
 * 
 * Recursos:
 * - Rastreamento automático de page views em mudanças de rota
 * - Suporte para eventos customizados via trackEvent/trackGTMEvent
 * - Rastreamento de conversões e e-commerce
 * - Compatível com LGPD via CookieConsent
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  gaTrackingId,
  gtmId,
}) => {
  // Verificar consentimento de cookies antes de carregar analytics
  const hasAnalyticsConsent = () => {
    try {
      const preferences = localStorage.getItem('cookie-preferences');
      if (!preferences) return false;
      
      const preferencesData = JSON.parse(preferences);
      return preferencesData.analytics === true;
    } catch {
      return false;
    }
  };

  const shouldLoadAnalytics = hasAnalyticsConsent();

  return (
    <>
      {shouldLoadAnalytics && gaTrackingId && (
        <GoogleAnalytics trackingId={gaTrackingId} />
      )}
      
      {shouldLoadAnalytics && gtmId && (
        <GoogleTagManager gtmId={gtmId} />
      )}
      
      {children}
    </>
  );
};

export default AnalyticsProvider;
