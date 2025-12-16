```sql
-- 1. Disable the "Open Gates" policies (from Reset Script)
DROP POLICY IF EXISTS "Migration Access Posts" ON public.posts;
DROP POLICY IF EXISTS "Temporary Migration Access Posts" ON public.posts; -- Safety fallback

DROP POLICY IF EXISTS "Migration Access Categories" ON public.categories;
DROP POLICY IF EXISTS "Temporary Migration Access Categories" ON public.categories; -- Safety fallback

DROP POLICY IF EXISTS "Migration Access PostCategories" ON public.post_categories;
DROP POLICY IF EXISTS "Temporary Migration Access PostCategories" ON public.post_categories; -- Safety fallback

-- 2. Re-create Public Read Policies
CREATE POLICY "Public posts are viewable by everyone" ON public.posts
    FOR SELECT USING (published = true);

CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Post Categories are viewable by everyone" ON public.post_categories
    FOR SELECT USING (true);

-- 3. Re-create Admin Manage Policies (Fixed Ambiguity)
-- We use alias 'ur' to explicitly reference the user_roles table columns
CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage post_categories" ON public.post_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );
