
-- Função para configurar políticas RLS da tabela subscriptions
CREATE OR REPLACE FUNCTION public.setup_subscriptions_rls_policies()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remover políticas existentes para evitar conflitos
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
  
  -- Habilitar RLS na tabela subscriptions
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
  
  -- Política para permitir aos usuários visualizar suas próprias assinaturas
  CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Política para permitir aos usuários inserir suas próprias assinaturas
  CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Política para permitir aos usuários atualizar suas próprias assinaturas
  CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);
  
  -- Política para permitir aos usuários excluir suas próprias assinaturas
  CREATE POLICY "Users can delete their own subscriptions"
    ON public.subscriptions
    FOR DELETE
    USING (auth.uid() = user_id);
  
  -- Política para permitir ao service role gerenciar todas as assinaturas
  CREATE POLICY "Service role can manage all subscriptions"
    ON public.subscriptions
    USING (current_setting('role') = 'service_role'::text);
  
  RETURN true;
END;
$$;

-- Função para configurar políticas RLS da tabela asaas_customers
CREATE OR REPLACE FUNCTION public.setup_asaas_customers_rls_policies()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remover políticas existentes para evitar conflitos
  DROP POLICY IF EXISTS "Users can view their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can insert their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can update their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can delete their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Service role can manage all Asaas customer data" ON public.asaas_customers;
  
  -- Habilitar RLS na tabela asaas_customers
  ALTER TABLE public.asaas_customers ENABLE ROW LEVEL SECURITY;
  
  -- Política para permitir aos usuários visualizar seus próprios dados de cliente
  CREATE POLICY "Users can view their own Asaas customer data"
    ON public.asaas_customers
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Política para permitir aos usuários inserir seus próprios dados de cliente
  CREATE POLICY "Users can insert their own Asaas customer data"
    ON public.asaas_customers
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Política para permitir aos usuários atualizar seus próprios dados de cliente
  CREATE POLICY "Users can update their own Asaas customer data"
    ON public.asaas_customers
    FOR UPDATE
    USING (auth.uid() = user_id);
  
  -- Política para permitir aos usuários excluir seus próprios dados de cliente
  CREATE POLICY "Users can delete their own Asaas customer data"
    ON public.asaas_customers
    FOR DELETE
    USING (auth.uid() = user_id);
  
  -- Política para permitir ao service role gerenciar todos os dados de cliente
  CREATE POLICY "Service role can manage all Asaas customer data"
    ON public.asaas_customers
    USING (current_setting('role') = 'service_role'::text);
  
  RETURN true;
END;
$$;

-- Aplicar as funções para configurar as políticas RLS
SELECT public.setup_subscriptions_rls_policies();
SELECT public.setup_asaas_customers_rls_policies();
