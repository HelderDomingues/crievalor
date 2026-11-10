-- ============================================================
-- Contrato Fase B (read-only) — falha ANTES da migração, passa DEPOIS.
-- Executar como postgres/superuser (MCP execute_sql).
-- ============================================================
DO $$ DECLARE
  v_funcs text[] := ARRAY[
    'public.check_is_admin()',
    'public.is_admin()',
    'public.get_user_accessible_products()',
    'public.get_user_products(uuid)',
    'public.user_can_access_resource(uuid, text, uuid, text)',
    'public.user_has_product_access(uuid, text)',
    'public.check_if_user_is_admin(uuid)',
    'public.is_workspace_member(uuid)',
    'public.is_workspace_owner(uuid)',
    'public.bootstrap_admin_role(uuid)'
  ];
  v_bad_funcs text;
  v_bad_policies text;
BEGIN
  -- 1) anon e public NÃO executam nenhuma das 10; authenticated executa todas
  SELECT string_agg(f, ', ') INTO v_bad_funcs
  FROM unnest(v_funcs) t(f)
  WHERE has_function_privilege('anon', t.f, 'execute')
     OR has_function_privilege('public', t.f, 'execute')
     OR NOT has_function_privilege('authenticated', t.f, 'execute');

  IF v_bad_funcs IS NOT NULL THEN
    RAISE EXCEPTION 'secdb phaseB contract: EXECUTE grant violation on % (anon/public present or authenticated missing)', v_bad_funcs;
  END IF;

  -- 2) Policies re-alvo: existir e roles = {authenticated} (não public/anon)
  SELECT string_agg(p.policyname || ' on ' || p.tablename, ' | ') INTO v_bad_policies
  FROM (VALUES
    ('profiles', 'Users can view own profile'),
    ('profiles', 'Users can update own profile'),
    ('user_roles', 'Users can view own roles'),
    ('user_roles', 'Admins can manage all roles'),
    ('user_roles', 'Admins can insert roles'),
    ('user_roles', 'Admins can manage all user roles'),
    ('user_roles', 'Admins can update roles'),
    ('user_roles', 'Admins can view all roles'),
    ('user_roles', 'Bootstrap first admin'),
    ('posts', 'Admins can manage all posts'),
    ('testimonials', 'Admins can manage all testimonials'),
    ('image_placeholders', 'Admins can manage image placeholders'),
    ('lectures', 'Admins podem gerenciar palestras'),
    ('event_leads', 'Admins podem gerenciar todos os leads'),
    ('event_leads', 'Usuários podem ver seus próprios leads')
  ) AS p(tablename, policyname)
  LEFT JOIN pg_policies pol
    ON pol.schemaname = 'public' AND pol.tablename = p.tablename AND pol.policyname = p.policyname
  WHERE pol.policyname IS NULL OR pol.roles <> ARRAY['authenticated'::name];

  IF v_bad_policies IS NOT NULL THEN
    RAISE EXCEPTION 'secdb phaseB contract: admin policies not TO authenticated (missing or wrong roles): %', v_bad_policies;
  END IF;

  -- 3) Guest reads/inserts preservados: policies públicas sem função continuam
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Public posts are viewable by everyone' AND roles @> ARRAY['public'::name])
     OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Todos podem visualizar depoimentos ativos' AND roles @> ARRAY['anon'::name])
     OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lectures' AND policyname = 'Todos podem visualizar palestras ativas' AND roles @> ARRAY['public'::name])
     OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'event_leads' AND policyname = 'Qualquer pessoa pode inserir leads' AND roles @> ARRAY['public'::name] AND cmd = 'INSERT') THEN
    RAISE EXCEPTION 'secdb phaseB contract: guest-read/insert policies must remain in place';
  END IF;

  RAISE NOTICE 'secdb phaseB contract: ALL ASSERTIONS PASSED';
END$$;
