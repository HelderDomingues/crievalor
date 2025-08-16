-- Corrigir as funções restantes que ainda não têm search_path

-- 1. Função create_user_roles
CREATE OR REPLACE FUNCTION public.create_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.user_roles (user_id, role, email, name)
    VALUES (NEW.id, 'user', NEW.email, NEW.full_name)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$function$;

-- 2. Função insert_user_role_on_signup
CREATE OR REPLACE FUNCTION public.insert_user_role_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if not exists (
    select 1 from public.user_roles where user_id = new.id and role = 'user'
  ) then
    insert into public.user_roles (user_id, role, email, name, created_at)
    values (new.id, 'user', new.email, coalesce(new.raw_user_meta_data->>'full_name', null), now());
  end if;
  return new;
end;
$function$;

-- 3. Função setup_asaas_customers_rls_policies
CREATE OR REPLACE FUNCTION public.setup_asaas_customers_rls_policies()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can insert their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can update their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can delete their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Service role can manage all Asaas customer data" ON public.asaas_customers;
  
  ALTER TABLE public.asaas_customers ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view their own Asaas customer data" 
  ON public.asaas_customers
  FOR SELECT 
  USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own Asaas customer data" 
  ON public.asaas_customers
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own Asaas customer data" 
  ON public.asaas_customers
  FOR UPDATE 
  USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own Asaas customer data" 
  ON public.asaas_customers
  FOR DELETE 
  USING (auth.uid() = user_id);
  
  CREATE POLICY "Service role can manage all Asaas customer data" 
  ON public.asaas_customers
  USING (current_setting('role') = 'service_role'::text);
  
  RETURN true;
END;
$function$;