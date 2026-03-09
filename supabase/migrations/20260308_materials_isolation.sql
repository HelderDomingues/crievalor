-- Migration: Adicionar product_type a materials e material_folders
-- Permite isolamento total de materiais entre LUMIA e Oficina de Líderes

-- 5.1 Adicionar coluna product_type
ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'lumia'
  CHECK (product_type IN ('lumia', 'oficina_lideres', 'geral'));

ALTER TABLE public.material_folders
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'lumia'
  CHECK (product_type IN ('lumia', 'oficina_lideres', 'geral'));

-- 5.2 Criar função helper: retorna product_types acessíveis pelo usuário logado
CREATE OR REPLACE FUNCTION public.get_user_accessible_products()
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  accessible TEXT[] := '{}';
  plan_name TEXT;
BEGIN
  -- Verificar assinatura ativa na tabela subscriptions
  SELECT s.plan_id INTO plan_name
  FROM public.subscriptions s
  WHERE s.user_id = auth.uid()
    AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  IF plan_name IN ('basico', 'intermediario', 'avancado') THEN
    accessible := array_append(accessible, 'lumia');
    accessible := array_append(accessible, 'geral');
  END IF;
  
  IF plan_name = 'oficina_lideres' THEN
    accessible := array_append(accessible, 'oficina_lideres');
    accessible := array_append(accessible, 'geral');
  END IF;
  
  -- Membros de workspace
  IF NOT EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = auth.uid() AND status = 'active'
  ) THEN
    SELECT w.plan_id INTO plan_name
    FROM public.workspace_members wm
    JOIN public.workspaces w ON w.id = wm.workspace_id
    JOIN public.subscriptions s ON s.workspace_id = w.id
    WHERE wm.user_id = auth.uid()
      AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
    
    IF plan_name IN ('basico', 'intermediario', 'avancado') THEN
      accessible := array_append(accessible, 'lumia');
      accessible := array_append(accessible, 'geral');
    END IF;
  END IF;
  
  RETURN accessible;
END;
$$;

-- 5.3 Remendar RLS da tabela materials
DROP POLICY IF EXISTS "Public can view materials" ON public.materials;
DROP POLICY IF EXISTS "Anyone can view materials" ON public.materials;
DROP POLICY IF EXISTS "Authenticated can view materials" ON public.materials;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.materials;

CREATE POLICY "Users see materials for their product"
  ON public.materials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
    OR
    product_type = ANY(public.get_user_accessible_products())
  );

-- 5.4 Remendar RLS da tabela material_folders
DROP POLICY IF EXISTS "Enable read access for all users" ON public.material_folders;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.material_folders;

CREATE POLICY "Users see folders for their product"
  ON public.material_folders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
    OR
    product_type = ANY(public.get_user_accessible_products())
  );
