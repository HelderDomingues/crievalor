
-- Este arquivo cria uma função SQL que permite executar
-- comandos SQL de dentro de uma função Edge
-- Usado principalmente pela função setup-storage-policies

-- Criar função exec_sql se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_proc
    WHERE proname = 'exec_sql'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Criar função para executar SQL com segurança
    -- Esta função só deve ser chamada por funções Edge com a chave de serviço
    EXECUTE '
      CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN true;
      EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION ''Error executing SQL: %'', SQLERRM;
        RETURN false;
      END;
      $$;
    ';
    
    -- Comentário para documentar a função
    COMMENT ON FUNCTION public.exec_sql(text) IS 
      'Executes arbitrary SQL. DANGER: This function should only be called by Edge Functions with service role key.';
  END IF;
END
$$;

-- Configurar permissões restritas
REVOKE ALL ON FUNCTION public.exec_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
