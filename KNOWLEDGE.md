# Project Notes — Crie Valor Estratégia

## Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, and React Query.
- Backend: Supabase project `nmxfknwkhnengqqjtwru` and Netlify Functions.
- Payment integration: NetCred-specific code is in `netlify/functions/netcredClient.ts` and `netlify/functions/netcred-webhook.ts`; frontend payment helpers are under `src/services/`.

## Operational notes

- Keep payment-provider credentials in server-side Netlify environment variables; never put them in the browser bundle.
- Inspect the live Supabase schema and migration history before changing database objects.
- The local and remote migration histories have pre-existing inconsistencies. Avoid `supabase db push` until those are reconciled; verify every new migration against the live project.
- `src/integrations/supabase/types.ts` is generated from the linked database with `supabase gen types typescript --linked`.

## Project history

- The April 2025 UI refactor separated project overview, examples, cards, and feature cards into focused components. This historical note may not represent the current component layout.
