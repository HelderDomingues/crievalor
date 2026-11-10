# Crie Valor Supabase Audit — Findings

## User requirements
- Audit and harden only Crie Valor Supabase project `nmxfknwkhnengqqjtwru`.
- Preserve public read for `materials`; only admin/owner may write any field.
- Preserve NetCred, portfolio, workspace/product access, and `public.atualizar`/keep-alive.
- Leaked-password protection is not actionable on the current Free tier.
- Do not apply production DDL until the specific remediation plan is approved.

## Prior baseline (observed 2026-11-09; refresh before decisions)
- Project-specific MCP URL was `https://nmxfknwkhnengqqjtwru.supabase.co`.
- After the Materials policy fix, live security advisor still reported 10 `SECURITY DEFINER` functions callable by `anon`, and the same 10 by `authenticated`:
  `bootstrap_admin_role(uuid)`, `check_if_user_is_admin(uuid)`, `check_is_admin()`, `get_user_accessible_products()`, `get_user_products(uuid)`, `is_admin()`, `is_workspace_member(uuid)`, `is_workspace_owner(uuid)`, `user_can_access_resource(uuid,text,uuid,text)`, `user_has_product_access(uuid,text)`.
- `public.atualizar`, `public.storage_buckets_metadata`, and `public.system_installation_status` were RLS-enabled with no policies and no client grants (deny-by-default; verify again).
- Auth leaked-password protection reported disabled; user confirmed Free tier prevents enabling it. Postgres reported `supabase-postgres-15.8.1.054` has security patches available.
- Role-specific default privileges: `postgres` had client EXECUTE revoked, but `supabase_admin` function defaults still listed EXECUTE for `anon` and `authenticated`; determine whether `supabase_admin` creates exposed functions before proposing changes.
- `materials` policy was fixed by migration `20261109123010_materials_admin_owner_write_only`; post-fix advisor still reported policy overlaps, `materials_folder_id_fkey` missing index, unused `idx_materials_product_id`, and auth/current-setting initplan overhead. Don't conflate performance items with authorization defects.
- Prior performance advisor snapshot: multiple-permissive-policy findings 236, auth initplan 72, missing FK indexes 6, unused indexes 37. These values are historical until refreshed.
- Migration history has pre-existing remote/local timestamp divergence. New applied migrations must be reconciled one-to-one; do not use `db push` blindly.
- Previous query found NetCred uses `netcred_payments`; do not revoke its service-role write or admin read. `materials` public read/admin-owner writes are live requirement.

## Research findings
- See `~/opencode-memory/repos/github.com/helderdomingues/crievalor.md` and native sessions `ses_e43696b76ffec16GhkQdttH77i`, `ses_e4361ce5dffegEE11vCFMu2Q6T`, `ses_e3fbb36f8ffeEAKmAjDO9Md3lV`.
- Every finding below remains provisional until refreshed with live Supabase MCP and current source.

## Refreshed live baseline (2026-11-09 12:46 UTC; project identity confirmed)
- Supabase MCP URL: `https://nmxfknwkhnengqqjtwru.supabase.co`; DB session role `postgres`.
- Remote migration history includes `20261108195039 secdb_phaseA_hardening`, `20261108195229 fix_user_accessible_products_plan`, and `20261109123010 materials_admin_owner_write_only`. The new Materials migration appears once.
- 37 public tables; all have RLS enabled; none has FORCE RLS; no anon/authenticated TRUNCATE grants. `atualizar`, `storage_buckets_metadata`, `system_installation_status` have no policies and no client table privileges (intentional deny-by-default; keep unless dependencies prove otherwise).
- `anon` has at least one DML privilege on 32/37 tables. This does not itself prove access because RLS is enabled; classify each table against its policy. `service_role` has full DML as expected. `materials` is an exception: anon SELECT only; authenticated retains DML under admin/owner RLS.
- Current counts: 2 admin roles, 2 owner roles, 12 subscriptions, 6 user_products, 7 profiles. Do not expose row-level customer/payment data in audit notes.

