-- Portfólio Crie Valor: persistência real (substitui o mock em memória de src/services/portfolioService.ts)
-- Arquivo de migration do repo: supabase/migrations/20261108120000_portfolio_projects.sql
-- Aplicar pelo fluxo de migrations (supabase db push / supabase migration up) por quem tem acesso ao projeto nmxfknwkhnengqqjtwru.
-- Segurança: leitura pública; escrita só para quem passa em public.check_is_admin() (user_roles com role 'admin' ou 'owner').

BEGIN;

-- 0) PRÉ-REQUISITO: public.user_roles e public.check_is_admin().
-- Fonte no repo: supabase/migrations/20251230_fix_admin_errors.sql e 20251230_fix_rls_recursion.sql (mesma definição abaixo).
-- Se user_roles não existir, a migration PARA aqui com erro claro (nada é criado).
DO $$
BEGIN
  IF to_regclass('public.user_roles') IS NULL THEN
    RAISE EXCEPTION 'Pre-requisito ausente: public.user_roles. Aplique antes as migrations de usuarios/roles do repo (20250708230126..., 20251230_user_management_rls.sql, 20251230_fix_admin_errors.sql).';
  END IF;
END $$;

-- Mesma função das migrations existentes (CREATE OR REPLACE idempotente: se já estiver aplicada, nada muda).
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $fn$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  );
END;
$fn$;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO service_role;


CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  category    text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cover_image text NOT NULL,
  gallery     text[] NOT NULL DEFAULT '{}',
  project_date date,                       -- opcional: o admin permite deixar a Data em branco
  project_url text,
  client      text,
  tags        text[] NOT NULL DEFAULT '{}',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_projects_order_idx
  ON public.portfolio_projects (sort_order, created_at DESC);

CREATE OR REPLACE FUNCTION public.portfolio_projects_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.portfolio_projects_set_updated_at();

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Portfolio: leitura publica" ON public.portfolio_projects;
CREATE POLICY "Portfolio: leitura publica"
  ON public.portfolio_projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Portfolio: admin insere" ON public.portfolio_projects;
CREATE POLICY "Portfolio: admin insere"
  ON public.portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (public.check_is_admin());

DROP POLICY IF EXISTS "Portfolio: admin altera" ON public.portfolio_projects;
CREATE POLICY "Portfolio: admin altera"
  ON public.portfolio_projects FOR UPDATE
  TO authenticated
  USING (public.check_is_admin())
  WITH CHECK (public.check_is_admin());

DROP POLICY IF EXISTS "Portfolio: admin exclui" ON public.portfolio_projects;
CREATE POLICY "Portfolio: admin exclui"
  ON public.portfolio_projects FOR DELETE
  TO authenticated
  USING (public.check_is_admin());

GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;

-- Projeto CDL aprovado pelo Helder em 08/11/2026, com as imagens que já estão no bucket "portfolio".
-- Não insere os 6 projetos de exemplo (mocks) de propósito.
INSERT INTO public.portfolio_projects
  (title, category, description, cover_image, gallery, project_date, project_url, client, tags)
SELECT
  'Melhores do Varejo Campo Grande/MS 2026 - Sistema de votação',
  'Web Design',
  'Sistema web de votação criado para o prêmio Melhores do Varejo 2026 da CDL Campo Grande. O público escolhe os melhores comércios e serviços de Campo Grande/MS em 28 categorias, com cadastro, votação por categoria e painel interno de acompanhamento da apuração.',
  'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157157349.png',
  ARRAY[
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157173658.png',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157193638.png',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157200946.png',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157208322.png',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157215246.jpg',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157222237.jpg',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157229145.jpg',
    'https://nmxfknwkhnengqqjtwru.supabase.co/storage/v1/object/public/portfolio/1794157236151.jpg'
  ],
  NULL,
  'https://melhores.cdlcampogrande.com.br',
  'CDL Campo Grande',
  ARRAY['votação online','Melhores do Varejo','CDL','sistema web','painel de apuração']
WHERE NOT EXISTS (
  SELECT 1 FROM public.portfolio_projects
  WHERE project_url = 'https://melhores.cdlcampogrande.com.br'
);

COMMIT;

-- Verificação (rodar depois):
-- SELECT id, title, client, array_length(gallery,1) AS imagens, project_date FROM public.portfolio_projects;
