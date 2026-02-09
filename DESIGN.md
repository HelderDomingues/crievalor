# Design System: Crie Valor / LUMIA
**Project ID:** crievalor-lumia

## 1. Visual Theme & Atmosphere
**"Deep Space Corporate"**
The aesthetic is high-end SaaS, combining the credibility of enterprise software with the visionary feel of deep tech.
*   **Mood:** Serious, infinite, intelligent, focused.
*   **Density:** Spacious. High use of negative space (darkness) to minimize cognitive load.
*   **Lighting:** "Bioluminescent" accents against void-like backgrounds. Use of glows and gradients to guide attention, simulating a dashboard or HUD interface.

## 2. Color Palette & Roles

### Backgrounds
*   **Void Navy (#010816):** Primary background. The deepest layer of the interface.
*   **Abyssal Blue (#020617):** Secondary background/Section contrast.

### UI Surfaces (Cards/Containers)
*   **Glass Slate (rgba(30, 41, 59, 0.5)):** Used for cards and content containers. Often combined with backdrop-blur.
*   **Solid Slate (#1e293b):** Opaque alternative for heavy content areas.

### Accents & Gradients (The "Lumia" Brand)
*   **Nebula Purple (#581c87):** Primary brand accent. Used in deep gradients.
*   **Electric Violet (#7c3aed):** Interactive states, primary buttons, borders.
*   **Cosuan Pink (#ec4899):** Secondary gradient stop, adds warmth and "humanity" to the AI.
*   **Amber Signal (#f59e0b):** Used for "Warning" or "Human Intervention" highlights (Hybrid model).

### Text
*   **Starlight White (#f8fafc):** Primary headers and high-emphasis text.
*   **Moon Dust (#94a3b8):** Body text, secondary information.

## 3. Typography Rules
**Font Family:** Inter (System Sans).

*   **Headers (H1-H3):** Tight tracking (`tracking-tight`). Bold or ExtraBold weights.
*   **Body:** Regular or Medium weight. Relaxed line height (`leading-relaxed`) for readability on dark backgrounds.
*   **Monospace:** Used sparingly for "AI Thinking" or data points (`font-mono`).

## 4. Component Stylings

### Buttons
*   **Primary:** Pill-shaped (`rounded-full`) or soft-rounded (`rounded-md` for SaaS feel). Gradient backgrounds (Purple -> Pink) or solid Electric Violet. Glow effect on hover (`shadow-[0_0_20px_rgba(124,58,237,0.5)]`).
*   **Secondary:** Ghost style or Outline with thin Slate borders. Text in White.

### Cards & Containers
*   **Glass Cards:** `bg-slate-900/50`, `backdrop-blur-md`, `border border-slate-800`.
*   **Glow Borders:** Gentle border gradients or hover states that light up the edge of the card.
*   **Corner Radius:** `rounded-xl` or `rounded-2xl` for a modern, friendly SaaS look.

### Data Visualization (Mockups)
*   **Dashboards:** Dark mode representations. Thin lines (`1px`), muted grid backgrounds (`bg-grid-white/[0.02]`).
*   **Status Indicators:** Small glowing dots (`w-2 h-2 rounded-full`). Green for "Active", Amber for "Waiting".
*   **Product Shots:** High-fidelity HTML/CSS mockups.
    *   *Chat Interface:* Bubble messages, typing indicators, glass-morphic input fields.
    *   *Kanban:* Draggable cards, column headers (To Do, Doing, Done), tagging system.
    *   *Reports:* Radial charts, bar graphs, "Download PDF" buttons.

## 5. Layout Principles
*   **Centered Focus:** Key value props are centered with ample vertical padding (`py-24`).
*   **Grid Alignments:** 3-column grids for feature comparison.
*   **Z-Index Layering:** Background abstract elements (blobs, gradients) always sit behind the content with `z-0` or `pointer-events-none`. Content is `z-10`.
