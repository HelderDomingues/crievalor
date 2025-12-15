
import { useState, useEffect } from "react";
import { X, Check, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (cookieConsent === null) {
      // Se não existir, mostrar o banner
      setShowConsent(true);
    }
  }, []);

  const updateConsent = (analytics: boolean, marketing: boolean) => {
    // Definir objeto de consentimento
    const consent = {
      'ad_storage': marketing ? 'granted' : 'denied',
      'ad_user_data': marketing ? 'granted' : 'denied',
      'ad_personalization': marketing ? 'granted' : 'denied',
      'analytics_storage': analytics ? 'granted' : 'denied'
    };

    // Atualizar consentimento no GTM
    if (window.gtag) {
      window.gtag('consent', 'update', consent);
    } else if (window.dataLayer) {
      window.dataLayer.push(['consent', 'update', consent]);
    }

    // Disparar evento apenas para componentes React que usem isso
    window.dispatchEvent(new Event('cookieConsentUpdated'));
  };

  const acceptCookies = () => {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);

    toast({
      title: "Preferências salvas",
      description: "Suas preferências de cookies foram salvas.",
      duration: 3000,
    });

    updateConsent(true, true);
  };

  const declineCookies = () => {
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    localStorage.setItem("cookie-consent", "declined");
    setShowConsent(false);

    toast({
      title: "Preferências salvas",
      description: "Você optou por não aceitar cookies opcionais.",
      duration: 3000,
    });

    updateConsent(false, false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg md:flex md:items-center md:justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
          <Cookie className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 md:max-w-3xl">
          <p className="text-sm text-gray-700">
            Este site usa cookies para melhorar sua experiência. Ao continuar navegando, você concorda
            com nossa política de cookies. Utilizamos cookies essenciais para o funcionamento do site
            e cookies opcionais para análises e personalização de conteúdo.
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 mt-4 space-x-2 md:mt-0 md:ml-4">
        <Button
          onClick={declineCookies}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <X className="w-4 h-4 mr-1" /> Recusar
        </Button>
        <Button
          onClick={acceptCookies}
          size="sm"
          className="flex items-center"
        >
          <Check className="w-4 h-4 mr-1" /> Aceitar
        </Button>
      </div>
    </div>
  );
}
