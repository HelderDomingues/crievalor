-- Migration: Fix RLS policies for the products catalog table
-- Description: The `products` table was created without admin write policies,
-- causing 400 errors when admins attempt to create, update, or delete products.
-- This migration adds the missing INSERT, UPDATE, and DELETE policies, and
-- also ensures the general SELECT policy is in place.

-- 1. SELECT: Everyone can read active products (needed by member area)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (is_active = true OR public.check_is_admin());

-- 2. INSERT: Only admins can create products in the catalog
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.check_is_admin());

-- 3. UPDATE: Only admins can update products
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.check_is_admin())
  WITH CHECK (public.check_is_admin());

-- 4. DELETE: Only admins can delete products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.check_is_admin());
