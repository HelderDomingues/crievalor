-- ============================================================
-- Smoke Fase B — dentro de transação com rollback completo.
-- RED antes da migração (anon ainda executa), GREEN depois.
-- ============================================================
BEGIN;

-- 1) anon NÃO executa is_admin() (representativo de todas as 10; as demais
--    são cobertas pelo contrato de ACL read-only)
SET LOCAL ROLE anon;
DO $smoke$
BEGIN
  BEGIN
    PERFORM public.is_admin();
    RAISE EXCEPTION 'secdb_phaseB_smoke: anon executed is_admin()';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL; -- esperado
  END;
END$smoke$;

-- 2) anon continua lendo tabelas públicas sem erro de função
SELECT count(*) FROM public.lectures;
SELECT count(*) FROM public.profiles; -- anon (policy re-alvo) = 0 rows, sem erro
RESET ROLE;

-- 3) authenticated continua executando check_is_admin() (retorna boolean)
SET LOCAL ROLE authenticated;
DO $smoke2$
DECLARE v_is_admin boolean;
BEGIN
  v_is_admin := public.check_is_admin();
  IF v_is_admin IS NULL THEN
    RAISE EXCEPTION 'secdb_phaseB_smoke: authenticated cannot call check_is_admin()';
  END IF;
END$smoke2$;
RESET ROLE;

-- 4) admin real visualiza user_roles (policy re-alvo mantém admin)
-- Seed como postgres/owner (tabelas não têm FORCE RLS; sem JWT ainda)
-- e depois atingir como authenticated com claims.
DO $smoke3$
DECLARE
  v_admin_sub text;
  v_count bigint;
BEGIN
  SELECT user_id::text INTO v_admin_sub
  FROM public.user_roles WHERE role='admin' LIMIT 1;
  IF v_admin_sub IS NULL THEN
    RAISE NOTICE 'secdb_phaseB_smoke: no admin user seeded; skipping admin visibility check';
  ELSE
    PERFORM set_config('request.jwt.claims',
      json_build_object('sub', v_admin_sub, 'role', 'authenticated')::text, true);
    SET LOCAL ROLE authenticated;
    SELECT count(*) INTO v_count FROM public.user_roles;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'secdb_phaseB_smoke: admin sees 0 user_roles rows after re-target';
    END IF;
    RAISE NOTICE 'secdb_phaseB_smoke: admin visible roles = %', v_count;
  END IF;
END$smoke3$;
RESET ROLE;

ROLLBACK;
