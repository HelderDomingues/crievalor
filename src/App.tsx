
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Mar from "./pages/Mar";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsOfService from "./pages/TermsOfService";
import Mentorias from "./pages/Mentorias";
import Consultoria from "./pages/Consultoria";
import EscolaGestao from "./pages/EscolaGestao";
import IdentidadeVisual from "./pages/IdentidadeVisual";
import Projetos from "./pages/Projetos";
import PortfolioAdmin from "./pages/PortfolioAdmin";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import { useState } from "react";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCanceled from "./pages/CheckoutCanceled";
import MaterialExclusivo from "./pages/MaterialExclusivo";
import AdminMaterials from "./pages/AdminMaterials";
import WebhookAdmin from "./pages/WebhookAdmin";
import AdminSetup from "./pages/AdminSetup";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <div className="app">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/consultoria" element={<Consultoria />} />
                <Route path="/mentorias" element={<Mentorias />} />
                <Route path="/escola-gestao" element={<EscolaGestao />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/mar" element={<Mar />} />
                <Route path="/identidade-visual" element={<IdentidadeVisual />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/projetos" element={<Projetos />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
                <Route path="/portfolio-admin" element={<PortfolioAdmin />} />
                <Route path="/material-exclusivo" element={<MaterialExclusivo />} />
                <Route path="/admin-materials" element={<AdminMaterials />} />
                <Route path="/admin-webhooks" element={<WebhookAdmin />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
            </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
