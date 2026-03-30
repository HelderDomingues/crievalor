const pg = require('pg');

const connectionString = 'postgresql://postgres:zuvse1-bersan-piQxyq@db.nmxfknwkhnengqqjtwru.supabase.co:5432/postgres';

const sql = `
-- 1. material_folders: Restore administrative write access
DROP POLICY IF EXISTS "Admins can insert folders" ON public.material_folders;
CREATE POLICY "Admins can insert folders"
  ON public.material_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can update folders" ON public.material_folders;
CREATE POLICY "Admins can update folders"
  ON public.material_folders
  FOR UPDATE
  TO authenticated
  USING (public.check_is_admin())
  WITH CHECK (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can delete folders" ON public.material_folders;
CREATE POLICY "Admins can delete folders"
  ON public.material_folders
  FOR DELETE
  TO authenticated
  USING (public.check_is_admin());

-- 2. materials: Restore administrative write access
DROP POLICY IF EXISTS "Admins can insert materials" ON public.materials;
CREATE POLICY "Admins can insert materials"
  ON public.materials
  FOR INSERT
  TO authenticated
  WITH CHECK (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can update materials" ON public.materials;
CREATE POLICY "Admins can update materials"
  ON public.materials
  FOR UPDATE
  TO authenticated
  USING (public.check_is_admin())
  WITH CHECK (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can delete materials" ON public.materials;
CREATE POLICY "Admins can delete materials"
  ON public.materials
  FOR DELETE
  TO authenticated
  USING (public.check_is_admin());

-- 3. Grant execute on RPCs just in case
GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text) TO service_role;
`;

async function applyFix() {
    const client = new pg.Client({ connectionString });
    try {
        await client.connect();
        console.log("Conectado ao banco de dados...");
        await client.query(sql);
        console.log("Políticas de RLS aplicadas com sucesso!");
    } catch (err) {
        console.error("Erro ao aplicar políticas:", err);
    } finally {
        await client.end();
    }
}

applyFix();
