-- Keep the materials catalog publicly readable; only admin/owner RLS policies may write.
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.materials;

-- API roles need only explicit read for the public catalog. Authenticated DML grants
-- remain for admin/owner policies; RLS remains the write authorization boundary.
REVOKE ALL PRIVILEGES ON TABLE public.materials FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.materials TO anon, authenticated;

-- Anonymous access must not call the invoker RPC that updates materials.access_count.
REVOKE EXECUTE ON FUNCTION public.increment_material_access_count(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_material_access_count(uuid) TO authenticated, service_role;
