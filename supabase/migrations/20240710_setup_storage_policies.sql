
-- Setup storage bucket policies function
CREATE OR REPLACE FUNCTION public.setup_storage_policies(bucket_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  bucket_id TEXT := bucket_name;
  policy_prefix TEXT := 'Bucket policy for ' || bucket_name || ' - ';
BEGIN
  -- Drop existing policies to avoid conflicts
  BEGIN
    -- SELECT policy may already exist
    DROP POLICY IF EXISTS (policy_prefix || 'SELECT') ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    -- INSERT policy may already exist
    DROP POLICY IF EXISTS (policy_prefix || 'INSERT') ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    -- UPDATE policy may already exist
    DROP POLICY IF EXISTS (policy_prefix || 'UPDATE') ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    -- DELETE policy may already exist
    DROP POLICY IF EXISTS (policy_prefix || 'DELETE') ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Create policy for public read access
  CREATE POLICY (policy_prefix || 'SELECT')
    ON storage.objects FOR SELECT
    USING (bucket_id = setup_storage_policies.bucket_name);
  
  -- Create policy for authenticated users to insert
  CREATE POLICY (policy_prefix || 'INSERT')
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = setup_storage_policies.bucket_name
      AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );
  
  -- Create policy for authenticated users to update their own objects
  CREATE POLICY (policy_prefix || 'UPDATE')
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = setup_storage_policies.bucket_name
      AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );
  
  -- Create policy for authenticated users to delete their own objects
  CREATE POLICY (policy_prefix || 'DELETE')
    ON storage.objects FOR DELETE
    USING (
      bucket_id = setup_storage_policies.bucket_name
      AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );
  
  RETURN TRUE;
END;
$$;

-- Ensure the storage objects table has RLS enabled
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