### Fresh advisors
- Security: 3 INFO `rls_enabled_no_policy`; 10 public SECURITY DEFINER functions callable by anon and the same 10 by authenticated; leaked-password disabled (Free tier, user says not actionable); Postgres `supabase-postgres-15.8.1.054` patch warning.
- Health: no lints returned.
- Performance: 359 findings: 6 unindexed foreign keys, 72 auth initplans, 37 unused indexes, 236 multiple-permissive-policy role/action findings, 8 duplicate indexes (43 INFO / 316 WARN). These overlap findings are not proof of unauthorized access; inspect grants and predicates.
- `materials` has 14 performance findings: missing index on `materials_folder_id_fkey`; unused `idx_materials_product_id`; 3 auth-initplan policies; 9 role/action multiple-policy findings. Treat these as optimization candidates, not permission proofs.

### Live access-control candidates (confirmed policy/grant facts; impact review pending)
- `client_logos`: policy `Allow all operations for authenticated users`, `FOR ALL TO authenticated USING (true)`, with table DML grant. Every authenticated user can mutate the table under current RLS.
- `quiz_modules`: authenticated policies allow SELECT/INSERT/UPDATE/DELETE with `true`; DML grants exist. No in-repo app caller was found by source scan, but quiz completion functions/triggers may depend on the catalog.
- `subscriptions`: authenticated has table DML. Policies allow INSERT/UPDATE/DELETE of the caller's own row (`auth.uid() = user_id`). Columns include `plan_id`, `status`, `payment_status`, trial/payment fields. `get_user_accessible_products()` trusts active subscriptions for entitlement mapping. This is a concrete likely self-entitlement issue; validate app's direct-write dependencies and a transaction-local synthetic-user attempt before fixing.
- `profiles`: table has `role`, `subscription_status`, email/contact fields; policies allow self-update. Source scan found the UI consults both `profiles.role` and `user_roles.role`, while backend `admin-action` uses `user_roles`. Determine whether self-edit can grant UI or any backend privileges; avoid broad profile update revoke without a column-level plan.
- `user_roles`: policy `Bootstrap first admin` allows self INSERT when `bootstrap_admin_role(auth.uid())` returns true. Live function body is SECURITY DEFINER and inserts the supplied `admin_user_id` whenever current admin count is zero; function is callable by anon/authenticated. Current admin count is 2, so the conditional path is blocked today but remains unsafe bootstrap logic.
- `get_user_products(p_user_id uuid)` returns `user_active_products` for the supplied ID without binding it to `auth.uid()`, and is callable by anon/authenticated. Active UI calls it with the current user's ID, but client roles can pass another user's ID, exposing product/entitlement metadata.
- `user_can_access_resource(p_user_id uuid, p_resource_type text, p_resource_id uuid, p_resource_path text)` and `user_has_product_access(p_user_id uuid, p_product_slug text)` similarly accept an arbitrary user ID and return booleans; both are callable by anon/authenticated. Caller-source map shows `user_can_access_resource` has an active authenticated UI caller; no local caller found for `user_has_product_access`.
- `check_is_admin()`, `is_admin()`, `get_user_accessible_products()`, `is_workspace_member(uuid)`, and `is_workspace_owner(uuid)` derive identity from `auth.uid()` and are used by RLS policies. Keep their policy execution dependencies while reviewing direct anonymous RPC exposure.
- `check_if_user_is_admin(user_id uuid)` returns an admin boolean for any supplied UUID, is callable by anon/authenticated, and has no in-repo caller/policy dependency found.
- `complete_quiz_submission(p_user_id uuid)` is SECURITY INVOKER but callable by anon/authenticated. It updates `quiz_submissions` for the supplied user ID, setting `completed=true`, `completed_at=now()`, and `contact_consent=true`; RLS may constrain affected rows. No in-repo caller was found. This is a consent/integrity concern to classify, not a confirmed cross-user write.
- `execute_sql(text)` currently is SECURITY INVOKER and ACL only `{postgres,service_role}`; anon/authenticated cannot execute. The two storage bucket creators, `setup_storage_bucket_policies`, `track_installation_status`, and `get_system_setting` are SECURITY DEFINER but ACL is likewise service_role/postgres only.
- All live application functions inspected are owned by `postgres` with `search_path=public` (storage setup functions also include `storage`). `postgres` default privileges in `public` grant only service_role, but `supabase_admin` default privileges in `public` still grant anon/authenticated on functions, tables, and sequences. Current application objects are owned by postgres; whether `supabase_admin` creates future public objects is unverified.

