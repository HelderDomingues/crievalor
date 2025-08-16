-- Corrigir todas as funções com search_path não configurado
-- Isso resolve os warnings de segurança relacionados ao search_path mutable

-- 1. Função get_system_setting
CREATE OR REPLACE FUNCTION public.get_system_setting(setting_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value 
  FROM public.system_settings 
  WHERE key = setting_key;
  
  RETURN setting_value;
END;
$function$;

-- 2. Função is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  admin_check BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) INTO admin_check;

  RETURN admin_check;
END;
$function$;

-- 3. Função is_quiz_admin
CREATE OR REPLACE FUNCTION public.is_quiz_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (SELECT user_email IN (
    'helder@crievalor.com.br'
  ));
END;
$function$;