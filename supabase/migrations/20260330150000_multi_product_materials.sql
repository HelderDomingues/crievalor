-- Migration: Isolamento de Materiais por Múltiplos Produtos
-- Permite que materiais e pastas pertençam a vários produtos simultaneamente
-- Atualiza regra do "geral" (apenas para quem tem assinatura/produto ativo)
-- Inclui produtos atribuídos via user_products

BEGIN;

-- 1. Atualizar a função de permissões primeiro para evitar quebra de view/policies temporariamente
CREATE OR REPLACE FUNCTION public.get_user_accessible_products()
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  accessible TEXT[] := '{}';
  plan_name TEXT;
  has_any_access BOOLEAN := FALSE;
BEGIN
  -- A. Verificar assinatura ativa direta
  SELECT s.plan_id INTO plan_name
  FROM public.subscriptions s
  WHERE s.user_id = auth.uid()
    AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  IF plan_name IS NOT NULL THEN
    has_any_access := TRUE;
    IF plan_name IN ('basico', 'intermediario', 'avancado') THEN
      accessible := array_append(accessible, 'lumia');
    ELSIF plan_name = 'oficina_lideres' THEN
      accessible := array_append(accessible, 'oficina_lideres');
    END IF;
  END IF;
  
  -- B. Verificar assinatura via workspace (se não tem assinatura direta)
  IF NOT has_any_access THEN
    SELECT w.plan_id INTO plan_name
    FROM public.workspace_members wm
    JOIN public.workspaces w ON w.id = wm.workspace_id
    JOIN public.subscriptions s ON s.workspace_id = w.id
    WHERE wm.user_id = auth.uid()
      AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
    
    IF plan_name IS NOT NULL THEN
      has_any_access := TRUE;
      IF plan_name IN ('basico', 'intermediario', 'avancado') THEN
        accessible := array_append(accessible, 'lumia');
      END IF;
    END IF;
  END IF;

  -- C. Verificar produtos atribuídos manualmente via user_products
  FOR plan_name IN 
    SELECT p.slug 
    FROM public.user_products up
    JOIN public.products p ON p.id = up.product_id
    WHERE up.user_id = auth.uid() AND up.status = 'active'
  LOOP
    has_any_access := TRUE;
    accessible := array_append(accessible, plan_name);
  END LOOP;
  
  -- D. Só tem acesso ao 'geral' se tiver QUALQUER acesso ativo
  IF has_any_access THEN
    accessible := array_append(accessible, 'geral');
  END IF;
  
  RETURN accessible;
END;
$$;

-- 2. Atualizar tabelas para usar array de slugs em vez de texto único
-- Para materials
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS product_types TEXT[] DEFAULT '{lumia,geral}';

-- Migrar dados existentes de product_type para product_types
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='materials' AND column_name='product_type') THEN
    UPDATE public.materials SET product_types = ARRAY[product_type] WHERE product_type IS NOT NULL;
    ALTER TABLE public.materials DROP COLUMN product_type CASCADE;
  END IF;
END $$;

-- Para material_folders
ALTER TABLE public.material_folders ADD COLUMN IF NOT EXISTS product_types TEXT[] DEFAULT '{lumia,geral}';

-- Migrar dados existentes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='material_folders' AND column_name='product_type') THEN
    UPDATE public.material_folders SET product_types = ARRAY[product_type] WHERE product_type IS NOT NULL;
    ALTER TABLE public.material_folders DROP COLUMN product_type CASCADE;
  END IF;
END $$;


-- 3. Atualizar as políticas RLS (para usar o operador de interseção de arrays &&)

-- Em materials
DROP POLICY IF EXISTS "Users see materials for their product" ON public.materials;

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
    product_types && public.get_user_accessible_products()
  );

-- Em material_folders
DROP POLICY IF EXISTS "Users see folders for their product" ON public.material_folders;

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
    product_types && public.get_user_accessible_products()
  );

COMMIT;
