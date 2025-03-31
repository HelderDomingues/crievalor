
import React from "react";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
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
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
