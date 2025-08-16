-- Limpar e reconfigurar políticas RLS para diagnostic_requests
-- Primeiro, remover todas as políticas existentes
DROP POLICY IF EXISTS "Admins can manage all diagnostics" ON public.diagnostic_requests;
DROP POLICY IF EXISTS "Public can insert diagnostic requests" ON public.diagnostic_requests;
DROP POLICY IF EXISTS "Anyone can insert diagnostic requests" ON public.diagnostic_requests;
DROP POLICY IF EXISTS "Public can view diagnostic requests" ON public.diagnostic_requests;

-- Garantir que RLS está habilitado
ALTER TABLE public.diagnostic_requests ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (necessário para o formulário funcionar)
CREATE POLICY "Public can insert diagnostic requests" 
ON public.diagnostic_requests
FOR INSERT 
WITH CHECK (true);

-- Política para admins visualizarem e gerenciarem todos os dados
CREATE POLICY "Admins can manage all diagnostic requests" 
ON public.diagnostic_requests
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- IMPORTANTE: Nenhuma política SELECT para público = dados protegidos
-- Apenas admins autenticados podem ver os dados sensíveis