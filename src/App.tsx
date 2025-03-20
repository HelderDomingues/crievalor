
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Mar from "./pages/Mar";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mar" element={<Mar />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/politica-de-reembolso" element={<RefundPolicy />} />
          <Route path="/termos-de-servico" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
