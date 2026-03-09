-- 20260309_consolidated_user_fixes.sql
-- Summary: Fixes RLS infinite recursion and enables ON DELETE CASCADE for user deletion.

BEGIN;

-- ==========================================
-- 1. RLS FIXES (Broken Recursion)
-- ==========================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Workspace members can view their own members" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners can view members" ON public.workspace_members;
DROP POLICY IF EXISTS "Users can view workspaces they own or belong to" ON public.workspaces;

-- Helper function to check membership without recursion (using SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = p_workspace_id 
    AND user_id = auth.uid()
  );
$$;

-- New Workspace Policies
CREATE POLICY "Users can view workspaces they own or belong to"
ON public.workspaces
FOR SELECT
USING (
  owner_id = auth.uid() 
  OR public.is_workspace_member(id)
);

-- New Workspace Members Policies
CREATE POLICY "Members view hierarchy"
ON public.workspace_members
FOR SELECT
USING (
  user_id = auth.uid() -- View myself
  OR EXISTS (
    SELECT 1 FROM public.workspaces w 
    WHERE w.id = workspace_id AND w.owner_id = auth.uid()
  ) -- View my employees/members if I own the workspace
);

-- ==========================================
-- 2. FOREIGN KEY FIXES (Enable User Deletion)
-- ==========================================

-- profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- authors
ALTER TABLE public.authors DROP CONSTRAINT IF EXISTS authors_user_id_fkey;
ALTER TABLE public.authors ADD CONSTRAINT authors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- leads
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_user_id_fkey;
ALTER TABLE public.leads ADD CONSTRAINT leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- material_accesses
ALTER TABLE public.material_accesses DROP CONSTRAINT IF EXISTS material_accesses_user_id_fkey;
ALTER TABLE public.material_accesses ADD CONSTRAINT material_accesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- onboarding_content
ALTER TABLE public.onboarding_content DROP CONSTRAINT IF EXISTS onboarding_content_user_id_fkey;
ALTER TABLE public.onboarding_content ADD CONSTRAINT onboarding_content_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- quiz_answers
ALTER TABLE public.quiz_answers DROP CONSTRAINT IF EXISTS quiz_answers_user_id_fkey;
ALTER TABLE public.quiz_answers ADD CONSTRAINT quiz_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- quiz_respostas_completas
ALTER TABLE public.quiz_respostas_completas DROP CONSTRAINT IF EXISTS quiz_respostas_completas_user_id_fkey;
ALTER TABLE public.quiz_respostas_completas ADD CONSTRAINT quiz_respostas_completas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- quiz_submissions
ALTER TABLE public.quiz_submissions DROP CONSTRAINT IF EXISTS quiz_submissions_user_id_fkey;
ALTER TABLE public.quiz_submissions ADD CONSTRAINT quiz_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- subscriptions
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- user_products
ALTER TABLE public.user_products DROP CONSTRAINT IF EXISTS user_products_user_id_fkey;
ALTER TABLE public.user_products ADD CONSTRAINT user_products_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_products DROP CONSTRAINT IF EXISTS user_products_granted_by_fkey;
ALTER TABLE public.user_products ADD CONSTRAINT user_products_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- user_roles
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- whatsapp_conversations
ALTER TABLE public.whatsapp_conversations DROP CONSTRAINT IF EXISTS whatsapp_conversations_user_id_fkey;
ALTER TABLE public.whatsapp_conversations ADD CONSTRAINT whatsapp_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- workspace_members
ALTER TABLE public.workspace_members DROP CONSTRAINT IF EXISTS workspace_members_user_id_fkey;
ALTER TABLE public.workspace_members ADD CONSTRAINT workspace_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.workspace_members DROP CONSTRAINT IF EXISTS workspace_members_user_id_fkey_profiles;
ALTER TABLE public.workspace_members ADD CONSTRAINT workspace_members_user_id_fkey_profiles FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- workspaces
ALTER TABLE public.workspaces DROP CONSTRAINT IF EXISTS workspaces_owner_id_fkey;
ALTER TABLE public.workspaces ADD CONSTRAINT workspaces_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- posts
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE public.posts ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

COMMIT;
