-- Migration: Fix RLS permissions for materials and material_folders
-- Description: Adds missing INSERT, UPDATE, and DELETE policies for admin users

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

-- 3. Grant execute on RPCs just in case (as seen in logs)
GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text) TO service_role;
