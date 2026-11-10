-- Database-only metadata probes. Every storage.objects write is rolled back; no file bytes are created.

BEGIN;
SET LOCAL ROLE anon;
DO $$
BEGIN
  BEGIN
    INSERT INTO storage.objects (bucket_id, name)
    VALUES ('materials', '__materials_rls_probe_anon_' || gen_random_uuid()::text);
    RAISE EXCEPTION 'materials Storage smoke: anon INSERT unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
ROLLBACK;

BEGIN;
SELECT set_config('materials_rls.test_id', gen_random_uuid()::text, true);
INSERT INTO storage.objects (id, bucket_id, name)
VALUES (
  current_setting('materials_rls.test_id')::uuid,
  'materials',
  '__materials_rls_probe_regular_' || current_setting('materials_rls.test_id')
);
SELECT set_config(
  'request.jwt.claim.sub',
  (SELECT candidate::text
   FROM (SELECT gen_random_uuid() AS candidate) generated
   WHERE NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = generated.candidate)),
  true
);
SELECT set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('request.jwt.claim.sub', true),
    'role', 'authenticated'
  )::text,
  true
);
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v_rows integer;
BEGIN
  IF public.check_is_admin() THEN
    RAISE EXCEPTION 'materials Storage smoke: synthetic regular user was unexpectedly admin/owner';
  END IF;

  UPDATE storage.objects
  SET name = name || '-blocked-update'
  WHERE id = current_setting('materials_rls.test_id')::uuid;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'materials Storage smoke: regular authenticated UPDATE changed % rows', v_rows;
  END IF;

  PERFORM set_config('storage.allow_delete_query', 'true', true);
  DELETE FROM storage.objects
  WHERE id = current_setting('materials_rls.test_id')::uuid;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'materials Storage smoke: regular authenticated DELETE changed % rows', v_rows;
  END IF;

  BEGIN
    INSERT INTO storage.objects (bucket_id, name)
    VALUES ('materials', '__materials_rls_probe_regular_denied_' || gen_random_uuid()::text);
    RAISE EXCEPTION 'materials Storage smoke: regular authenticated INSERT unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
ROLLBACK;

BEGIN;
SELECT set_config(
  'request.jwt.claim.sub',
  (SELECT user_id::text FROM public.user_roles WHERE role = 'admin' LIMIT 1),
  true
);
SELECT set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('request.jwt.claim.sub', true),
    'role', 'authenticated'
  )::text,
  true
);
SELECT set_config('materials_rls.test_id', gen_random_uuid()::text, true);
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v_object_id uuid := current_setting('materials_rls.test_id')::uuid;
  v_rows integer;
BEGIN
  IF NOT public.check_is_admin() THEN
    RAISE EXCEPTION 'materials Storage smoke: selected admin did not pass check_is_admin()';
  END IF;

  INSERT INTO storage.objects (id, bucket_id, name, owner)
  VALUES (v_object_id, 'materials', '__materials_rls_probe_admin', auth.uid());

  UPDATE storage.objects
  SET name = name || '-updated'
  WHERE id = v_object_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials Storage smoke: admin UPDATE did not change one row';
  END IF;

  PERFORM set_config('storage.allow_delete_query', 'true', true);
  DELETE FROM storage.objects WHERE id = v_object_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials Storage smoke: admin DELETE did not remove one row';
  END IF;
END;
$$;
ROLLBACK;

BEGIN;
SELECT set_config(
  'request.jwt.claim.sub',
  (SELECT user_id::text FROM public.user_roles WHERE role = 'owner' LIMIT 1),
  true
);
SELECT set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('request.jwt.claim.sub', true),
    'role', 'authenticated'
  )::text,
  true
);
SELECT set_config('materials_rls.test_id', gen_random_uuid()::text, true);
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v_object_id uuid := current_setting('materials_rls.test_id')::uuid;
  v_rows integer;
BEGIN
  IF NOT public.check_is_admin() THEN
    RAISE EXCEPTION 'materials Storage smoke: selected owner did not pass check_is_admin()';
  END IF;

  INSERT INTO storage.objects (id, bucket_id, name, owner)
  VALUES (v_object_id, 'materials', '__materials_rls_probe_owner', auth.uid());

  UPDATE storage.objects
  SET name = name || '-updated'
  WHERE id = v_object_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials Storage smoke: owner UPDATE did not change one row';
  END IF;

  PERFORM set_config('storage.allow_delete_query', 'true', true);
  DELETE FROM storage.objects WHERE id = v_object_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials Storage smoke: owner DELETE did not remove one row';
  END IF;
END;
$$;
ROLLBACK;

SELECT count(*) AS probe_rows
FROM storage.objects
WHERE bucket_id = 'materials'
  AND name LIKE '__materials_rls_probe_%';
