DO $$
DECLARE
  v_policy record;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    WHERE c.oid = 'public.materials'::regclass
      AND c.relrowsecurity
  ) THEN
    RAISE EXCEPTION 'materials contract: RLS is not enabled';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'materials'
      AND policyname = 'Allow read access to materials for all users'
      AND cmd = 'SELECT'
      AND roles @> ARRAY['public']::name[]
      AND qual = 'true'
  ) THEN
    RAISE EXCEPTION 'materials contract: public SELECT policy is missing or changed';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'materials'
      AND policyname = 'Enable all access for authenticated users'
  ) THEN
    RAISE EXCEPTION 'materials contract: broad authenticated FOR ALL policy still exists';
  END IF;

  IF NOT has_table_privilege('anon', 'public.materials', 'SELECT') THEN
    RAISE EXCEPTION 'materials contract: anon lost public SELECT';
  END IF;

  IF has_table_privilege('anon', 'public.materials', 'INSERT')
     OR has_table_privilege('anon', 'public.materials', 'UPDATE')
     OR has_table_privilege('anon', 'public.materials', 'DELETE')
     OR has_table_privilege('anon', 'public.materials', 'TRUNCATE')
     OR has_table_privilege('anon', 'public.materials', 'REFERENCES')
     OR has_table_privilege('anon', 'public.materials', 'TRIGGER') THEN
    RAISE EXCEPTION 'materials contract: anon retains table write privileges';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_attribute a
    WHERE a.attrelid = 'public.materials'::regclass
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND (
        has_column_privilege('anon', 'public.materials', a.attname, 'INSERT')
        OR has_column_privilege('anon', 'public.materials', a.attname, 'UPDATE')
      )
  ) THEN
    RAISE EXCEPTION 'materials contract: anon retains column-level write privileges';
  END IF;

  IF NOT has_table_privilege('authenticated', 'public.materials', 'SELECT')
     OR NOT has_table_privilege('authenticated', 'public.materials', 'INSERT')
     OR NOT has_table_privilege('authenticated', 'public.materials', 'UPDATE')
     OR NOT has_table_privilege('authenticated', 'public.materials', 'DELETE')
     OR has_table_privilege('authenticated', 'public.materials', 'TRUNCATE') THEN
    RAISE EXCEPTION 'materials contract: authenticated DML grants required by admin/owner policies are missing';
  END IF;

  IF position('owner' IN pg_get_functiondef('public.check_is_admin()'::regprocedure)) = 0 THEN
    RAISE EXCEPTION 'materials contract: check_is_admin() no longer recognizes the owner role';
  END IF;

  FOR v_policy IN
    SELECT *
    FROM (VALUES
      ('Admins can insert materials', 'INSERT', false, true),
      ('Admins can update materials', 'UPDATE', true, true),
      ('Admins can delete materials', 'DELETE', true, false)
    ) AS expected(policyname, cmd, requires_using, requires_check)
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies p
      WHERE p.schemaname = 'public'
        AND p.tablename = 'materials'
        AND p.policyname = v_policy.policyname
        AND p.cmd = v_policy.cmd
        AND p.permissive = 'PERMISSIVE'
        AND p.roles @> ARRAY['authenticated']::name[]
        AND (
          NOT v_policy.requires_using
          OR position('check_is_admin' IN coalesce(p.qual, '')) > 0
        )
        AND (
          NOT v_policy.requires_check
          OR position('check_is_admin' IN coalesce(p.with_check, '')) > 0
        )
    ) THEN
      RAISE EXCEPTION 'materials contract: expected admin/owner % policy is missing or changed', v_policy.cmd;
    END IF;
  END LOOP;

  IF EXISTS (
    SELECT 1
    FROM pg_policies p
    WHERE p.schemaname = 'public'
      AND p.tablename = 'materials'
      AND p.cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND p.policyname NOT IN (
        'Admins can insert materials',
        'Admins can update materials',
        'Admins can delete materials',
        'Allow all access to admin users'
      )
  ) THEN
    RAISE EXCEPTION 'materials contract: unexpected write policy exists';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies p
    WHERE p.schemaname = 'public'
      AND p.tablename = 'materials'
      AND p.policyname = 'Allow all access to admin users'
      AND (
        p.cmd <> 'ALL'
        OR p.permissive <> 'PERMISSIVE'
        OR NOT p.roles @> ARRAY['public']::name[]
        OR position('user_roles.user_id = auth.uid()' IN coalesce(p.qual, '')) = 0
        OR position('user_roles.role = ''admin''' IN coalesce(p.qual, '')) = 0
        OR position('user_roles.user_id = auth.uid()' IN coalesce(p.with_check, p.qual, '')) = 0
        OR position('user_roles.role = ''admin''' IN coalesce(p.with_check, p.qual, '')) = 0
      )
  ) THEN
    RAISE EXCEPTION 'materials contract: secondary admin-only policy changed';
  END IF;

  IF has_function_privilege('anon', 'public.increment_material_access_count(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'materials contract: anon can execute material counter RPC';
  END IF;

  IF NOT has_function_privilege('authenticated', 'public.increment_material_access_count(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'materials contract: authenticated access to invoker counter RPC changed unexpectedly';
  END IF;

  IF NOT has_function_privilege('service_role', 'public.increment_material_access_count(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'materials contract: service_role access to invoker counter RPC changed unexpectedly';
  END IF;
END
$$;
