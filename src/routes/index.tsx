import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AdminSetup from "@/pages/AdminSetup";

import PortfolioAdmin from "@/pages/PortfolioAdmin";
import AdminMaterialsPage from "@/pages/AdminMaterials";
import ClientLogosAdminPage from "@/pages/ClientLogosAdminPage";
import TestimonialsAdmin from "@/pages/TestimonialsAdmin";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Mar from "@/pages/Mar";
import Sobre from "@/pages/Sobre";
import Contato from "@/pages/Contato";
import Projetos from "@/pages/Projetos";
import OficinaLideres from "@/pages/OficinaLideres";
import Mentorias from "@/pages/Mentorias";
import ComingSoon from "@/pages/ComingSoon";
import Pricing from "@/pages/Pricing";
import IdentidadeVisualOriginal from "@/pages/IdentidadeVisualOriginal";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import TermsOfService from "@/pages/TermsOfService";

import Accessibility from "@/pages/Accessibility";
import WhatsAppDashboard from "@/pages/WhatsAppDashboard";
import Palestra from "@/pages/Palestra";
import PalestraSucesso from "@/pages/PalestraSucesso";
import LecturesAdmin from "@/pages/LecturesAdmin";
import EventLeadsAdmin from "@/pages/EventLeadsAdmin";
import AdminDashboard from "@/pages/AdminDashboard";
import Apresentacao from "@/pages/Apresentacao";
import ApresentacaoSC from "@/pages/ApresentacaoSC";

import BlogHome from "@/pages/blog/BlogHome";
import BlogPost from "@/pages/blog/BlogPost";

import BlogAdminList from "@/pages/admin/blog/BlogAdminList";
import BlogPostEditor from "@/pages/admin/blog/BlogPostEditor";
import CategoryManager from "@/pages/admin/blog/CategoryManager";

import { RootLayout } from "@/components/layout/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "mar",
        element: <Mar />,
      },
      {
        path: "sobre",
        element: <Sobre />,
      },
      {
        path: "contato",
        element: <Contato />,
      },
      {
        path: "projetos",
        element: <Projetos />,
      },
      {
        path: "oficina-de-lideres",
        element: <OficinaLideres />,
      },
      {
        path: "escola-gestao",
        element: <OficinaLideres />,
      },
      {
        path: "mentorias",
        element: <Mentorias />,
      },
      {
        path: "identidade-visual",
        element: <ComingSoon />,
      },
      {
        path: "identidade-visual-preview",
        element: <IdentidadeVisualOriginal />,
      },
      {
        path: "politica-de-privacidade",
        element: <PrivacyPolicy />,
      },
      {
        path: "politica-de-reembolso",
        element: <RefundPolicy />,
      },
      {
        path: "termos-de-servico",
        element: <TermsOfService />,
      },
      {
        path: "admin-setup",
        element: <AdminSetup />,
      },
      {
        path: "admin-portfolio",
        element: <PortfolioAdmin />,
      },
      {
        path: "admin-materials",
        element: <AdminMaterialsPage />,
      },
      {
        path: "admin-logos",
        element: <ClientLogosAdminPage />,
      },
      {
        path: "admin-client-logos",
        element: <ClientLogosAdminPage />,
      },
      {
        path: "admin-testimonials",
        element: <TestimonialsAdmin />,
      },
      {
        path: "admin-blog",
        element: <BlogAdminList />,
      },
      {
        path: "admin-blog/posts/new",
        element: <BlogPostEditor />,
      },
      {
        path: "admin-blog/posts/:id",
        element: <BlogPostEditor />,
      },
      {
        path: "admin-blog/categories",
        element: <CategoryManager />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "acessibilidade",
        element: <Accessibility />,
      },
      {
        path: "admin-whatsapp",
        element: <WhatsAppDashboard />,
      },
      {
        path: "palestra",
        element: <Palestra />,
      },
      {
        path: "palestra/sucesso",
        element: <PalestraSucesso />,
      },
      {
        path: "admin-lectures",
        element: <LecturesAdmin />,
      },
      {
        path: "admin-event-leads",
        element: <EventLeadsAdmin />,
      },
      {
        path: "admin-dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "apresentacao",
        element: <Apresentacao />,
      },
      {
        path: "apresentacao-sc",
        element: <ApresentacaoSC />,
      },
      {
        path: "planos",
        element: <Pricing />,
      },
      // Blog Routes
      {
        path: "blog",
        element: <BlogHome />,
      },
      {
        path: "blog/:slug",
        element: <BlogPost />,
      },
      // Fallback 404 route for any unmatched path within the layout
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);
