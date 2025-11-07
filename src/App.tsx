import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import "@/services/setupService";
import CookieConsent from "./components/CookieConsent";
import WhatsAppBusiness from "./components/WhatsAppBusiness";
import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";

function App() {
  useEffect(() => {
    console.log("Aplicação inicializada com sucesso");
  }, []);

  return (
    <React.StrictMode>
      <AnalyticsProvider 
        gtmId={import.meta.env.VITE_GTM_ID}
        gaTrackingId={import.meta.env.VITE_GA_TRACKING_ID}
      >
        <AuthProvider>
          <RouterProvider router={router} />
          <CookieConsent />
          <WhatsAppBusiness />
        </AuthProvider>
      </AnalyticsProvider>
    </React.StrictMode>
  );
}

export default App;
