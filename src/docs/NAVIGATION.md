
# Navigation Patterns and Requirements Documentation

## Core Navigation Components

### 1. Header Navigation
- Implements React Router's `Link` components for SPA navigation
- Dynamic active state highlighting based on current route
- Responsive mobile menu with hamburger toggle
- Authentication state integration with profile menu

### 2. Footer Navigation
- Organized in four sections: Company, Navigation, Services, and Contact
- Consistent React Router `Link` usage
- Secondary links including legal pages and accessibility
- Social media links with external navigation

### 3. Page-Level Navigation
- `useScrollToTop` hook implementation on all content pages
- Smooth scroll behavior for within-page navigation
- WhatsApp integration links for direct contact

## Navigation Requirements

### 1. Implementation Standards
- All internal navigation MUST use React Router's `Link` component
- External links MUST use standard `<a>` tags with proper security attributes
- WhatsApp links MUST include encoded message parameters

### 2. User Experience Requirements
- Smooth scroll behavior for all navigation actions
- Consistent header presence across all routes
- Mobile-responsive navigation at all breakpoints
- Clear visual feedback for active/current page

### 3. Performance Requirements
- No full page reloads for internal navigation
- Immediate UI feedback for navigation actions
- Proper route handling for non-existent paths (404)

## Route Structure

### Public Routes
- `/` - Home
- `/mar` - MAR Program
- `/sobre` - About
- `/contato` - Contact
- `/projetos` - Projects
- `/escola-gestao` - Management School
- `/mentorias` - Mentoring
- `/identidade-visual` - Visual Identity

### Authentication Routes
- `/auth` - Authentication
- `/profile` - User Profile
- `/subscription` - Subscription Management

### Legal Routes
- `/politica-de-privacidade` - Privacy Policy
- `/politica-de-reembolso` - Refund Policy
- `/termos-de-servico` - Terms of Service
- `/acessibilidade` - Accessibility

### Administrative Routes
- `/admin-setup` - Admin Dashboard
- `/admin-webhooks` - Webhook Management
- `/admin-portfolio` - Portfolio Management
- `/admin-materials` - Materials Management
- `/admin-logos` - Logo Management
- `/admin-testimonials` - Testimonials Management

## Security Considerations
- Protected routes require authentication
- Admin routes require admin role verification
- No direct URL access to protected content
- Proper handling of authentication state changes

## Testing Requirements
- Verify all internal links use React Router
- Confirm proper scroll behavior
- Validate WhatsApp integration
- Check mobile menu functionality
- Test protected route access
- Verify 404 handling
