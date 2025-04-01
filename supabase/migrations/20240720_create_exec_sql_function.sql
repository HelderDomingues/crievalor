
-- Create a function to execute arbitrary SQL (to be used in edge functions for policy setup)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create a function to apply storage policies to buckets
CREATE OR REPLACE FUNCTION public.apply_storage_policies(bucket_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Ensure storage.objects has RLS enabled
  ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
  
  -- Drop any existing policies for this bucket
  EXECUTE 'DROP POLICY IF EXISTS "Public read access for ' || bucket_name || '" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Auth users can upload to ' || bucket_name || '" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Auth users can update own ' || bucket_name || ' objects" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Auth users can delete own ' || bucket_name || ' objects" ON storage.objects';
  
  -- Create policy for public read access
  EXECUTE 'CREATE POLICY "Public read access for ' || bucket_name || '"
    ON storage.objects FOR SELECT
    USING (bucket_id = ''' || bucket_name || ''')';
  
  -- Create policy for authenticated users to insert
  EXECUTE 'CREATE POLICY "Auth users can upload to ' || bucket_name || '"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = ''' || bucket_name || '''
      AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role'')
    )';
  
  -- Create policy for authenticated users to update their own objects
  EXECUTE 'CREATE POLICY "Auth users can update own ' || bucket_name || ' objects"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = ''' || bucket_name || '''
      AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role'')
    )';
  
  -- Create policy for authenticated users to delete their own objects
  EXECUTE 'CREATE POLICY "Auth users can delete own ' || bucket_name || ' objects"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = ''' || bucket_name || '''
      AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role'')
    )';
END;
$$;
