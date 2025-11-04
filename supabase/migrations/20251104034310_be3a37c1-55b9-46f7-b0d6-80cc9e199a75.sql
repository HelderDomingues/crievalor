-- ============================================
-- FASE 1: LIMPAR TABELAS E FUNÇÕES OBSOLETAS
-- ============================================

-- Drop tabela asaas_customers (obsoleta - não usa mais API Asaas)
DROP TABLE IF EXISTS public.asaas_customers CASCADE;

-- Drop funções RLS obsoletas relacionadas ao Asaas
DROP FUNCTION IF EXISTS public.setup_asaas_customers_rls_policies() CASCADE;

-- ============================================
-- FASE 2: CORRIGIR AMBIGUIDADE DE user_id
-- ============================================

-- Recriar função setup_subscriptions_rls_policies com qualificação explícita de tabela
DROP FUNCTION IF EXISTS public.setup_subscriptions_rls_policies() CASCADE;

CREATE OR REPLACE FUNCTION public.setup_subscriptions_rls_policies()
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Drop políticas existentes
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
  
  -- Habilitar RLS
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
  
  -- Criar políticas com qualificação explícita de tabela (subscriptions.user_id)
  CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = subscriptions.user_id);
  
  CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = subscriptions.user_id);
  
  CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = subscriptions.user_id);
  
  CREATE POLICY "Users can delete their own subscriptions"
    ON public.subscriptions
    FOR DELETE
    USING (auth.uid() = subscriptions.user_id);
  
  CREATE POLICY "Service role can manage all subscriptions"
    ON public.subscriptions
    USING (current_setting('role') = 'service_role'::text);
  
  RETURN;
END;
$$;

-- ============================================
-- FASE 3: VERIFICAR E CORRIGIR OUTRAS FUNÇÕES
-- ============================================

-- Comentário: A migração removeu:
-- 1. Tabela asaas_customers (obsoleta)
-- 2. Função setup_asaas_customers_rls_policies (obsoleta)
-- 3. Corrigiu ambiguidade em setup_subscriptions_rls_policies
-- 
-- A tabela subscriptions foi MANTIDA pois é usada para armazenar
-- informações locais de assinaturas (mesmo sem integração com API)