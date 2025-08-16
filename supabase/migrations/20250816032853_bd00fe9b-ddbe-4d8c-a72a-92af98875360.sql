-- Corrigir todas as funções restantes que não têm search_path configurado

-- 1. Função create_table_if_not_exists
CREATE OR REPLACE FUNCTION public.create_table_if_not_exists(table_name text, table_definition text)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = table_name
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'CREATE TABLE public.' || table_name || ' ' || table_definition;
  END IF;

  RETURN;
END;
$function$;

-- 2. Função execute_sql (primeira versão)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  EXECUTE sql_query;
END;
$function$;

-- 3. Função get_user_emails
CREATE OR REPLACE FUNCTION public.get_user_emails()
RETURNS TABLE(email text)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY 
    SELECT u.email FROM auth.users u;
END;
$function$;

-- 4. Função increment_material_access_count
CREATE OR REPLACE FUNCTION public.increment_material_access_count(material_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.materials
  SET access_count = access_count + 1
  WHERE id = material_id;
END;
$function$;