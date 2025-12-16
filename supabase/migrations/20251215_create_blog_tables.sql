-- Create Categories Table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_slug_key UNIQUE (slug)
);

-- Create Posts Table
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NULL,
    cover_image_url TEXT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE NULL,
    author_id UUID NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_slug_key UNIQUE (slug)
);

-- Create Post Categories Junction Table
CREATE TABLE public.post_categories (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    CONSTRAINT post_categories_pkey PRIMARY KEY (post_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Posts: Everyone can view published posts
CREATE POLICY "Public posts are viewable by everyone" ON public.posts
    FOR SELECT USING (published = true);

-- Posts: Admins can do everything
CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Categories: Everyone can view categories
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

-- Categories: Admins can manage categories
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
