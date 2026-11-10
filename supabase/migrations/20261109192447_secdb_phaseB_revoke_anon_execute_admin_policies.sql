-- ============================================================
-- Fase B — Revoke anon EXECUTE nas funções SECURITY DEFINER
-- sinalizadas pelo advisor (0028) + re-alvo das policies admin
-- que as avaliam com roles={public}.
--
-- Evidência da re-target: pg_policies (09/11/2026).
-- Guest reads preservadas pelas policies públicas sem função:
--   posts "Public posts are viewable by everyone",
--   testimonials "Todos podem visualizar depoimentos ativos",
--   lectures "Todos podem visualizar palestras ativas",
--   event_leads "Qualquer pessoa pode inserir leads".
-- Reversível: rollback_secdb_phaseB_grants.sql desfaz tudo.
-- ============================================================

-- 1) anon perde EXECUTE (authenticated/service_role mantêm)
revoke execute on function public.check_is_admin() from anon;
revoke execute on function public.is_admin() from anon;
revoke execute on function public.get_user_accessible_products() from anon;
revoke execute on function public.get_user_products(uuid) from anon;
revoke execute on function public.user_can_access_resource(uuid, text, uuid, text) from anon;
revoke execute on function public.user_has_product_access(uuid, text) from anon;
revoke execute on function public.check_if_user_is_admin(uuid) from anon;
revoke execute on function public.is_workspace_member(uuid) from anon;
revoke execute on function public.is_workspace_owner(uuid) from anon;
revoke execute on function public.bootstrap_admin_role(uuid) from anon;

-- 2) Policies admin de roles={public} passam a TO authenticated
-- (mesmas expressões do estado live; função-effected só esta lista)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select to authenticated
  using ((auth.uid() = id) OR check_is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated
  using ((auth.uid() = id) OR check_is_admin());

drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles" on public.user_roles
  for select to authenticated
  using ((auth.uid() = user_id) OR check_is_admin());

drop policy if exists "Admins can manage all roles" on public.user_roles;
create policy "Admins can manage all roles" on public.user_roles
  for all to authenticated
  using (check_is_admin());

drop policy if exists "Admins can manage all posts" on public.posts;
create policy "Admins can manage all posts" on public.posts
  for all to authenticated
  using (check_is_admin());

drop policy if exists "Admins can manage all testimonials" on public.testimonials;
create policy "Admins can manage all testimonials" on public.testimonials
  for all to authenticated
  using (check_is_admin());

drop policy if exists "Admins can manage image placeholders" on public.image_placeholders;
create policy "Admins can manage image placeholders" on public.image_placeholders
  for all to authenticated
  using (is_admin());

drop policy if exists "Admins podem gerenciar palestras" on public.lectures;
create policy "Admins podem gerenciar palestras" on public.lectures
  for all to authenticated
  using (is_admin());

drop policy if exists "Admins podem gerenciar todos os leads" on public.event_leads;
create policy "Admins podem gerenciar todos os leads" on public.event_leads
  for all to authenticated
  using (is_admin());

drop policy if exists "Usuários podem ver seus próprios leads" on public.event_leads;
create policy "Usuários podem ver seus próprios leads" on public.event_leads
  for select to authenticated
  using (((auth.uid())::text = (id)::text) OR is_admin());

-- 3) Policies user_roles roles={public} com check_if_user_is_admin/bootstrap:
-- re-alvo idêntico (expressões do estado live), porque o anon não as satisfaz
-- e pós-revoke a avaliação para anon viraria erro 42501.
drop policy if exists "Admins can insert roles" on public.user_roles;
create policy "Admins can insert roles" on public.user_roles
  for insert to authenticated
  with check (check_if_user_is_admin(auth.uid()));

drop policy if exists "Admins can manage all user roles" on public.user_roles;
create policy "Admins can manage all user roles" on public.user_roles
  for all to authenticated
  using (check_if_user_is_admin(auth.uid()));

drop policy if exists "Admins can update roles" on public.user_roles;
create policy "Admins can update roles" on public.user_roles
  for update to authenticated
  using (check_if_user_is_admin(auth.uid()));

drop policy if exists "Admins can view all roles" on public.user_roles;
create policy "Admins can view all roles" on public.user_roles
  for select to authenticated
  using (check_if_user_is_admin(auth.uid()));

drop policy if exists "Bootstrap first admin" on public.user_roles;
create policy "Bootstrap first admin" on public.user_roles
  for insert to authenticated
  with check (((auth.uid() = user_id) AND ( SELECT bootstrap_admin_role(auth.uid()) AS bootstrap_admin_role)));
