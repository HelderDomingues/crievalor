# LUMIA Ecosystem Refactoring - Findings (RESTARTED)

**Last Updated**: 2026-02-07

All strategic findings and technical considerations are preserved here.

### Value Proposition
- **User Control**: Total control over strategic planning and virtual specialists.
- **Human Validation**: Now **optional** (not the core message).
- **Consolidated LUMIA**: Integrated ecosystem, not separate tools.

### Visual Structure
- **Pillars**: Integrated as a **Hero Slide** (Produto, Serviços, Educação).
- **Highlight**: Unified Ecosystem flow (User at center).
- 3-Tier Pricing: Básico, Intermediário, Avançado

### Pricing & Calculations (TO BE VERIFIED)
- Básico: R$ 560/mo
- Intermediário: R$ 740/mo (Total: R$ 8.880/yr)
- Avançado: R$ 810/mo (Total: R$ 9.720/yr)

### Components Map
- **To Remove**: `MarHighlight`, `LumiaHighlight`, `MentorPropositoHighlight`
- **To Create**: `PillarsSection`, `EcosystemHighlight`, `PricingSection`
- **To Update**: `Index.tsx`, `InteractiveGalaxyHeroCarousel.tsx`
