-- EMERGENCY ROLLBACK ONLY: restores the prior authenticated-wide materials writes.
-- This deliberately reopens the vulnerability. Prefer a forward fix; run only with explicit approval.

BEGIN;

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
    'CREATE POLICY %I ON storage.objects FOR SELECT USING (bucket_id = %L)',
    policy_prefix || 'SELECT',
    bucket_name
  );

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

  RETURN true;
END;
$function$;

SELECT public.setup_storage_bucket_policies('materials');

COMMIT;
