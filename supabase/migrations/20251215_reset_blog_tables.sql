-- HARD RESET: Drop everything related to the blog to clear the "Ambiguous Loop" and partial data
DROP TABLE IF EXISTS public.post_categories CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- 1. Re-Create Categories Table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 2. Re-Create Posts Table
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT NULL,
    cover_image_url TEXT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE NULL,
    author_id UUID NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- 3. Re-Create Junction Table
CREATE TABLE public.post_categories (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    CONSTRAINT post_categories_pkey PRIMARY KEY (post_id, category_id)
);

-- 4. Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- 5. APPLY "OPEN GATES" POLICIES DIRECTLY (No buggy admin policies yet)
-- This allows the migration script (Anon) to INSERT data without errors.
CREATE POLICY "Migration Access Posts" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Migration Access Categories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Migration Access PostCategories" ON public.post_categories
    FOR ALL USING (true) WITH CHECK (true);
