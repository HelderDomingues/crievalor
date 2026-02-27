# Findings & Rationale

## Multi-Tenancy Architecture
- 2 of the 3 LUMIA plans will feature multi-seat setups.
- Database requires an overarching `workspaces` table, and a `workspace_members` join table for seat assignment and role mapping.

## Free Trial (15 Days) Strategy
- "Frictionless Soft Trial" mode implemented:
- Do not request payment details upfront.
- `subscriptions` table tracks `trialing` state with a hard `trial_ends_at` date.
- Cron Jobs / UI component blocking will lock the experience once the 15 days expire.

## NetCred Endpoint & Data
- Endpoint: `https://api.sandbox.netcredbrasil.com.br/graphql`
- Mandatory `customerInput` fields for PF: firstName, lastName, email, document (CPF), mobilePhone.
- A single Netlify endpoint `netcred-webhook.ts` will parse event types.
- We will NOT verify endpoints inside Edge Functions due to Cloudflare cross-origin JWT issues inside Supabase. Using Netlify is robust.

## Cleanup
- Legacy Asaas references must be exterminated first to avoid technical debt and typing errors.
