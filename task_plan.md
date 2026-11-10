# Task Plan: Crie Valor Supabase database audit

## Goal
Inventory unresolved production database risks for project `nmxfknwkhnengqqjtwru`, map real app dependencies, and propose safe approved remediation phases.

## Current Phase
Phase 4 — implement approved Phase 1

## Phases

### Phase 1: Refresh live baseline
- [x] Confirm Supabase project URL and migration history.
- [x] Fetch current security, performance, and health advisors.
- [x] Inventory tables, RLS state, policies, grants, default ACLs, views/triggers/functions.
- **Status:** complete

### Phase 2: Validate exposed function risks
- [x] Read the 10 advisor-flagged SECURITY DEFINER bodies plus relevant invoker RPCs; capture ACL/search_path/owner.
- [x] Map known RPC callers and policies to current repository source.
- [x] Inventory active Edge Functions and JWT flags; inspect local handlers/callers.
- [x] Query recent `function_edge_logs`: 123 `setup-rls` POSTs in 24h (75 `anon`, 48 `authenticated`, all HTTP 200); no `setup-storage-policies`/`diagnose-system` POSTs in that window.
- [x] Attempt to retrieve deployed source for active Edge Functions; MCP and CLI retrieval failed. User approved Phase 1 implementation from repository source for `setup-rls`, `setup-storage-policies`, and `diagnose-system`; unrelated Edge functions remain untouched.
- [ ] Confirm NetCred's supported signature/token headers before fail-closed webhook remediation.
- [ ] Confirm whether the self-service subscription deletion (which cascades to `netcred_payments`) is intentional.
- [ ] Run role-context DML smoke probes only after the user approves a test plan; no production writes were run in this audit phase.
- **Status:** complete with deployment-source limitation documented

### Phase 3: Classify findings and design remediation
- [x] Separate exploitable issues from intentional deny-by-default and performance notices.
- [x] Rank by impact and dependency risk.
- [x] Present phased plan, acceptance tests, and rollback.
- [x] Receive user approval for Phase 1 only.
- **Status:** complete

### Phase 4: Apply approved changes
- [x] Update the goal with approved Phase 1 scope and the necessary `setup_storage_bucket_policies('materials')` regeneration guard.
- [x] Write Storage policy contract first and observe the expected pre-change failure (`materials Storage contract: INSERT policy must target authenticated, not public`).
- [x] Create the migration with `supabase migration new`; do not rewrite historical applied migrations (`20261109135329_materials_storage_admin_owner`).
- [x] Add Deno unit tests for missing/invalid JWT, non-admin, role-lookup failure, and authorized owner/admin; Deno check/lint/test/typecheck pass.
- [x] Independent reviews (3 SQL + 1 edge round); fixed helper `REVOKE/GRANT EXECUTE` (CREATE OR REPLACE keeps old authenticated grant) and added SELECT-policy assertion to helper-regeneration test.
- [x] Deploy 3 Edge handlers (`verify_jwt=true`, import map, JWT+role guard before service-role ops) as versions 123/42/29; no-auth probes return gateway 401.
- [x] Apply migration via MCP; align history with `supabase migration repair` (reverted stray `20261109190730`, marked `20261109135329` applied); `list_migrations` 1↔1 local.
- [x] Pre-migration RED→ post-migration GREEN: contract passes, helper-regeneration passes.
- **Status:** complete

### Phase 5: Verify and report
- [x] Run real anon/authenticated/admin/owner role smoke (`probe_rows=0`; anon+common blocked, admin+owner DML OK, rolled back).
- [x] Re-read migration history (1↔1) and rerun advisors (security: no storage findings remain; perf summary captured).
- [ ] Report evidence, residual risks, and dashboard-only actions to the user.
- **Status:** complete (report pending in this step)

## Decisions
| Decision | Rationale |
|---|---|
| Start read-only; no production DDL before plan approval | Multiple live permissions and app dependencies make blanket revokes unsafe |
| Keep `public.materials` public-read/admin-owner-write | Explicit user requirement from the prior phase |
| Exclude leaked-password protection | User says current Supabase Free tier cannot enable it |
| Preserve timestamped historical migrations | Existing migration history is already divergent; rewriting old applied files is unsafe |
| Do not treat performance-advisor policy overlap counts as vulnerabilities | Validate actual grants, RLS predicates, role, and dependencies for each table |
| Treat local Edge Function source as unverified deployment content | Live function-source reads failed; remote metadata confirms active JWT flags only |
| Modify only the `materials` branch in the shared storage setup RPC | Live function body shows it recreates broad DML for every bucket; this narrow branch is required so setup cannot undo the approved policy |
| Deploy guarded Edge handlers from reviewed repo source before applying the migration | Closing the unauthenticated endpoint first prevents broad-policy regeneration in the transition window; deployed source was unreachable so user-approved repo source replaces it |
| `CREATE OR REPLACE` keeps old ACLs | Old helper granted EXECUTE to authenticated; migration must include explicit `REVOKE ... FROM PUBLIC, anon, authenticated` + `GRANT ... TO service_role, postgres` |
| Edge imports stay bare with `deno.json` import map | deno 2.9 lint hard-errors inline `npm:`/`https:` prefixes; Edge runtime supports bare imports via included import map (confirmed deployed `import_map=true` and handlers boot) |

## Errors encountered
| Error | Attempt | Resolution |
|---|---:|---|
| Supabase CLI linked query had stale `cli_login_postgres` auth / `ECIRCUITBREAKER` in the prior phase | 1 | Use project-specific Supabase MCP for read-only queries and remote migration state; do not retry in a loop |
| Supabase `get_edge_function` returned `MCP error -32603: An internal error occurred during tool execution` | 6 function-source requests | CLI alternative attempted once; continue with local/source metadata but mark deployment source unverified |
| `supabase functions download setup-rls --use-api` returned `expected multipart response, got application/octet-stream` | 1 | Stop repeating the same CLI path; retrieve source through a different approved channel before deploying changes |
| Supabase logs query selected nonexistent column `log_level` | 1 | Omitted that field and queried timestamp/message/attribute keys; successful follow-up confirmed active `setup-rls` traffic |
| `timeout` shell command is not installed in this macOS zsh environment | 1 | Use the Bash tool's timeout parameter; `firecrawl --status` completed and showed negative credits, so use current Supabase MCP docs instead of retrying Firecrawl |
| Initial Deno strict check found 17 diagnostics in legacy handler bodies (implicit parameters, unknown catch values, unused diagnostic action); initial Deno lint also caught inline import prefixes and test-only unused `async` | 1 | Added pinned `supabase/functions/deno.json` import map, added types/error conversion, removed unused action/results, and normalized test callbacks; fresh Deno check/lint/test/typecheck all pass |
