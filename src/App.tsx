
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import "@/services/setupService";
import CookieConsent from "./components/CookieConsent";
import WhatsAppBusiness from "./components/WhatsAppBusiness";

function App() {
  useEffect(() => {
    console.log("Aplicação inicializada com sucesso");
  }, []);

  return (
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
        <CookieConsent />
        <WhatsAppBusiness />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