### Remote Edge Function surface
- `supabase_list_edge_functions` reports ACTIVE and `verify_jwt=false` for `setup-rls` v122, `setup-storage-policies` v41, `quiz-webhook` v23, `webhookMakeMar_activation` v6, and `diagnose-system` v28. `whatsapp-webhook` is ACTIVE with `verify_jwt=true` despite the local config discrepancy; `send-whatsapp-message` and `admin-action` also require JWT.
- `supabase_get_edge_function` returned `MCP error -32603: An internal error occurred during tool execution` for all six source requests. Do not claim the deployed handler's authorization logic from local files alone; compare remote source or obtain a reliable download path before changing flags/code.
- Current Supabase docs say `verify_jwt=false` disables the platform JWT check; webhooks must validate their provider signature in-handler; user-only functions should keep JWT verification, and service-to-service calls need secret authentication. Sources: https://supabase.com/docs/guides/functions/auth and https://supabase.com/docs/guides/functions/auth-headers.

### Source-code map (repository inspection, not live deployment proof)
- `get_user_products` and `user_can_access_resource` have active callers in `src/hooks/useProductAccess.ts`; `check_is_admin`, `is_admin`, `get_user_accessible_products`, and `is_workspace_member` are RLS helpers. See `session_read(ses_e4361ce5dffegEE11vCFMu2Q6T, offset=2)` for full paths/call map.
- `subscriptionService` performs direct client reads/writes to `subscriptions`; NetCred webhooks/service-role functions also write. A blanket revoke would require moving/adjusting UI write flow or constraining safe columns.
- Source map also flags NetCred webhook signature verification only when the signature header is present, and `trial-expiration-cron` using the anon client with ignored update errors. These are adjacent app-integrity risks; keep separate from DB policy remediation and verify against current source/deployment.
- Supabase Edge Function security docs and source map are read-only. No production DDL or test writes were run during this audit phase.

## Additional live verification: subscriptions, Storage, and privileged setup flows

### Subscription entitlement escalation
- `subscriptions` has only a primary key and FKs (`user_id → auth.users`, `workspace_id → workspaces`); no CHECK constraint restricts `plan_id`, `status`, or `payment_status`.
- Authenticated users have DML grants and own-row INSERT/UPDATE/DELETE policies (`auth.uid() = user_id`). `public.get_user_accessible_products()` trusts `status='active'` and maps plans such as `avancado` to LUMIA access; it does not check payment status. Thus a signed-in user can create/update their own row to `status='active', plan_id='avancado'` and obtain paid access. This is strongly proven by policy/grant/function logic; no production write probe was run.
- Current app writers: `netlify/functions/create-checkout.ts` uses `supabaseAdmin` to create trialing/pending subscriptions. Frontend `subscriptionService.updateContractAcceptance()` is called by `src/components/profile/SubscriptionDetails.tsx` and only changes contract acceptance fields + `updated_at`. `updateSubscriptionStatus()` and `cancelSubscription()` have no current caller. `src/components/profile/subscription/DeleteCustomerData.tsx` directly deletes the current user's subscription rows; preserve or deliberately replace this user-facing deletion flow.
- `netcred_payments.subscription_id` FK cascades `ON DELETE CASCADE`; the current self-service subscription deletion also deletes linked payment logs. Confirm whether that is intentional and compatible with financial/audit retention before changing DELETE behavior.
- `public.user_active_products` is a `security_invoker=true` view, so direct view reads respect underlying RLS. This does not protect `get_user_products(p_user_id)`, which is SECURITY DEFINER and filters only the caller-supplied UUID.
- Aggregate current subscription rows: 1 `active/avancado`, 10 `trialing/basico`, 1 `trialing/intermediario`; no rows with `payment_status` equal to pending/expired/refunded/canceled. No row-level user/payment data is recorded here.

### Storage writes
- All current storage buckets have `public=true`: `avatars` (7 objects), `blog_images` (1), `clientlogos` (37), `materials` (66), `portfolio` (30), `testimonials-photos` (object count not queried).
- `anon`, `authenticated`, and `service_role` all have table-level SELECT/INSERT/UPDATE/DELETE on `storage.objects`; RLS policies determine actual access.
- The `materials` bucket has public SELECT and `Bucket policy for materials - INSERT/UPDATE/DELETE` policies accepting every authenticated user (or service_role), with no admin/owner or path ownership check. Users can add, replace, or delete material files even though `public.materials` metadata writes were restricted. This bypasses the intended admin/owner content-management boundary.
- Live policy details: all four `Bucket policy for materials - {SELECT,INSERT,UPDATE,DELETE}` rows are `TO public`; SELECT is `bucket_id = 'materials'`, while INSERT/UPDATE/DELETE use `auth.role() = 'authenticated' OR auth.role() = 'service_role'`. `storage.buckets.materials.public=true`; anon and authenticated both have table DML grants. Two triggers exist: UPDATE sets `updated_at`; a statement-level DELETE trigger blocks direct SQL deletion unless `storage.allow_delete_query=true` (Storage API is the supported path).
- `blog_images` likewise allows every authenticated user upload/update/delete. `avatars` correctly constrains object paths to the caller's UID. `portfolio` currently has admin-role write policies; `clientlogos` has an admin-only ALL policy. Do not change these other buckets without dependency/intent review.

