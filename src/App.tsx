import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/services/setupService";
import CookieConsent from "./components/CookieConsent";
import WhatsAppBusiness from "./components/WhatsAppBusiness";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    console.log("Aplicação inicializada com sucesso");
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <CookieConsent />
          <WhatsAppBusiness />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
