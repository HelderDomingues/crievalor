-- Fix pré-existente (não causado pela Fase A):
-- get_user_accessible_products() parte B referenciava w.plan_id (coluna
-- removida de workspaces). O plano vem de subscriptions.plan_id —
-- mesmo padrão da parte A, que funciona. Sintomas anteriores:
-- 42703 "column w.plan_id does not exist" ao ler materials/material_folders
-- quando a policy "Users see materials for their product" era avaliada.
CREATE OR REPLACE FUNCTION public.get_user_accessible_products()
  RETURNS text[]
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
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
    SELECT s.plan_id INTO plan_name
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
$function$;
