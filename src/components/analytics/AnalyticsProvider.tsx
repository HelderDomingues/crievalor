import React, { useState, useEffect } from 'react';
import { GoogleTagManager } from './GoogleTagManager';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * AnalyticsProvider - Componente para integração de Google Tag Manager (GTM)
 * 
 * Uso:
 * O GTM é carregado via index.html ou CookieConsent.
 * Este componente gerencia apenas o rastreamento de rotas (virtual page views)
 * quando o consentimento é concedido.
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  // Verificar consentimento de cookies antes de carregar analytics
  const checkConsent = () => {
    try {
      const preferences = localStorage.getItem('cookie-preferences');
      if (!preferences) return false;

      const preferencesData = JSON.parse(preferences);
      return preferencesData.analytics === true;
    } catch {
      return false;
    }
  };

  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(checkConsent());

  useEffect(() => {
    const handleConsentUpdate = () => {
      setShouldLoadAnalytics(checkConsent());
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);

    // Check again in case it changed while binding
    handleConsentUpdate();

    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
    };
  }, []);

  return (
    <>
      {shouldLoadAnalytics && (
        <GoogleTagManager />
      )}

      {children}
    </>
  );
};

export default AnalyticsProvider;
