DO $$
DECLARE
  v_assertions_passed boolean := false;
  v_policy record;
  v_expected record;
BEGIN
  BEGIN
    IF NOT public.setup_storage_bucket_policies('materials') THEN
      RAISE EXCEPTION 'materials Storage helper test: materials bucket was not configured';
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
         OR NOT (v_policy.roles @> ARRAY['authenticated']::name[])
         OR v_policy.roles @> ARRAY['anon']::name[]
         OR v_policy.roles @> ARRAY['public']::name[] THEN
        RAISE EXCEPTION 'materials Storage helper test: % policy has unsafe roles', v_expected.cmd;
      END IF;

      IF v_expected.cmd IN ('INSERT', 'UPDATE')
         AND (
           position('check_is_admin' IN coalesce(v_policy.with_check, '')) = 0
           OR position('bucket_id' IN coalesce(v_policy.with_check, '')) = 0
         ) THEN
        RAISE EXCEPTION 'materials Storage helper test: % WITH CHECK is incomplete', v_expected.cmd;
      END IF;

      IF v_expected.cmd IN ('UPDATE', 'DELETE')
         AND (
           position('check_is_admin' IN coalesce(v_policy.qual, '')) = 0
           OR position('bucket_id' IN coalesce(v_policy.qual, '')) = 0
         ) THEN
        RAISE EXCEPTION 'materials Storage helper test: % USING is incomplete', v_expected.cmd;
      END IF;
    END LOOP;

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
      RAISE EXCEPTION 'materials Storage helper test: public SELECT policy was not preserved';
    END IF;

    v_assertions_passed := true;
    RAISE EXCEPTION 'materials Storage helper test rollback sentinel';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'materials Storage helper test rollback sentinel' THEN
      RAISE;
    END IF;
  END;

  IF NOT v_assertions_passed THEN
    RAISE EXCEPTION 'materials Storage helper test: assertions did not complete';
  END IF;
END;
$$;