### Unauthenticated service-role setup endpoints
- Remote Edge metadata confirms ACTIVE `setup-rls` v122, `setup-storage-policies` v41, and `diagnose-system` v28 with `verify_jwt=false`; root `supabase/config.toml` matches these flags. Remote source retrieval failed: `supabase_get_edge_function` returned `MCP error -32603: An internal error occurred during tool execution`; CLI `supabase functions download setup-rls --use-api` returned `expected multipart response, got application/octet-stream`. Do not claim local code is exactly the deployed code.
- Local `supabase/functions/setup-rls/index.ts` creates a service-role client without handler authentication and invokes bucket/policy setup RPCs. Local `supabase/functions/setup-storage-policies/index.ts` also uses service_role without authentication, accepts caller-provided `bucket_name`/`action`, can create a bucket public (`body.is_public || true`), or replace its policies through `setup_storage_bucket_policies`. That RPC drops matching policies and recreates public-read plus authenticated-wide INSERT/UPDATE/DELETE.
- Live `public.setup_storage_bucket_policies(text)` is SECURITY DEFINER with `search_path=public,storage`; its dynamic DDL drops and recreates all four named policies, using broad authenticated DML for every bucket. Direct EXECUTE is currently only service_role/postgres, but `setup-rls` calls it with service_role. The approved Phase 1 therefore includes a `materials`-only branch in this helper; changing current policies without this would let a subsequent setup call restore broad writes. Other bucket behavior remains unchanged.
- These local handlers pin `https://deno.land/std@0.168.0` and `@supabase/supabase-js@2.38.4`, both >1 year old and potentially stale; confirm remote source before deciding whether to upgrade or retire them.
- Recent `function_edge_logs` for 2026-11-08T12:46Z–2026-11-09T12:46Z confirm 123 POSTs to `setup-rls`: 75 with JWT role `anon` and 48 with `authenticated`, all HTTP 200. No POSTs to `setup-storage-policies` or `diagnose-system` appeared in that window. This confirms an actively invoked, anon-accepted endpoint; exact deployed handler behavior remains unverified because source retrieval failed.

### Application dependency pass
- `src/main.tsx` is the only app caller/import of `executeInitialSetup`; it runs `setupService` from the application bootstrap on each page load. The other `setupService` methods that invoke `diagnose-system` or `setup-rls` have no other app callers found.
- `src/services/storageService.ts` is imported only by `src/components/PortfolioAdminPanel.tsx`, for the portfolio image upload/delete helpers. Its methods that call `setup-storage-policies` or `setup-rls` have no app callsites found. This lowers the cost of retiring the unused setup endpoint(s), subject to checking external/admin operations.
- `subscriptionService.updateSubscriptionStatus` and `cancelSubscription` have no caller found in `src`. `updateContractAcceptance` is called from `src/components/profile/SubscriptionDetails.tsx` and updates only `contract_accepted`, `contract_accepted_at`, and `updated_at` for the authenticated user's row. `src/pages/AdminSubscriptions.tsx` is wrapped with `AdminAuth` and only reads subscriptions/payments in the inspected code.
- `src/components/profile/Subscription/DeleteCustomerData.tsx` directly deletes the current user's `subscriptions` rows and says all subscription data was deleted; the live FK means this also deletes related `netcred_payments`. Do not remove its policy without a data-retention decision or replacement.
- `src/main.tsx:37-61` calls `initializeApp()` on every browser load; `executeInitialSetup` invokes `setup-rls` and retries up to 3 times. Remote `setup-rls` is active with no gateway JWT check. If the deployed source matches the local handler, each visitor can invoke service-role policy/bucket mutation; ordinary page loads trigger it too. Critical candidate; remote-source mismatch is unexcluded.
- Supabase docs searched for this approved change: Edge Functions can verify the user's JWT via `Authorization` and `auth.getUser(token)`; Storage policies are per-operation on `storage.objects`. For `UPDATE`, preserve both USING and WITH CHECK. Public buckets are publicly downloadable, while listing and DML remain governed by policies. Sources: https://supabase.com/docs/guides/functions/auth-legacy-jwt and https://supabase.com/docs/guides/storage/security/access-control.
- Local `diagnose-system` uses service_role without auth and returns table/bucket names, policy metadata, and system-setting keys (not setting values). `src/services/setupService.ts` has diagnostics/repair methods with no external caller found. `storageService.ts` has setup invocations but no external caller of the bucket-creation helper functions was found.
- Last-24-hour log query for the exact local console messages from these handlers returned no rows; this does not prove they are unused. The live `materials` Storage policy predicate matches the local setup RPC, supporting but not proving the same code generated it.

