# Goal: harden the Crie Valor production database

## Objective

Audit project `nmxfknwkhnengqqjtwru` against current Supabase/Postgres security and reliability practices, then resolve verified database risks in small, reviewed migrations without breaking the Crie Valor production app.

## Scope

- Refresh security, performance, health, schema/RLS/grant, function-ACL, and migration-history evidence.
- Audit `storage.buckets`/`storage.objects` visibility, grants, RLS policies, and Edge Functions that manage them; map exposed RPCs and policy helpers to frontend, Netlify Functions, triggers, and RLS dependencies before changing permissions.
- For the approved first phase, make `setup_storage_bucket_policies(text)` preserve the admin/owner-only `materials` write boundary; this helper currently recreates broad authenticated DML and is called with service-role credentials by `setup-rls`.
- Approved second phase (Fase B mínima, 2026-11-09): revoke `anon` EXECUTE on the 10 advisor-flagged SECURITY DEFINER functions (keeping `authenticated`/`service_role`). Live `pg_policies` inventory showed 15 admin policies evaluate `is_admin()`/`check_is_admin()`/`check_if_user_is_admin()`/`bootstrap_admin_role()` with `roles={public}`; therefore the same phase re-targets exactly those policies `TO authenticated` (guest reads are preserved by the separate function-free public policies) so anon queries cannot break on denied function calls. This extension is documented from the live inventory before applying.
- Inspect Netlify/Edge code only where it can authenticate callers or mutate/read Supabase data (e.g. payment entitlement updates); preserve existing business contracts unless a specific approved fix requires change.
- Prioritize confirmed risks and prepare one reversible migration per approved remediation phase.
- Verify every applied change with role-context SQL probes, migration history, and current advisors.

## Out of scope

- SIO-MAR database or its LUMIA/RAG pipeline.
- Leaked-password protection, unavailable on the current Supabase Free plan (user-confirmed).
- Dashboard-only Postgres upgrade; report separately for the user to schedule.
- Changes to NetCred, portfolio, authentication/business flows, and `public.atualizar`/its keep-alive behavior unless a specific approved fix requires touching them.
- Production DDL/deploys are limited to explicitly approved phases; each additional remediation phase requires its own concrete plan and approval.

## Behavior that must not regress

- Public read access to `public.materials` remains; writes stay limited to global `admin`/`owner` roles.
- The `materials` Storage bucket remains public-read if required by its current consumer links; uploads/updates/deletes must be restricted to the same `admin`/`owner` roles as the metadata table.
- Re-running `setup_storage_bucket_policies('materials')` must not restore authenticated-wide writes.
- The browser must not invoke service-role setup on every page load; setup/diagnostic Edge endpoints must validate a real user JWT and `admin`/`owner` role before service-role access.
- NetCred checkout, webhook, and admin payment workflows continue to work.
- Portfolio remains publicly readable and admin/owner writable.
- Workspace/product isolation, user provisioning, and admin controls remain intact.
- `public.atualizar` and the existing keep-alive mechanism remain intact until a separate fix is approved.

## Acceptance criteria

- [ ] Current live advisors and project identity are captured.
- [ ] Every external `SECURITY DEFINER` function is classified by body, ACL, caller, and RLS/trigger dependencies.
- [ ] Public-schema grants, RLS/policies, default privileges, and migration history are inventoried and classified (intentional vs. risky).
- [ ] Storage bucket visibility and object policies preserve public reads and restrict writes to the intended roles/owners.
- [ ] Service-role Edge endpoints and payment webhooks authenticate every non-public operation before using privileged credentials.
- [ ] Each verified high-risk finding has a narrow proposed fix, rollback, and role-specific test matrix.
- [ ] User approves a specific remediation plan before any production schema or permission change.
- [ ] Applied fixes pass pre/post SQL assertions, role smoke tests, migration-history checks, and post-change advisors.
- [ ] Remaining warnings are either resolved or documented with owner/action/rationale.

## Evidence and rollback

- Evidence: Supabase MCP project URL, `get_advisors`, `list_tables`, targeted `execute_sql`, function dependency/source scans, migration inventory, and role-context tests.
- Rollback: every approved migration must include a specific compensating migration/script and restore only the exact pre-change grants/policies; do not drop/rewrite historical applied migrations.
- User approved Phase 1 on 2026-11-09: remove automatic browser setup, protect the three setup/diagnostic Edge endpoints, and restrict `materials` Storage writes to `admin`/`owner` while preserving public reads. The deployed Edge source could not be retrieved; for this phase the user-approved implementation will use the repository source and preserve its behavior except for the auth/setup boundary changes. This authorization does not cover other Edge functions, buckets, subscriptions, or payment flows.
