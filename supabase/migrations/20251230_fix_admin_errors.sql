-- Migration: 20251230_fix_admin_errors.sql
-- Description: Fixes RLS recursion, grants required permissions for admin functions, and resolves column mismatches.

-- 1. Create/Update robust admin check function
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  );
END;
$$;

-- 2. Grant permissions for administrative RPC functions
-- These are required by the frontend setup and management tools
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO service_role;

-- Grant access to storage setup functions (fixes the 403 Forbidden errors)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'setup_storage_bucket_policies') THEN
        GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text) TO service_role;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_bucket_if_not_exists') THEN
        GRANT EXECUTE ON FUNCTION public.create_bucket_if_not_exists(text, boolean) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.create_bucket_if_not_exists(text, boolean) TO service_role;
    END IF;
END $$;

-- 3. Fix RLS policies to prevent infinite recursion
-- Profiles Table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.check_is_admin());

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR public.check_is_admin());

-- User Roles Table
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id OR public.check_is_admin());

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles FOR ALL 
USING (public.check_is_admin());

-- 4. Fix other administrative tables
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts" 
ON public.posts FOR ALL 
USING (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can manage all testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage all testimonials" 
ON public.testimonials FOR ALL 
USING (public.check_is_admin());
