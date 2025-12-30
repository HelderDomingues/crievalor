-- Migration: 20251230_fix_rls_recursion.sql
-- Description: Fixes infinite recursion in RLS policies by using SECURITY DEFINER functions.

-- 1. Create a robust, non-recursive check function for admin/owner
-- This function runs with the privileges of the creator (postgres) bypassing RLS.
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

-- 2. Drop the recursive or problematic policies
-- Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- User Roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Other tables (fixing potentially ambiguous or recursive policies)
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage all testimonials" ON public.testimonials;

-- 3. Create fixed versions using the security definer function

-- Profiles Table
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.check_is_admin());

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR public.check_is_admin());

-- User Roles Table
CREATE POLICY "Users can view own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id OR public.check_is_admin());

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles FOR ALL 
USING (public.check_is_admin());

-- Posts Table
CREATE POLICY "Admins can manage all posts" 
ON public.posts FOR ALL 
USING (public.check_is_admin());

-- Testimonials Table
CREATE POLICY "Admins can manage all testimonials" 
ON public.testimonials FOR ALL 
USING (public.check_is_admin());

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO service_role;
