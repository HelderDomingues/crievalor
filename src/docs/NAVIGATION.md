
# Route Mapping Documentation

## Overview
This document provides a comprehensive mapping of all routes in the Crie Valor application, their purposes, and navigation relationships.

## Route Categories

### Public Routes
These routes are accessible to all users without authentication.

| Route | Component | Purpose | Navigation Access Points |
|-------|-----------|---------|--------------------------|
| `/` | `Index.tsx` | Main landing page | Header, Footer, Logo |
| `/mar` | `Mar.tsx` | MAR Program information | Header, Footer, Services Section |
| `/sobre` | `Sobre.tsx` | About the company | Header, Footer |
| `/contato` | `Contato.tsx` | Contact information and form | Header, Footer, CTA buttons |
| `/projetos` | `Projetos.tsx` | Custom projects showcase | Footer, Services Section |
| `/escola-gestao` | `EscolaGestao.tsx` | Management School information | Footer, Services Section |
| `/mentorias` | `Mentorias.tsx` | Mentoring services | Footer, Services Section |
| `/identidade-visual` | `IdentidadeVisual.tsx` | Visual identity services | Footer, Services Section |

### Authentication Routes
These routes handle user authentication and profile management.

| Route | Component | Purpose | Auth Required | Navigation Access Points |
|-------|-----------|---------|---------------|--------------------------|
| `/auth` | `Auth.tsx` | User login and registration | No | Header, Authentication-dependent CTAs |
| `/profile` | `Profile.tsx` | User profile management | Yes | Header (authenticated users) |
| `/subscription` | `Subscription.tsx` | Subscription management | Yes | Profile menu, Header (authenticated users) |
| `/checkout` | `Checkout.tsx` | Payment processing | Mixed* | Subscription plans |

*Checkout allows initial access without authentication but requires registration during the process

### Legal and Policy Routes
These routes provide important legal and policy information.

| Route | Component | Purpose | Navigation Access Points |
|-------|-----------|---------|--------------------------|
| `/politica-de-privacidade` | `PrivacyPolicy.tsx` | Privacy policy | Footer |
| `/politica-de-reembolso` | `RefundPolicy.tsx` | Refund policy | Footer |
| `/termos-de-servico` | `TermsOfService.tsx` | Terms of service | Footer |
| `/acessibilidade` | `Accessibility.tsx` | Accessibility information | Footer |

### Administrative Routes
These routes are restricted to users with administrative privileges.

| Route | Component | Purpose | Navigation Access Points |
|-------|-----------|---------|--------------------------|
| `/admin-setup` | `AdminSetup.tsx` | Main admin dashboard | Header dropdown (admin users) |
| `/admin-webhooks` | `WebhookAdmin.tsx` | Webhook management | Admin dashboard, Header dropdown (admin users) |
| `/admin-portfolio` | `PortfolioAdmin.tsx` | Portfolio management | Admin dashboard, Header dropdown (admin users) |
| `/admin-materials` | `AdminMaterialsPage.tsx` | Materials management | Admin dashboard, Header dropdown (admin users) |
| `/admin-logos` | `ClientLogosAdminPage.tsx` | Client logos management | Admin dashboard, Header dropdown (admin users) |
| `/admin-testimonials` | `TestimonialsAdmin.tsx` | Testimonials management | Admin dashboard, Header dropdown (admin users) |

## Current Navigation Implementation

### Header Navigation
The main navigation is implemented in `src/components/Header.tsx`:
- Responsive design with mobile and desktop variations
- Uses React Router's `Link` component for SPA navigation
- Highlights active routes based on current location
- Conditionally renders authentication-related options
- WhatsApp integration for direct contact

### Footer Navigation
The footer navigation is implemented in `src/components/Footer.tsx`:
- Organized in four sections: Company, Navigation, Services, and Contact
- Uses React Router's `Link` component for consistent SPA behavior (Fixed April 2024)
- Includes all legal routes and social media links

### Navigation Hooks
The application uses a custom `useScrollToTop` hook (`src/hooks/useScrollToTop.tsx`) for consistent scroll behavior when navigating between routes.

## Special Navigation Considerations

### Authentication Flow
- Authenticated users see profile options in the header
- Admin users have additional administrative options
- The AuthHeader component handles conditional rendering of these elements

### WhatsApp Integration
Several components implement WhatsApp integration via direct links with prefilled messages:
- Contact buttons in the header
- Project inquiry buttons in project-related pages
- Service inquiry buttons throughout the site

### Protected Routes
- Administrative routes require admin role verification
- Profile and subscription routes require authentication
- The current implementation uses conditional rendering in components rather than route-level protection

### Link Behavior
- All internal links now use React Router's `Link` component or the navigation functionality
- Links that previously caused full page reloads (such as branding and mentorias pages) have been fixed
- The `HeroContent` component correctly handles both anchor links (with smooth scrolling) and regular routing

## Recommendations
1. Consider implementing route-level protection for authenticated routes
2. Verify all WhatsApp integration links are correctly formatted
3. Ensure consistent breadcrumb implementation for improved user experience
4. Test navigation flow across all device types
5. Implement 404 handling for non-existent routes

## Next Steps
- Verify all internal links use React Router's Link component (COMPLETED April 2024)
- Test authenticated and administrative route access controls
- Ensure consistent header/footer implementation across all pages (IN PROGRESS)
- Document any missing routes or navigation patterns
