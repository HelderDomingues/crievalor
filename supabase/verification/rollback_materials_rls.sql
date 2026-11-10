-- Emergency rollback only: this deliberately restores the broad write exposure.
BEGIN;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER
ON TABLE public.materials TO anon;

GRANT EXECUTE
ON FUNCTION public.increment_material_access_count(uuid) TO anon;

CREATE POLICY "Enable all access for authenticated users"
ON public.materials
AS PERMISSIVE
FOR ALL
TO public
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

COMMIT;
