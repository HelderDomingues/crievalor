-- Create authors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NULL,
    bio TEXT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT NULL,
    social_links JSONB DEFAULT '{}'::jsonb,
    website TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT authors_pkey PRIMARY KEY (id)
);

-- Enable RLS on authors
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Authors RLS: Public read access
CREATE POLICY "Authors are viewable by everyone" ON public.authors
    FOR SELECT USING (true);

-- Authors RLS: Admins can manage
CREATE POLICY "Admins can manage authors" ON public.authors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Add display_author_id to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS display_author_id UUID REFERENCES public.authors(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_posts_display_author_id ON public.posts(display_author_id);
