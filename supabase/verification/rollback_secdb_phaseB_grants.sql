-- ============================================================
-- ROLLBACK Fase B (emergência) — restaura estado pré-migração:
-- anon EXECUTE nas 10 funções + policies admin de volta a roles={public}.
-- ATENÇÃO: isto reabre o achado do advisor (0028); use só para reverter
-- seletivamente por ordem de direção.
-- ============================================================

-- 1) Restaura EXECUTE para anon
grant execute on function public.check_is_admin() to anon;
grant execute on function public.is_admin() to anon;
grant execute on function public.get_user_accessible_products() to anon;
grant execute on function public.get_user_products(uuid) to anon;
grant execute on function public.user_can_access_resource(uuid, text, uuid, text) to anon;
grant execute on function public.user_has_product_access(uuid, text) to anon;
grant execute on function public.check_if_user_is_admin(uuid) to anon;
grant execute on function public.is_workspace_member(uuid) to anon;
grant execute on function public.is_workspace_owner(uuid) to anon;
grant execute on function public.bootstrap_admin_role(uuid) to anon;

-- 2) Restaura policies roles={public} (estado pré-Fase B)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select
  using ((auth.uid() = id) OR check_is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update
  using ((auth.uid() = id) OR check_is_admin());

drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles" on public.user_roles
  for select
  using ((auth.uid() = user_id) OR check_is_admin());

drop policy if exists "Admins can manage all roles" on public.user_roles;
create policy "Admins can manage all roles" on public.user_roles
  for all
  using (check_is_admin());

drop policy if exists "Admins can manage all posts" on public.posts;
create policy "Admins can manage all posts" on public.posts
  for all
  using (check_is_admin());

drop policy if exists "Admins can manage all testimonials" on public.testimonials;
create policy "Admins can manage all testimonials" on public.testimonials
  for all
  using (check_is_admin());

drop policy if exists "Admins can manage image placeholders" on public.image_placeholders;
create policy "Admins can manage image placeholders" on public.image_placeholders
  for all
  using (is_admin());

drop policy if exists "Admins podem gerenciar palestras" on public.lectures;
create policy "Admins podem gerenciar palestras" on public.lectures
  for all
  using (is_admin());

drop policy if exists "Admins podem gerenciar todos os leads" on public.event_leads;
create policy "Admins podem gerenciar todos os leads" on public.event_leads
  for all
  using (is_admin());

drop policy if exists "Usuários podem ver seus próprios leads" on public.event_leads;
create policy "Usuários podem ver seus próprios leads" on public.event_leads
  for select
  using (((auth.uid())::text = (id)::text) OR is_admin());

-- 3) Restaura policies user_roles roles={public} (estado pré-Fase B)
drop policy if exists "Admins can insert roles" on public.user_roles;
create policy "Admins can insert roles" on public.user_roles
  for insert
  with check (check_if_user_is_admin(auth.uid()));

drop policy if exists "Admins can manage all user roles" on public.user_roles;
create policy "Admins can manage all user roles" on public.user_roles
  for all
  using (check_if_user_is_admin(auth.uid()));

drop policy if exists "Admins can update roles" on public.user_roles;
create policy "Admins can update roles" on public.user_roles
  for update
  using (check_if_user_is_admin(auth.uid()));

drop policy if exists "Admins can view all roles" on public.user_roles;
create policy "Admins can view all roles" on public.user_roles
  for select
  using (check_if_user_is_admin(auth.uid()));

drop policy if exists "Bootstrap first admin" on public.user_roles;
create policy "Bootstrap first admin" on public.user_roles
  for insert
  with check (((auth.uid() = user_id) AND ( SELECT bootstrap_admin_role(auth.uid()) AS bootstrap_admin_role)));
