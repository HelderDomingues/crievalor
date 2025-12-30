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
import Lumia from "@/pages/Lumia";
import MentorProposito from "@/pages/MentorProposito";

import Accessibility from "@/pages/Accessibility";
import WhatsAppDashboard from "@/pages/WhatsAppDashboard";
import Palestra from "@/pages/Palestra";
import PalestraSucesso from "@/pages/PalestraSucesso";
import LecturesAdmin from "@/pages/LecturesAdmin";
import EventLeadsAdmin from "@/pages/EventLeadsAdmin";

import Dashboard from "@/pages/Dashboard";
import Apresentacao from "@/pages/Apresentacao";
import ApresentacaoSC from "@/pages/ApresentacaoSC";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import BlogHome from "@/pages/blog/BlogHome";
import BlogPost from "@/pages/blog/BlogPost";
import AuthorProfile from "@/pages/blog/AuthorProfile";

import BlogAdminList from "@/pages/admin/blog/BlogAdminList";
import BlogPostEditor from "@/pages/admin/blog/BlogPostEditor";
import CategoryManager from "@/pages/admin/blog/CategoryManager";
import BioManager from "@/pages/admin/BioManager";
import AdminUsers from "@/pages/AdminUsers";

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
        path: "lumia",
        element: <Lumia />,
      },
      {
        path: "mentor-proposito",
        element: <MentorProposito />,
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
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminSetup />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-portfolio",
        element: (
          <ProtectedRoute requiredRole="admin">
            <PortfolioAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-materials",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminMaterialsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-logos",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ClientLogosAdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-client-logos",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ClientLogosAdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-testimonials",
        element: (
          <ProtectedRoute requiredRole="admin">
            <TestimonialsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-blog",
        element: (
          <ProtectedRoute requiredRole="admin">
            <BlogAdminList />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-blog/posts/new",
        element: (
          <ProtectedRoute requiredRole="admin">
            <BlogPostEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-blog/posts/:id",
        element: (
          <ProtectedRoute requiredRole="admin">
            <BlogPostEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-blog/categories",
        element: (
          <ProtectedRoute requiredRole="admin">
            <CategoryManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-bio",
        element: (
          <ProtectedRoute requiredRole="admin">
            <BioManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-users",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "acessibilidade",
        element: <Accessibility />,
      },
      {
        path: "admin-whatsapp",
        element: (
          <ProtectedRoute requiredRole="admin">
            <WhatsAppDashboard />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute requiredRole="admin">
            <LecturesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-event-leads",
        element: (
          <ProtectedRoute requiredRole="admin">
            <EventLeadsAdmin />
          </ProtectedRoute>
        ),
      },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
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
      {
        path: "blog/author/:id",
        element: <AuthorProfile />,
      },
      // Fallback 404 route for any unmatched path within the layout
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);
