DO $$
DECLARE
  v_policy record;
  v_expected record;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class
    WHERE oid = 'storage.objects'::regclass
      AND relrowsecurity
  ) THEN
    RAISE EXCEPTION 'materials Storage contract: RLS is not enabled on storage.objects';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'materials' AND "public"
  ) OR NOT has_table_privilege('anon', 'storage.objects', 'SELECT') THEN
    RAISE EXCEPTION 'materials Storage contract: public bucket reads are not available';
  END IF;

  SELECT * INTO v_policy
  FROM pg_policies
  WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Bucket policy for materials - SELECT';

  IF NOT FOUND
     OR v_policy.cmd <> 'SELECT'
     OR NOT (v_policy.roles @> ARRAY['public']::name[])
     OR position('bucket_id' IN coalesce(v_policy.qual, '')) = 0
     OR position('materials' IN coalesce(v_policy.qual, '')) = 0 THEN
    RAISE EXCEPTION 'materials Storage contract: public SELECT policy is missing or changed';
  END IF;

  IF position('if bucket_name = ''materials''' IN lower(
       pg_get_functiondef('public.setup_storage_bucket_policies(text)'::regprocedure)
     )) = 0
     OR position('public.check_is_admin()' IN pg_get_functiondef(
       'public.setup_storage_bucket_policies(text)'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'materials Storage contract: setup helper does not preserve the admin/owner materials boundary';
  END IF;

  FOR v_expected IN
    SELECT * FROM (VALUES
      ('INSERT', 'Bucket policy for materials - INSERT'),
      ('UPDATE', 'Bucket policy for materials - UPDATE'),
      ('DELETE', 'Bucket policy for materials - DELETE')
    ) AS expected(cmd, policyname)
  LOOP
    SELECT * INTO v_policy
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = v_expected.policyname;

    IF NOT FOUND
       OR v_policy.cmd <> v_expected.cmd
       OR v_policy.permissive <> 'PERMISSIVE'
       OR NOT (v_policy.roles @> ARRAY['authenticated']::name[])
       OR v_policy.roles @> ARRAY['anon']::name[]
       OR v_policy.roles @> ARRAY['public']::name[] THEN
      RAISE EXCEPTION 'materials Storage contract: % policy must target authenticated, not public', v_expected.cmd;
    END IF;

    IF v_expected.cmd IN ('INSERT', 'UPDATE')
       AND position('check_is_admin' IN coalesce(v_policy.with_check, '')) = 0 THEN
      RAISE EXCEPTION 'materials Storage contract: % WITH CHECK must require check_is_admin()', v_expected.cmd;
    END IF;

    IF v_expected.cmd = 'INSERT'
       AND position('bucket_id' IN coalesce(v_policy.with_check, '')) = 0 THEN
      RAISE EXCEPTION 'materials Storage contract: INSERT WITH CHECK must keep writes in the materials bucket';
    END IF;

    IF v_expected.cmd IN ('UPDATE', 'DELETE')
       AND position('check_is_admin' IN coalesce(v_policy.qual, '')) = 0 THEN
      RAISE EXCEPTION 'materials Storage contract: % USING must require check_is_admin()', v_expected.cmd;
    END IF;

    IF v_expected.cmd = 'UPDATE'
       AND position('bucket_id' IN coalesce(v_policy.with_check, '')) = 0 THEN
      RAISE EXCEPTION 'materials Storage contract: UPDATE WITH CHECK must keep writes in the materials bucket';
    END IF;

    IF v_expected.cmd IN ('UPDATE', 'DELETE')
       AND position('bucket_id' IN coalesce(v_policy.qual, '')) = 0 THEN
      RAISE EXCEPTION 'materials Storage contract: % USING must keep writes in the materials bucket', v_expected.cmd;
    END IF;
  END LOOP;

  IF has_function_privilege('anon', 'public.setup_storage_bucket_policies(text)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.setup_storage_bucket_policies(text)', 'EXECUTE')
     OR NOT has_function_privilege('service_role', 'public.setup_storage_bucket_policies(text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'materials Storage contract: setup helper must remain service_role-only';
  END IF;
END;
$$;
