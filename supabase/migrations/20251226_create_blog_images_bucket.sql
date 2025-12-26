-- 1. Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog_images', 'blog_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts (clean slate)
DROP POLICY IF EXISTS "Public Access blog_images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload blog_images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update blog_images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete blog_images" ON storage.objects;

-- 3. Create Policy: Public Read Access (Everyone can view images)
CREATE POLICY "Public Access blog_images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog_images' );

-- 4. Create Policy: Authenticated Upload (Only logged-in users can upload)
-- Note: Replace 'authenticated' with specific logic if you want only admins
CREATE POLICY "Auth Upload blog_images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'blog_images' AND auth.role() = 'authenticated' );

-- 5. Create Policy: Authenticated Update (Only logged-in users can update)
CREATE POLICY "Auth Update blog_images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'blog_images' AND auth.role() = 'authenticated' );

-- 6. Create Policy: Authenticated Delete (Only logged-in users can delete)
CREATE POLICY "Auth Delete blog_images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'blog_images' AND auth.role() = 'authenticated' );
