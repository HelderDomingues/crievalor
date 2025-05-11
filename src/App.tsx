
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import "@/services/setupService";
import CookieConsent from "./components/CookieConsent";

function App() {
  useEffect(() => {
    console.log("Aplicação inicializada com sucesso");
  }, []);

  return (
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
        <CookieConsent />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
