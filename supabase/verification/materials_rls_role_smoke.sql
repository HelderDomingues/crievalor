-- Manual linked-DB smoke test. All write probes run in transactions and roll back.

BEGIN;
SET LOCAL ROLE anon;
DO $$
DECLARE
  v_rows bigint;
BEGIN
  SELECT count(*) INTO v_rows FROM public.materials;
  IF v_rows = 0 THEN
    RAISE EXCEPTION 'materials smoke: anon SELECT returned no rows';
  END IF;
END
$$;
ROLLBACK;

BEGIN;
SELECT set_config(
  'request.jwt.claim.sub',
  (SELECT candidate::text
   FROM (SELECT gen_random_uuid() AS candidate) generated
   WHERE NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = generated.candidate)),
  true
) <> '' AS regular_user_claim_set;
SELECT set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('request.jwt.claim.sub', true),
    'role', 'authenticated'
  )::text,
  true
) <> '' AS regular_user_claims_set;
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v_material_id uuid;
  v_before integer;
  v_after integer;
  v_rows integer;
BEGIN
  IF public.check_is_admin() THEN
    RAISE EXCEPTION 'materials smoke: synthetic regular user was unexpectedly admin/owner';
  END IF;

  SELECT id, access_count
  INTO v_material_id, v_before
  FROM public.materials
  ORDER BY id
  LIMIT 1;

  IF v_material_id IS NULL THEN
    RAISE EXCEPTION 'materials smoke: no row available for regular-user probes';
  END IF;

  UPDATE public.materials
  SET title = title || ' [blocked write probe]'
  WHERE id = v_material_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'materials smoke: regular authenticated UPDATE changed % rows', v_rows;
  END IF;

  DELETE FROM public.materials WHERE id = v_material_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'materials smoke: regular authenticated DELETE changed % rows', v_rows;
  END IF;

  BEGIN
    INSERT INTO public.materials (title, description, category, file_url, plan_level)
    VALUES ('__materials_rls_denied__', 'RLS probe', 'rls-test', 'https://example.invalid/rls-probe', 'general');
    RAISE EXCEPTION 'materials smoke: regular authenticated INSERT unexpectedly succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      NULL;
  END;

  PERFORM public.increment_material_access_count(v_material_id);
  SELECT access_count INTO v_after FROM public.materials WHERE id = v_material_id;
  IF v_after IS DISTINCT FROM v_before THEN
    RAISE EXCEPTION 'materials smoke: regular authenticated counter call changed access_count';
  END IF;
END
$$;
ROLLBACK;

BEGIN;
SELECT set_config(
  'request.jwt.claim.sub',
  (SELECT user_id::text FROM public.user_roles WHERE role = 'admin' LIMIT 1),
  true
) <> '' AS admin_claim_set;
SELECT set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('request.jwt.claim.sub', true),
    'role', 'authenticated'
  )::text,
  true
) <> '' AS admin_claims_set;
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v_material_id uuid;
  v_rows integer;
BEGIN
  IF NOT public.check_is_admin() THEN
    RAISE EXCEPTION 'materials smoke: selected admin did not pass check_is_admin()';
  END IF;

  INSERT INTO public.materials (title, description, category, file_url, plan_level)
  VALUES ('__materials_rls_admin_' || gen_random_uuid()::text, 'RLS probe', 'rls-test', 'https://example.invalid/rls-probe', 'general')
  RETURNING id INTO v_material_id;

  UPDATE public.materials SET title = title || ' updated' WHERE id = v_material_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials smoke: admin UPDATE did not change one row';
  END IF;

  DELETE FROM public.materials WHERE id = v_material_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials smoke: admin DELETE did not remove one row';
  END IF;
END
$$;
ROLLBACK;

BEGIN;
SELECT set_config(
  'request.jwt.claim.sub',
  (SELECT user_id::text FROM public.user_roles WHERE role = 'owner' LIMIT 1),
  true
) <> '' AS owner_claim_set;
SELECT set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('request.jwt.claim.sub', true),
    'role', 'authenticated'
  )::text,
  true
) <> '' AS owner_claims_set;
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v_material_id uuid;
  v_rows integer;
BEGIN
  IF NOT public.check_is_admin() THEN
    RAISE EXCEPTION 'materials smoke: selected owner did not pass check_is_admin()';
  END IF;

  INSERT INTO public.materials (title, description, category, file_url, plan_level)
  VALUES ('__materials_rls_owner_' || gen_random_uuid()::text, 'RLS probe', 'rls-test', 'https://example.invalid/rls-probe', 'general')
  RETURNING id INTO v_material_id;

  UPDATE public.materials SET title = title || ' updated' WHERE id = v_material_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials smoke: owner UPDATE did not change one row';
  END IF;

  DELETE FROM public.materials WHERE id = v_material_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'materials smoke: owner DELETE did not remove one row';
  END IF;
END
$$;
ROLLBACK;
