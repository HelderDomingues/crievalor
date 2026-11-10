CREATE OR REPLACE FUNCTION public.setup_storage_bucket_policies(bucket_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  bucket_exists boolean;
  policy_prefix text;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE name = bucket_name
  ) INTO bucket_exists;

  IF NOT bucket_exists THEN
    RAISE NOTICE 'Bucket "%" does not exist, skipping policy setup', bucket_name;
    RETURN false;
  END IF;

  policy_prefix := 'Bucket policy for ' || bucket_name || ' - ';

  EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_prefix || 'SELECT');
  EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_prefix || 'INSERT');
  EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_prefix || 'UPDATE');
  EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_prefix || 'DELETE');

  EXECUTE format(
    'CREATE POLICY %I ON storage.objects FOR SELECT TO public USING (bucket_id = %L)',
    policy_prefix || 'SELECT',
    bucket_name
  );

  IF bucket_name = 'materials' THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %L AND public.check_is_admin())',
      policy_prefix || 'INSERT',
      bucket_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %L AND public.check_is_admin()) WITH CHECK (bucket_id = %L AND public.check_is_admin())',
      policy_prefix || 'UPDATE',
      bucket_name,
      bucket_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %L AND public.check_is_admin())',
      policy_prefix || 'DELETE',
      bucket_name
    );
  ELSE
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role''))',
      policy_prefix || 'INSERT',
      bucket_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR UPDATE USING (bucket_id = %L AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role''))',
      policy_prefix || 'UPDATE',
      bucket_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR DELETE USING (bucket_id = %L AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role''))',
      policy_prefix || 'DELETE',
      bucket_name
    );
  END IF;

  RAISE NOTICE 'Storage policies for bucket "%" created successfully', bucket_name;
  RETURN true;
END;
$function$;

SELECT public.setup_storage_bucket_policies('materials');

REVOKE EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.setup_storage_bucket_policies(text)
  TO service_role, postgres;
