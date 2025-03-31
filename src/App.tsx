
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect, useState } from "react";
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
import EscolaGestao from "./pages/EscolaGestao";
import IdentidadeVisual from "./pages/IdentidadeVisual";
import Projetos from "./pages/Projetos";
import PortfolioAdmin from "./pages/PortfolioAdmin";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCanceled from "./pages/CheckoutCanceled";
import MaterialExclusivo from "./pages/MaterialExclusivo";
import AdminMaterials from "./pages/AdminMaterials";
import WebhookAdmin from "./pages/WebhookAdmin";
import AdminSetup from "./pages/AdminSetup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import Checkout from "./pages/Checkout";
import CheckoutDebugPanel from "./components/debug/CheckoutDebugPanel";

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  // Mostrar painel de depuração apenas em ambiente de desenvolvimento
  const isDebugMode = process.env.NODE_ENV === 'development';
  const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false);
  
  // Tecla de atalho para alternar a visibilidade do painel de depuração
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+C para alternar o painel de debug
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        setIsDebugPanelVisible(prevState => !prevState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sobre" element={<Sobre />} />
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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
                <Route path="/portfolio-admin" element={<PortfolioAdmin />} />
                <Route path="/material-exclusivo" element={<MaterialExclusivo />} />
                <Route path="/admin-materials" element={<AdminMaterials />} />
                <Route path="/admin-webhooks" element={<WebhookAdmin />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
              {isDebugMode && (
                <>
                  {/* Botão flutuante para abrir o painel de debug quando fechado */}
                  {!isDebugPanelVisible && (
                    <button
                      onClick={() => setIsDebugPanelVisible(true)}
                      className="fixed bottom-4 right-4 bg-red-100 text-red-800 p-2 rounded-md shadow-md z-50 text-xs hover:bg-red-200 transition-colors"
                    >
                      Abrir Painel de Testes
                    </button>
                  )}
                  <CheckoutDebugPanel 
                    isVisible={isDebugPanelVisible} 
                    onClose={() => setIsDebugPanelVisible(false)}
                  />
                </>
              )}
            </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
