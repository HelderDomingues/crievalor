-- Migration: Criar workspaces e workspace_members para planos multi-assento
-- Executar no projeto Crie Valor (nmxfknwkhnengqqjtwru)

-- 3.1 Tabela workspaces (empresa/organização)
CREATE TABLE IF NOT EXISTS public.workspaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  plan_id       TEXT NOT NULL DEFAULT 'basico'
                CHECK (plan_id IN ('basico', 'intermediario', 'avancado')),
  seat_limit    INTEGER NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Tabela workspace_members (membros por workspace)
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('admin', 'member')),
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

-- 3.3 Adicionar workspace_id à tabela subscriptions
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- 3.4 Índices
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON public.workspaces (owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members (workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace ON public.subscriptions (workspace_id);

-- 3.5 RLS para workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Dono e membros podem ler o workspace
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Workspace members can read their workspace') THEN
    CREATE POLICY "Workspace members can read their workspace"
      ON public.workspaces
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() = owner_id
        OR EXISTS (
          SELECT 1 FROM public.workspace_members wm
          WHERE wm.workspace_id = workspaces.id
            AND wm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 3.6 RLS para workspace_members
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Membros podem ver outros membros do mesmo workspace
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Workspace members can read membership') THEN
    CREATE POLICY "Workspace members can read membership"
      ON public.workspace_members
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.workspace_members wm2
          WHERE wm2.workspace_id = workspace_members.workspace_id
            AND wm2.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 3.7 Triggers de timestamp
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_workspaces_updated_at') THEN
    CREATE TRIGGER trg_workspaces_updated_at
      BEFORE UPDATE ON public.workspaces
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
