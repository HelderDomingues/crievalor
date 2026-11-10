-- ============================================================
-- Fase A — Hardening de segurança do banco (audit 08/11/2026)
-- Reversível: cada statement pode ser revertido com GRANTs/drops inversos.
-- ============================================================

-- 1) Asaas (assinatura abandonada): funções órfãs — fora
drop function if exists public.import_user_from_asaas(text, text, text, text, text, text);
drop function if exists public.link_user_to_asaas_customer(text, text);
drop function if exists public.execute_sql(); -- overload sem args, corpo quebrado

-- 2) Tabela keep-alive (pg_cron interno @ 00:00) — só o cron (postgres) toca
alter table public.atualizar enable row level security;
revoke all on public.atualizar from anon, authenticated;

-- 3) Tabelas de instalação/diagnóstico — uso interno (service_role/setup functions)
alter table public.system_installation_status enable row level security;
revoke all on public.system_installation_status from anon, authenticated;

alter table public.storage_buckets_metadata enable row level security;
revoke all on public.storage_buckets_metadata from anon, authenticated;

-- 4) Pagamentos: service_role escreve (webhook), admin lê, anon nada
revoke all on public.netcred_payments from anon, authenticated;
grant select on public.netcred_payments to authenticated;
grant all on public.netcred_payments to service_role;
create policy "payments: admin read" on public.netcred_payments
  for select to authenticated using (check_is_admin());

-- 5) Nenhum cliente faz TRUNCATE
revoke truncate on all tables in schema public from anon, authenticated;

-- 6) Funções: nenhuma executável por clientes por padrão; whitelist explícita
revoke execute on all functions in schema public from anon, authenticated, public;
grant execute on all functions in schema public to service_role;

-- Whlitelist: helpers usados em policies RLS + RPCs chamados pelo app
grant execute on function
  public.check_is_admin(),
  public.is_admin (),
  public.get_user_accessible_products(),
  public.get_user_products(uuid),
  public.user_can_access_resource(uuid, text, uuid, text),
  public.user_has_product_access(uuid, text),
  public.increment_material_access_count(uuid),
  public.complete_quiz_submission(uuid),
  public.process_quiz_completion(uuid),
  public.is_quiz_admin(text),
  public.check_if_user_is_admin(uuid),
  public.is_workspace_member(uuid),
  public.is_workspace_owner(uuid),
  public.bootstrap_admin_role(uuid)
to anon, authenticated;

-- 7) Opt-in de privilégios (best practice 30/10/2026): objetos novos nascem fechados
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;

-- 8) search_path fixo (linter: function_search_path_mutable)
alter function public.update_user_products_updated_at() set search_path = 'public';
alter function public.track_installation_status(text) set search_path = 'public';
alter function public.track_installation_status(text, text, text) set search_path = 'public';
alter function public.create_bucket_if_not_exists(text) set search_path = 'public', 'storage';
alter function public.execute_sql(text) set search_path = 'public';