### NetCred webhook authentication
- `netlify/functions/netcred-webhook.ts:34-68` requires that the server env `NETCRED_WEBHOOK_TOKEN` exists but only compares the HMAC when `x-netcred-signature` is present; missing signature is accepted. `Authorization` and `x-netcred-token` are read but never validated by `BaseController` or this handler. The March 2026 prior security change introduced this optional-HMAC behavior; it is not fail-closed.
- A no-signature request can select `PAYMENT_PAID` via `x-netcred-event=PAYMENT_PAID` or body status `ENDED`; `onPaymentPaid` resolves a subscription by `chargeLinkId`/subscription UUID and uses service-role credentials to set `status='active'`, `payment_status='paid'`, and payment details. Confirm NetCred's supported auth headers before changing, because the optional-signature branch may have been a compatibility workaround. Deployed Netlify code is not independently verified.
- `netlify/functions/create-checkout.ts` does validate a Supabase bearer token through `/auth/v1/user` and uses the verified user ID; no body-supplied userId spoofing path found.

### Branch/deployment caveat
- Current `Portfolio` branch is `1ac73e7`; local `main`/`origin/main` is `93817a4`. Relevant code paths compared between branches (NetCred, subscription, Supabase config/functions) are unchanged; only the portfolio migration `supabase/migrations/20261108120000_portfolio_projects.sql` is added on main in the inspected path set. This shows local branch source consistency, not deployed production provenance.
- Local `supabase/functions/whatsapp-webhook/config.toml` says `verify_jwt=false`, while live Edge metadata says `verify_jwt=true`; live metadata is the deployed setting, track as config drift.

## Open security questions
- Can the deployed source for active `verify_jwt=false` functions be retrieved/compared to local `setup-rls`, `setup-storage-policies`, `diagnose-system`, `quiz-webhook`, and `webhookMakeMar_activation` before choosing delete vs. authenticate?
- Does NetCred reliably send `x-netcred-signature`; if not, which header/token is the supported shared-secret contract? Is deployed Netlify source identical to this worktree?
- Is the user-facing “Excluir dados de assinatura” supposed to delete linked `netcred_payments` logs through ON DELETE CASCADE, or should payment evidence be retained/anonymized?
- Are `client_logos` and quiz module writes meant to be admin/owner-only? Is the quiz catalog edited in any external workflow not present in the repo?
- Does any non-admin product/profile UI intentionally set `profiles.role`, and which profile columns are valid self-edit fields?
- Which role (`postgres` or `supabase_admin`) actually creates public objects through supported deployment workflows? Do not alter platform default ACLs without proof.
- Which historical migration mismatches are semantic differences vs. timestamp-only drift? Avoid `db push` while unresolved.
- Is the external keep-alive active and reliable? Prior internal pg_cron execution did not prevent project pause.
- After a concrete plan is approved, which live role-context smoke probes (rolled-back writes only) can be run without violating payment/consent/Storage side effects?

## Decisions
| Decision | Rationale |
|---|---|
| No broad revoke or blanket policy changes before caller/body mapping | Could break RLS helpers and production workflows |
| Fix critical permissions in small reviewed migrations, not one mega-migration | Easier rollback and impact isolation |
| Free-tier password protection is documented, not treated as code work | User-confirmed plan limitation |

## Errors / blockers
| Issue | Handling |
|---|---|
| CLI linked DB query previously failed with `password authentication failed for user "cli_login_postgres"` and `(ECIRCUITBREAKER) too many authentication failures` | Use connected project-specific Supabase MCP for this read-only audit |
