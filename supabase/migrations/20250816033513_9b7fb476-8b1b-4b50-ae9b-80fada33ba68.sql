-- Corrigir as últimas duas funções
-- setup_subscriptions_rls_policies e update_updated_at_column

CREATE OR REPLACE FUNCTION public.setup_subscriptions_rls_policies()
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
  
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own subscriptions"
    ON public.subscriptions
    FOR DELETE
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Service role can manage all subscriptions"
    ON public.subscriptions
    USING (current_setting('role') = 'service_role'::text);
  
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;