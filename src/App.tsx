
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminSetup from "./pages/AdminSetup";
import WebhookAdmin from "./pages/WebhookAdmin";
import PortfolioAdmin from "./pages/PortfolioAdmin";
import AdminMaterialsPage from "./pages/AdminMaterials";
import ClientLogosAdminPage from "./pages/ClientLogosAdminPage";
import TestimonialsAdmin from "./pages/TestimonialsAdmin";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Mar from "./pages/Mar";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Projetos from "./pages/Projetos";
import EscolaGestao from "./pages/EscolaGestao";
import Mentorias from "./pages/Mentorias";
import IdentidadeVisual from "./pages/IdentidadeVisual";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsOfService from "./pages/TermsOfService";
// Import AuthProvider from AuthContext
import { AuthProvider } from "./context/AuthContext";
// Import setup service to initialize application
import "@/services/setupService";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/mar",
    element: <Mar />,
  },
  {
    path: "/sobre",
    element: <Sobre />,
  },
  {
    path: "/contato",
    element: <Contato />,
  },
  {
    path: "/projetos",
    element: <Projetos />,
  },
  {
    path: "/escola-gestao",
    element: <EscolaGestao />,
  },
  {
    path: "/mentorias",
    element: <Mentorias />,
  },
  {
    path: "/identidade-visual",
    element: <IdentidadeVisual />,
  },
  {
    path: "/politica-de-privacidade",
    element: <PrivacyPolicy />,
  },
  {
    path: "/politica-de-reembolso",
    element: <RefundPolicy />,
  },
  {
    path: "/termos-de-servico",
    element: <TermsOfService />,
  },
  {
    path: "/admin-setup",
    element: <AdminSetup />,
  },
  {
    path: "/admin-webhooks",
    element: <WebhookAdmin />,
  },
  {
    path: "/admin-portfolio",
    element: <PortfolioAdmin />,
  },
  {
    path: "/admin-materials",
    element: <AdminMaterialsPage />,
  },
  {
    path: "/admin-logos",
    element: <ClientLogosAdminPage />,
  },
  {
    path: "/admin-testimonials",
    element: <TestimonialsAdmin />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  useEffect(() => {
    // Log initialization message
    console.log("Aplicação inicializada com sucesso");
  }, []);

  return (
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
