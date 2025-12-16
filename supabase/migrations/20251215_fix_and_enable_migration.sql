-- 1. Drop existing policies that are causing "ambiguous column" errors and blocking inserts
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;

-- 2. Create Temporary "Open Gates" Policies for Migration
-- This allows the migration script (running as Anon) to INSERT data.
CREATE POLICY "Temporary Migration Access Posts" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Temporary Migration Access Categories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

-- 3. Ensure RLS is enabled on post_categories and add policy
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Temporary Migration Access PostCategories" ON public.post_categories;

CREATE POLICY "Temporary Migration Access PostCategories" ON public.post_categories
    FOR ALL USING (true) WITH CHECK (true);
