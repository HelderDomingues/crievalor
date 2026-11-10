# Progress Log — Crie Valor Supabase audit

## Session: 2026-11-09

### Phase 1: Read-only inventory
- **Status:** complete
- Actions taken:
  - Read canonical CrieValor memory page and current session history.
  - Reconfirmed current user constraints and completed Materials migration.
  - Created a fresh audit goal, plan, findings, and progress log; no DB or application changes made in this audit phase.
  - Confirmed project URL, migration history, 37/37 public tables with RLS, current advisors, function ACL/body, policy/grant inventory, and role-specific default ACLs through Supabase MCP.
  - Confirmed current branch `Portfolio` is behind local `main`, while the reviewed security-relevant source paths are identical between them.
  - Inspected subscription entitlement and Storage policies; identified user-controlled active subscriptions, authenticated-wide writes on the `materials` Storage bucket, and active no-JWT setup Edge Functions.
- Files created/modified:
  - `goal.md`
  - `task_plan.md`
  - `findings.md`
  - `progress.md`

### Phase 2: Function/dependency validation
- **Status:** complete with deployment-source limitation documented
- Completed: read the 10 flagged SECURITY DEFINER bodies/ACLs, mapped current UI/backend callers, inspected local setup handlers and live Edge JWT metadata, and reviewed NetCred webhook/payment flow.
- Blocked/open: Supabase MCP Edge source retrieval failed with `MCP error -32603: An internal error occurred during tool execution`; CLI `functions download --use-api` failed with `expected multipart response, got application/octet-stream`. Local source is not treated as deployed proof.
- Newly verified: `materials` Storage object policies allow all authenticated writes; `subscriptions` own-row DML can self-grant an active plan; the subscription-delete UI cascades into `netcred_payments`; NetCred HMAC is optional in local source; `main.tsx` invokes the no-JWT setup endpoint at every browser startup.
- Scope note: `goal.md` now explicitly includes Storage policies and privileged Supabase write paths; this expands read-only audit scope based on live evidence. No implementation or production endpoint call was made.
- No production DDL/DML or endpoint calls were performed. Recent `function_edge_logs` show 123 POSTs to `setup-rls` in the selected 24-hour window: 75 with JWT role `anon` and 48 `authenticated`, all HTTP 200. No POSTs to `setup-storage-policies` or `diagnose-system` appeared in that window. This disproves the earlier exact-message search's implication of inactivity.
- The initial exploratory log query failed with `Field "log_level" does not exist`; corrected query omitted that field and completed successfully.

### Phase 3/4: Approved Storage and setup-function remediation
- **Status:** in_progress; user approved Phase 1 on 2026-11-09.
- Reconfirmed project URL `https://nmxfknwkhnengqqjtwru.supabase.co` before work.
- Live `storage.objects` policies: public SELECT on `materials`, but INSERT/UPDATE/DELETE are `TO public` and permit every authenticated user; anon/authenticated table grants exist. The bucket remains public.
- Live `setup_storage_bucket_policies(text)` drops/recreates all four policies and gives broad authenticated DML. Direct EXECUTE is service_role-only, but `setup-rls` uses a service-role client, so its repeated execution can restore those writes. Phase 1 includes a `materials`-only admin/owner branch in that helper; other bucket policies are out of scope.
- Current Storage triggers: UPDATE timestamp trigger; statement DELETE trigger rejects direct SQL deletes unless a GUC is set. Test plan must account for this and must not bypass Storage API integrity except inside a fully rolled-back role probe.
- Supabase MCP docs consulted: Edge auth requires validating the caller with `auth.getUser(token)`; Storage operations are authorized separately through `storage.objects` RLS. Firecrawl status showed `-5,221 / 1,000` credits; no external scrape attempted.
- Test-first contract `supabase/verification/materials_storage_rls_contract.sql` was added before implementation and executed against the linked project. It failed as expected with `P0001: materials Storage contract: INSERT policy must target authenticated, not public`. The single DO statement was atomic; a follow-up policy query confirmed the current policies remain unchanged (`TO public`, so no partial DDL persisted).
- A fresh read-only contract rerun before migration also fails on the live state (`materials Storage contract: setup helper does not preserve the admin/owner materials boundary`); after reviewer feedback the contract itself no longer calls the policy-changing helper.
- Implementation prepared locally: `src/main.tsx` no longer runs setup on each page load; the three Edge handlers validate a real user token and admin/owner membership before constructing any service-role operation; their platform config is `verify_jwt=true`; CORS is POST/OPTIONS-specific; the service-role setup helper will get a materials-specific write branch; migration and rollback/test SQL are staged locally only.
- Independent review: database reviewer found no migration blocker, but noted the initial contract mutated policies, lacked some bucket-scoping assertions, and assumed an object existed. These were corrected: contract now read-only and explicitly checks bucket scope; helper regeneration is tested inside a rolled-back PL/pgSQL subtransaction; role smoke no longer assumes the bucket contains files. Edge reviewer found no auth blocker; CORS methods were narrowed. Its config warning about `[functions.asaas-webhook]` is a false positive from the previously approved Asaas cleanup: current live Edge list has no `asaas-webhook`; the local obsolete block remains removed.
- Fresh local checks: `deno test --no-lock ...authorize-admin_test.ts` = 5 passed; `deno check --no-lock` on all three handlers passes; `deno lint` on changed Edge/shared files passes; project `type_check` reports no TypeScript errors. The final Deno format check is limited to new/shared and small entrypoint files; older setup-handler formatting was intentionally not mass-reformatted.
- No production DDL/deploy yet. Next: have the updated SQL verification reviewed, then deploy the guarded functions first and apply the Storage migration so the still-active unauthenticated endpoint cannot regenerate broad policies in the transition window. Afterward run Storage role smoke tests, endpoint invalid-token probes that cannot mutate, migration-history and advisor checks.

## Test / evidence log
| Check | Expected | Actual | Status |
|---|---|---|---|
| Current project identity via Supabase MCP | Crie Valor `nmxfknwkhnengqqjtwru` | `https://nmxfknwkhnengqqjtwru.supabase.co` | pass |
| RLS/schema inventory | All public tables and policies reviewed | 37/37 public tables have RLS; no FORCE RLS | pass |
| Security/performance/health advisors | Current findings captured | Security 10 anon + 10 authenticated SECURITY DEFINER; perf 359 notices; health empty | pass |
| Materials Storage writes | Ordinary authenticated users cannot mutate material files | Migration `20261109135329` applied: reader-supported user INSERT=caught, UPDATE=0, DELETE=0; written DML OK; ordinary users can alter any metadata | pass |
| Subscription self-entitlement | Ordinary users cannot assign paid plan/status | Own-row-only DML; helper trusts active plan | fail (remediation not yet approved) |
| Privileged setup Edge source | Deployed handler has auth or is disabled | Deployed versions 123/42/29 with `verify_jwt=true` + JWT/admin-or-owner guard; no-auth probe = gateway 401 on all three | pass (deployed from reviewed repo source; remote pre-deploy source never retrievable) |

## Current location
| Question | Answer |
|---|---|
| Where am I? | Phase 1 (approved remediation) applied and verified; awaiting user decision on Phase-B candidates |
| Where am I going? | Report evidence and residual risks; propose next approved phase (SECURITY DEFINER functions / subscription guard / performance) |
| What's the goal? | See `goal.md` |
| What have I learned? | See `findings.md` |
| What have I done? | See this file |
